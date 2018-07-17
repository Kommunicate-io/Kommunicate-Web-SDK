import json
import random
from flask import Flask
from pathlib import Path
from subprocess import call, check_output
from rasa_core.agent import Agent
from rasa_core.policies.keras_policy import KerasPolicy
from rasa_core.policies.fallback import FallbackPolicy
from rasa_core.policies.memoization import MemoizationPolicy
from rasa_core.channels.custom import *
from rasa_core.interpreter import RasaNLUInterpreter
from ruamel.yaml import YAML
import boto3
from keras import backend as K
import botocore
import os
import datetime
from pymongo import MongoClient
from distutils.dir_util import copy_tree

from conf.config import get_config, cron_key, fallback_reply

app = Flask(__name__)

def environment_setter(*args, **kwargs):
    global env
    envi = kwargs['env']
    print(kwargs, end='\n\n\n\n\n\n\n')
    if(envi == ''):
        env = get_config(None)
        print('environment loaded default')
        # return app
    else:
        env = get_config(envi)
        print('environment loaded ', envi)
    return app


def getNextSeqenceCount():
    conn = MongoClient(env.uri)
    db = conn.kommunicate
    count = db.counter.find({'_id': 'knowledgebase_id'})

    data = []
    for i in count:
        data.append(i)
    data = data[0]

    counter = data['sequence_value'] + 1

    db.counter.update({
        '_id': data['_id']
    }, {
        '$inc': {
            'sequence_value': 1
        }
    }, upsert=False)
    return counter


def updateQusInMongo(name, applicationId):
    conn = MongoClient(env.uri)
    db = conn.kommunicate
    id = getNextSeqenceCount()
    data = {
        "id" : id,
        "category" : "faq",
        "name" : name,
        "content" : None,
        "created_at" : datetime.datetime.now(),
        "updated_at" : datetime.datetime.now(),
        "deleted_at" : None,
        "user_name" : 'FAQ_Bot',
        "applicationId" : applicationId,
        "status": "un_answered",
        "type": "faq"
    }
    db.knowledgebase.insert(data)
    print("Question added to Mongo Database")


class AgentMap(object):
    agent_map = {}

# #This is to create Log file to read logs from rasa
# import logging
# logging.basicConfig(filename='example.log',level=logging.DEBUG)

def get_abs_path(rel_path):
    return os.path.join(env.base_customer_path, rel_path)

#To upload data to AWS S3
def upload_training_data(applicationKey):
   s3 = env.s3
   bucket_name = env.bucket_name
   filename = "../customers/" + applicationKey + "/faq_data.json"
   #filename[13:] will be "applicationKey + Individual File Name"
   s3.meta.client.upload_file(filename, bucket_name, filename[13:])
   filename = "../customers/" + applicationKey + "/faq_domain.yml"
   s3.meta.client.upload_file(filename, bucket_name, filename[13:])
   filename = "../customers/" + applicationKey + "/faq_stories.md"
   s3.meta.client.upload_file(filename, bucket_name, filename[13:])
   filename = "../customers/" + applicationKey + "/faq_config.yml"
   s3.meta.client.upload_file(filename, bucket_name, filename[13:])

def update_domain(intent, answer, flag, appkey):
    yaml = YAML(typ='rt')
    yaml.default_flow_style = False
    bot_path = 'customers/' + appkey + '/faq_domain.yml'
    abs_bot_path = get_abs_path(bot_path)
    file = Path(abs_bot_path)
    data = yaml.load(open(abs_bot_path))
    if (flag == 0):
        data['intents'].append(intent)
        data['actions'].append('utter_' + intent)
    data['templates']['utter_' + intent] = [answer]
    yaml.indent(mapping=1, sequence=1, offset=0)
    yaml.dump(data, file)
    return


def update_stories(intent, appkey):
    num = str(random.randint(1, 2345678))
    bot_stories_path = 'customers/' + appkey + '/faq_stories.md'

    file = open(get_abs_path(bot_stories_path), 'a')
    file.write('\n\n## story_' + num)
    file.write('\n* ' + intent)
    file.write('\n - utter_' + intent)
    file.close()
    return


def update_nludata(intent, questions, appkey):
    data = {}
    with open(get_abs_path('customers/' + appkey + '/faq_data.json')) as json_file:
        data = json.load(json_file)
        for question in questions:
            data["rasa_nlu_data"]["common_examples"].append({"text": question, "intent": intent, "entities": []})
            data["rasa_nlu_data"]["common_examples"].append({"text": question, "intent": intent, "entities": []})
            data["rasa_nlu_data"]["common_examples"].append({"text": question, "intent": intent, "entities": []})
    with open(get_abs_path('customers/' + appkey + '/faq_data.json'), 'w') as outfile:
        json.dump(data, outfile, indent=3)
    return

def load_training_data(applicationKey):
    s3 = env.s3
    bucket_name = env.bucket_name
    parent = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
    path_customer = os.path.join(parent + "/customers/" + applicationKey)
    base_data = os.path.join(parent + "/customers/base-data")
    s3_path = applicationKey + "/"
    if(os.path.isdir(path_customer) is False):
        try:
            print ("Fetching training-data From S3:")
            os.mkdir('../customers/' + applicationKey)
            s3.Bucket(bucket_name).download_file(s3_path + 'faq_data.json', '../customers/' + applicationKey + '/faq_data.json')
            s3.Bucket(bucket_name).download_file(s3_path + 'faq_domain.yml', '../customers/' + applicationKey + '/faq_domain.yml')
            s3.Bucket(bucket_name).download_file(s3_path + 'faq_stories.md', '../customers/' + applicationKey + '/faq_stories.md')
            s3.Bucket(bucket_name).download_file(s3_path + 'faq_config.yml', '../customers/' + applicationKey + '/faq_config.yml')
        except botocore.exceptions.ClientError as e:
            if e.response['Error']['Code'] == "404":
                #the object does not exist
                print ("creating new customer files..")
                copy_tree(base_data, path_customer)
                upload_training_data(applicationKey)
                print ('Uploading data to S3..')
            else:
                    # Something else has gone wrong.
                    raise
    print('Data Loaded succesfully')

