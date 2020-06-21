'use strict'
import XPath from 'xpath'
import _ from 'lodash'

const Dom = require('xmldom').DOMParser

export default function adapter(config) {

    return {
        /**
         * convertCSDToDBEntry - converts a CSD provider into a MySQL database entry in the form of an array
         *
         * @param  {String} entity An CSD XML representation of the provider
         * @return {Object}        A JSON object containing the provider's name and phone number
         */
        convertCSDToDBEntry: function (entity) {
            entity = entity.replace(/\s\s+/g, '')
            entity = entity.replace(/.xmlns.*?\"(.*?)\"/g, '')
            const doc = new Dom().parseFromString(entity)
            const uuid = XPath.select('/facility/@entityID', doc)[0].value
            const dept = XPath.select('/facility/primaryName/text()', doc)[0].toString()
            const name = XPath.select('/facility/contact/person/name/commonName/text()', doc)[0].toString()
            const telNodes = XPath.select('/facility/contactPoint/codedType[@code="BP" and @codingScheme="urn:ihe:iti:csd:2013:contactPoint"]/text()', doc)
            let tels = []
            telNodes.forEach((telNode) => {
                tels.push(telNode.toString())
            })
            if (dept == null || dept == undefined || dept === "") {
                throw new Error(`Couldn\'t find a name for the facility with UUID ${uuid}`)
            }
            if (name == null || name == undefined || name === "") {
                throw new Error(`Couldn\'t find a provider associated with the facility with UUID ${uuid}`)
            }
            if (tels.length === 0) {
                throw new Error(`Couldn\'t find a telephone number for the facility with UUID ${uuid}`)
            }
            const entry = {
                "department": dept,
                "name": name,
                "phone": tels[0]
            }
            return entry
        }
    }
}