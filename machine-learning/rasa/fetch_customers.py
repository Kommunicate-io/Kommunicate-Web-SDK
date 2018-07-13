from pymongo import MongoClient
from datetime import datetime, timedelta
from config.config import get_config
from sys import argv
import time
import datetime
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

current_time_stamp = time.time()*1000

#fetching last update time from Node
response = requests.get(env.cron_endpoint + '/' +env.cron_key)
print(response.text)
data = json.loads(response.text)
last_update_time = int(data['lastRunTime'])

# appkeys = ['2222','1111']
for data in collection.find({'created_at':{'$gte':current_time_stamp, '$lte':last_update_time}}).distinct('applicationId'):
    appkeys.append(str(data))
r = requests.post(env.rasa_endpoint,headers={'content-type':'application/json'},
                  data=json.dumps({'data':appkeys,
                                   'lastRunTime':str(current_time_stamp)}))
    
r = requests.post(env.rasa_endpoint,headers={'content-type':'application/json'},data=json.dumps({'data':appkeys}))
print (r.text)
