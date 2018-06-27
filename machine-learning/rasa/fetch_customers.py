from pymongo import MongoClient
from datetime import datetime, timedelta
import time
import requests
import json
client = MongoClient('mongodb://applozicdba:applozicdba@ec2-184-72-95-64.compute-1.amazonaws.com:27017/kommunicate?authSource=admin')
db = client['kommunicate']
collection = db['knowledgebase']
appid = []
appkey = ['kommunicate-support','applozic-sample-app']

for data in collection.find({'created_at':{'$gte':(time.time() - 86400)*1000}}).distinct('applicationId'):
    appid.append(str(data))
r = requests.post('http://localhost:5001/train',headers={'content-type':'application/json'},data=json.dumps({'data':appid}))
