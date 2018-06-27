from pymongo import MongoClient
from datetime import datetime, timedelta
import time
import requests
from config.default import *
import json
client = MongoClient(mongo_url)
db = client['kommunicate']
collection = db['knowledgebase']
appkeys = []
#testappkeys = ['kommunicate-support','applozic-sample-app']
for data in collection.find({'created_at':{'$gte':(time.time() - 8640000)*1000}}).distinct('applicationId'):
    appkeys.append(str(data))
for key in appkeys:
    print key
r = requests.post(rasa_endpoint,headers={'content-type':'application/json'},data=json.dumps({'data':appkeys}))
print r.text
