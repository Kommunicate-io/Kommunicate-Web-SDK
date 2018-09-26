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
print(last_update_time)

# appkeys = ['2222','1111']
appkeys = set()

new_data = list(collection.find({'updated_at':{'$gte':last_update_time, 
                                          '$lte':current_time_stamp}, 'type':'faq'}))
print('\n\n\n\n\n')

faq_add = {}
faq_delete = {}
faq_update = {}

for data in new_data:
    if data['status'] != 'un_answered':
        data_id = data['_id']
        del data['_id']
        #print(data)

        try:
            appkeys.add(data['applicationId'])
        except KeyError:
            print("applicationId not found, this might happen if its very old record.")
            continue
        print(data)
        if data['created_at'] >= last_update_time:
            if data['deleted'] == True or 'deleted-at' in data:
                #new create is placed and then deleted, so no need to do anything for that
                #simply remove that entity from Mongo
                collection.remove({'_id':data_id})
                continue
            else:
                if faq_add.get(data['applicationId'], None) is None:
                    faq_add[data['applicationId']] = []
                faq_add[data['applicationId']].append(data)
        else:
            if data['deleted'] == True:
                if faq_delete.get(data['applicationId'], None) is None:
                    faq_delete[data['applicationId']] = []
                faq_delete[data['applicationId']].append(data)
                #delete data from knowledgebase
                collection.remove({'_id':data_id})
            else:
                if faq_update.get(data['applicationId'], None) is None:
                    faq_update[data['applicationId']] = []
                faq_update[data['applicationId']].append(data)
        print('\n\n\n\n')

appkeys = list(appkeys)

#raise req to faq/add
for key in faq_add:
    r = requests.post(env.rasa_endpoint+'faq/add',headers={'content-type':'application/json'},data=json.dumps(faq_add[key]))
    print(r.text)
    print('Data inserted from bot\'s database for applicationId :', key)

#raise req for faq bot to faq/delete
for key in faq_delete:
    r = requests.post(env.rasa_endpoint+'faq/delete',headers={'content-type':'application/json'},data=json.dumps(faq_delete[key]))
    print(r.text)
    print('Data deleted from bot\'s database for applicationId :', key)

#raise req to faq/update
for key in faq_update:
    r = requests.post(env.rasa_endpoint+'faq/update',headers={'content-type':'application/json'},data=json.dumps(faq_update[key]))
    print(r.text)
    print('Data updated for applicationId :', key)

#to train bots with new data
r = requests.post(env.rasa_endpoint+'train',headers={'content-type':'application/json'},
                  data=json.dumps({'data':appkeys,
                                   'lastRunTime':str(current_time_stamp)}))
print (appkeys)