def load_models(appkey):
    parent = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
    path_model = os.path.join(parent + "/customers/" + appkey + "/models")
    if(os.path.isdir(path_model) is False):
        load_training_data(appkey)
        call(["python3 -m rasa_nlu.train --config ../customers/" + appkey + "/faq_config.yml --data ../customers/" + appkey + "/faq_data.json --path ../customers/" + appkey + "/models/nlu --fixed_model_name faq_model_v1"], shell=True)
        train_dialogue(get_abs_path("customers/" + appkey + "/faq_domain.yml"), get_abs_path("customers/" + appkey + "/models/dialogue"), get_abs_path("customers/" + appkey + "/faq_stories.md"))
    return


def load_agent(application_key):
    print ("loading agent for: " + application_key)
    load_models(application_key)
    interpreter = RasaNLUInterpreter(get_abs_path("customers/" + application_key + "/models/nlu/default/faq_model_v1"))
    agent = Agent.load(get_abs_path("customers/" + application_key + "/models/dialogue"), interpreter)

    AgentMap.agent_map[application_key] = agent
    return agent


def train_dialogue(domain_file, model_path, training_data_file):
    fallback = FallbackPolicy(fallback_action_name="utter_default",
                          core_threshold=env.nlu_threshold,
                          nlu_threshold=env.core_threshold)
    agent = Agent(domain_file, policies=[KerasPolicy(), env.fallback, MemoizationPolicy()])
    training_data = agent.load_data(training_data_file)

    agent.train(training_data, epochs=300)
    agent.persist(model_path)


def get_customer_agent(application_key):
    current_agent = AgentMap.agent_map.get(application_key)
    if current_agent is None:
        print("fetching agent for: " + application_key)
        current_agent = load_agent(application_key)
    return current_agent




class KommunicateChatBot(OutputChannel):
    def __init__(self, data):
        self.bot_id = data['botId']
        self.group_id = data['groupId']
        self.application_key = data['applicationKey']
        self.authorization = data['authorization']

    def send_text_message(self, recipient_id, message):
        send_message_url = env.applozic_endpoint + "/rest/ws/message/v2/send"

        auth_headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Application-Key": self.application_key,
            # "Authorization": "Basic cmFzYS10ZXN0OnJhc2EtdGVzdA=="
            "Authorization": self.authorization
        }

        message_data = {"groupId": self.group_id,
                        "message": message}
        response_message = requests.post(url=send_message_url, data=json.dumps(message_data), headers=auth_headers)
        print(response_message.status_code, response_message.reason)




@app.route('/')
def index():
    return "Hello, World!"


@app.route("/webhook", methods=["GET", "POST"])
def webhook():
    body = request.json
    agent = get_customer_agent(body['applicationKey'])
    reply = agent.handle_message(body['message'])[0]['text']
    outchannel = KommunicateChatBot(body)
    print ("sending message: " + reply)
    
    #If the reply was of Fallback Policy then it should be stored in MongoDB (knowledgebase) as well
    if(reply == fallback_reply):
        updateQusInMongo(body['message'], body['applicationKey'])
    
    outchannel.send_text_message('', reply)
    return reply

@app.route("/faqdata", methods=["POST"])
def getfaq():
    body = request.json
    #Check if training data is present
    load_training_data(body["applicationId"])

    if(body['referenceId'] is None):
        intent = body['id']
        update_domain(str(intent),body['content'],0,body['applicationId'])
        update_stories(str(intent),body['applicationId'])
        update_nludata(str(intent),body['name'],body['applicationId'])
    else:
        intent = body['referenceId']
        #update_domain(str(intent),body['content'],1,body['applicationKey'])
        update_nludata(str(intent),body['name'],body['applicationId'])

    #Upload the training data to s3 after updating
    print ('Uploading new data to s3..')
    upload_training_data(body['applicationId'])

    return jsonify({"Success":"We have more data!"})

@app.route("/train",methods=["POST"])
def train_bots():
    body = request.json
    last_run = body['lastRunTime']
    if(body['data'] is None):
        pass
    else:
        for appkey in body['data']:
            load_training_data(appkey)
            call(["python3 -m rasa_nlu.train --config ../customers/" + appkey + "/faq_config.yml --data ../customers/" + appkey + "/faq_data.json --path ../customers/" + appkey + "/models/nlu --fixed_model_name faq_model_v1"], shell=True)
            train_dialogue(get_abs_path("customers/" + appkey + "/faq_domain.yml"), get_abs_path("customers/" + appkey + "/models/dialogue"), get_abs_path("customers/" + appkey + "/faq_stories.md"))
            agen = load_agent(appkey)
        r = requests.post(env.cron_endpoint,
                  headers={'content-type':'application/json'},
                  data=json.dumps({"cronKey": cron_key,
                                   "lastRunTime": last_run}))

            K.clear_session()

    return jsonify({"Success":"The bots are now sentient!"})
