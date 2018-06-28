from pymongo import MongoClient
from datetime import datetime, timedelta
from config.config import get_config
from sys import argv
import time
import requests
import json
if(len(argv) < 2):
    env = get_config(None)
else:
    env = get_config(argv[1])
client = MongoClient(env.mongo_url)
db = client['kommunicate']
collection = db['knowledgebase']
appkeys = []
#testappkeys = ['kommunicate-support','applozic-sample-app']
for data in collection.find({'created_at':{'$gte':(time.time() - 86400)*1000}}).distinct('applicationId'):
    appkeys.append(str(data))
for key in appkeys:
    print key
r = requests.post(env.rasa_endpoint,headers={'content-type':'application/json'},data=json.dumps({'data':appkeys}))
print r.text
