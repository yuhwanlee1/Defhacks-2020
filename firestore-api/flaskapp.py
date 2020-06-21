from twilio.rest import Client
from twilio import twiml
from twilio.twiml.messaging_response import Body, Message, Redirect, MessagingResponse
from credentials import TWILIO_AUTH_TOKEN, TWILIO_NUMBER, FLOW_SID, SQL_DB_URL
import json
import requests
from db import store_request
import pytz
from datetime import datetime

from flask import Flask
app = Flask(__name__)

def get_information(request, number):
    response = requests.get(SQL_DB_URL + number).json()[0]
    name = response["name"]
    hospital = response["hospital"]
    department = response["department"]
    store_request(name, number, request, hospital, department)

@app.route('/')
def get_latest_request():
    account_sid = "AC23b11706c15419572416541d1953d6ee"

    client = Client(account_sid, TWILIO_AUTH_TOKEN)

    flow = client.studio.v1.flows(FLOW_SID).fetch()
    recent_context = flow.executions.list()[0].execution_context().fetch().context
    context_json = json.loads(json.dumps(recent_context))
    # print(json.dumps(context_json, indent=2))

    unformatted_date = context_json["widgets"]["confirmation"]["outbound"]["DateCreated"]
    final_date = format_date(unformatted_date)

    request = context_json["flow"]["variables"]["user_request"] + "/" + final_date
    # print("request:", request)
    incoming_number = context_json["contact"]["channel"]["address"]
    # print("incoming number:", incoming_number)
    get_information(request, incoming_number)
    return "Success"


def format_date(date):
    date_obj = datetime.strptime(date, "%Y-%m-%dT%H:%M:%S.%fZ")
    cleaner_date = datetime(year=date_obj.year, month=date_obj.month, day=date_obj.day, hour=date_obj.hour,
                            minute=date_obj.minute, tzinfo=pytz.utc)
    final_date = cleaner_date.astimezone(pytz.timezone("US/Eastern")).strftime("%H:%M %m-%d-%Y") + " EST"
    return final_date