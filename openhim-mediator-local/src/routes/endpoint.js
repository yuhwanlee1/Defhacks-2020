'use strict'

import logger from '../logger'
import openinfoman from '../openinfoman'
import openhim from '../openhim'
import _adapter from '../adapter'
import XPath from 'xpath'
import _ from 'underscore'
import axios from 'axios'
import { snakeCase } from "snake-case"
import { DOMParser } from 'xmldom'
import { buildReturnObject, _urn } from './utils'
import { fetchConfig } from 'openhim-mediator-utils'

module.exports = (_req, res) => {
  fetchConfig(openhim.config, (err, newConfig) => {
    let config = newConfig

    logger.info('Update Triggered...')

    let orchestrations = []
    const OIM = openinfoman(config.openinfoman)
    const adapter = _adapter(config)

    function reportFailure(err) {
      res.writeHead(500, { 'Content-Type': 'application/json+openhim' })
      logger.error(err.stack)
      logger.error('Something went wrong; relaying error to OpenHIM-core.')
      const response = buildReturnObject(
        'Failed',
        500,
        err.stack,
        orchestrations
      )
      res.end(response)
    }

    logger.info('Pulling facilties from OpenInfoMan...')
    OIM.fetchAllEntities((err, CSDDoc, orchs) => {
      if (orchs) {
        orchestrations = orchestrations.concat(orchs)
      }
      if (err) {
        return reportFailure(err)
      }
      if (!CSDDoc) {
        return reportFailure(new Error('No CSD document returned.'))
      }
      logger.info('Done fetching facilities.')

      //extract CSD entities
      const doc = new DOMParser().parseFromString(CSDDoc)
      //console.log(doc)
      const select = XPath.useNamespaces({ 'csd': 'urn:ihe:iti:csd:2013' })
      let entities = select('/csd:CSD/csd:facilityDirectory/csd:facility', doc)
      entities = entities.map((entity) => entity.toString())
      logger.info(`Converting ${entities.length} CSD entities to database entries...`)
      let entries = entities.map((entity) => {
        try {
          return adapter.convertCSDToDBEntry(entity)
        } catch (err) {
          logger.warn(`${err.message}, skipping facility.`)
          return null
        }
      }).filter((c) => {
        return c !== null
      })
      logger.info(`Adding/Updating ${entries.length} entries to database...`)
      const tableName = snakeCase(config.facility)
      const url = `http://35.209.62.112:3000/${tableName}`
      logger.info(`Sending put request to ${url}`)
      axios.put(url, entries)
        .then(function(response) {
          logger.info(`Successfully updated database.`)
          const returnObject = buildReturnObject(
            'Successful',
            200,
            'Endpoint Response!',
            orchestrations
          )
          res.set('Content-Type', 'application/json+openhim')
          res.send(returnObject)
        })
        .catch(function(err) {
          logger.error(`Failed to update database.`)
          return reportFailure(err)
        })
    })
  })
}