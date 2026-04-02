# /*
# Name: Kendall Beam
# Assignment: PyMongo and MongoDB
# Description: <#short desc of file#>
# Filename: beamk_pymon-1.py
# Date: 4/2/26
# */
# AI usage: none


# 1. Create the above Collection Customer
# 2. Delete all records in the Customer collection to clean up the database
# 3. Insert Many to insert 3 separate customer records in the Customer collection
# 4. Update one customer's email to a different email, update another customer's phone # to a different phone #
# 5. Query one customer based on last name, and query another customer based on first name
# 6. Drop Collection Customer

from pymongo import MongoClient #for connection
from pymongo.errors import ConnectionFailure #for error

from typing import TypedDict #for type hint
from pymongo.collection import Collection #for type hint


"""
firstName: { type: String, required: true }
lastName: { type: String, required: true }, 
email: { type: String, required: true, unique: true } <= unique seems hard to enforce like this
phone: { type: String, required: true }
"""
# just creates a type hint, doesnt enforce types at runtime
class Customer(TypedDict):
    firstName: str
    lastName: str
    email: str
    phone: str


#setup connection
try:
    client: MongoClient = MongoClient("mongodb://127.0.0.1:27017/")
#handle connection error
except ConnectionFailure as err:
    print("Connection failed:\n", err)

else:
    # create/use db
    db = client["ics385_week11"]


    # 1. create/use Customer collection
    collection: Collection[Customer] = db["Customers"]


    # 2. eqiv to drop table if exists, else create
    collection.delete_many({})


    # 3. insertMany() customers
        # needed type for pylance to calm
    customerList: list[Customer] = [
        {"firstName": "John", "lastName": "Doe", "email": "jdoe@gmail.com", "phone": "(808)867-5309"},
        {"firstName": "Jane", "lastName": "Doe", "email": "jdoe2@gmail.com", "phone": "(808)867-9309"},
        {"firstName": "Justin", "lastName": "Case", "email": "jcase@gmail.com", "phone": "(809)867-5309"}
    ]
    insertResult = collection.insert_many(customerList)
    # print(insertResult)


    # 4. update an email, phone number
    updateResult = collection.update_one({"firstName": "Jane", "lastName": "Doe"}, 
                          {"$set": {"email": "janeD@gmail.com"}})
    # print(updateResult)

    updateResult = collection.update_one({"firstName": "Justin", "lastName": "Case"},
                          {"$set": {"phone": "(405)867-5309"}})
    # print(updateResult)


    # 5. query by firstName, lastName
    result = collection.find_one({"firstName" : "Jane"})
    print("Searching for Jane:\n", result)

    result = collection.find_one({"lastName" : "Case"})
    print("Searching for Case:\n", result)


    # 6. drop Customer collection
    collection.drop()

    if not ("Customers" in db.list_collection_names()):
        print("The collection has been successfully dropped")

    

