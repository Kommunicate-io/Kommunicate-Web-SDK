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

#fetchin last update time from Node
response = requests.get(env.cron_endpoint + '/FAQ_BOT')
data = json.loads(response.text)
last_update_time = data['update_time']
if (last_update_time != None):
    last_update_time = last_update_time[:len(last_update_time)-1]
    last_update_time = datetime.strptime(last_update_time, '%Y-%m-%dT%H:%M:%S.%f')
    last_update_timestamp = last_update_time.timestamp()
else:
    last_update_timestamp = 0

current_time_stamp = time.time()
current_time = datetime.datetime.utcfromtimestamp(current_time_stamp).isoformat() + 'Z'


#testappkeys = ['kommunicate-support','applozic-sample-app']
for data in collection.find({'created_at':{'$gte':current_time_stamp*1000, '$lte':last_update_timestamp*1000}}).distinct('applicationId'):
    appkeys.append(str(data))
r = requests.post(env.rasa_endpoint,headers={'content-type':'application/json'},
                  data=json.dumps({'data':appkeys,
                                   'cron_time_stamp':current_time}))
print (r.text)
