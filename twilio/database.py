from google.cloud import firestore
import os


def store_request(name, phone_number, request, hospital, department):
    os.environ[
        "GOOGLE_APPLICATION_CREDENTIALS"] = "C:/Users/worker1/PycharmProjects/Defhacks/defHacks-e389c283f718.json"
    db = firestore.Client().from_service_account_json("defHacks-e389c283f718.json")

    # request format: item, amount, urgency
    item, amount, urgency, date = request.split("/")

    document_reference = db.collection("guides").document()
    document_reference.set({
        "name": name,
        "phone number": phone_number,
        "item": item,
        "amount": amount,
        "urgency": urgency,
        "date": date,
        "hospital": hospital,
        "department": department
    })
