from pymongo import MongoClient
from datetime import datetime, timedelta
from config.config import get_config, cron_key
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

current_time_stamp = int(time.time()*1000)

#fetching last update time from Node
print('request sent to : ', env.rasa_endpoint)
response = requests.get(env.cron_endpoint + '/' +cron_key)
print(response.text)
data = json.loads(response.text)
last_update_time = int(data['lastRunTime'])

# appkeys = ['2222','1111']
appkeys = set()

# print(datetime.datetime.fromtimestamp(last_update_time).isoformat(), end='\n\n\n')
# print(datetime.datetime.fromtimestamp(current_time_stamp).isoformat())
new_data = collection.find({'updated_at':{'$gte':last_update_time, 
                                          '$lte':current_time_stamp}, 'type':'faq'})
print(new_data)
print('\n\n\n\n\n')
print(env.rasa_endpoint+'faq/add')
for data in new_data:
    if data['status'] != 'un_answered':
        data_id = data['_id']
        del data['_id']
        print(data)

        try:
            appkeys.add(data['applicationId'])
        except KeyError:
            print("applicationId not found, this might happen if its very old record.")
            continue
        
        if data['created_at']>=last_update_time:
            if data['deleted'] == True:
                #new create is placed and then deleted, so no need to do anything for that
                #simply remove that entity from Mongo
                collection.remove({'_id':data_id})
                continue
            else:
                #raise req to faq/add
                r = requests.post(env.rasa_endpoint+'faq/add',headers={'content-type':'application/json'},data=data)
                print('Data added for applicationId :', data['applicationId'])
        else:
            if data['deleted'] == True:
                #raise req for faq bot to faq/delete
                r = requests.post(env.rasa_endpoint+'faq/delete',headers={'content-type':'application/json'},data=data)
                print('Data deleted from bot\'s database for applicationId :', data['applicationId'])
                #delete data from knowledgebase
                collection.remove({'_id':data_id})
            else:
                #raise req to faq/update
                r = requests.post(env.rasa_endpoint+'faq/update',headers={'content-type':'application/json'},data=data)
                print('Data updated for applicationId :', data['applicationId'])
        print('\n\n\n\n')

appkeys = list(appkeys)
#to train bots with new data
r = requests.post(env.rasa_endpoint+'train',headers={'content-type':'application/json'},
                  data=json.dumps({'data':appkeys,
                                   'lastRunTime':str(current_time_stamp)}))
print (appkeys)
