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


def addQusInMongo(name, applicationId):
    data = {
        "category" : "faq",
        "name" : name,
        "content" : None,
        "user_name" : 'FAQ_Bot',
        "applicationId" : applicationId,
        "status": "un_answered",
        "type": "faq"
    }
    resp = requests.post(url=env.node_endpoint, data=data)
    print("Question added to Mongo Database : ", resp)


class AgentMap(object):
    agent_map = {}
    interpreter_map = {}

class Question:
    def __init__(self, data):
        self.id = str(data["id"])
        self.application_id = data["applicationId"]
        self.name = data["name"]
        self.content = data["content"]
        self.reference_id = str(data["referenceId"])
    
    def get_intent(self):
        print("id: ")
        print(self.id)
        print (self.reference_id)
        #if self.reference_id is None:
         #   return self.id
        #return self.reference_id
        return self.id

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

def add_domain(questions, app_key):
    yaml = YAML(typ='rt')
    yaml.default_flow_style = False
    #yaml.preserve_quotes = True
    bot_path = 'customers/' + app_key + '/faq_domain.yml'
    abs_bot_path = get_abs_path(bot_path)
    file = Path(abs_bot_path)
    data = yaml.load(open(abs_bot_path))
    for question in questions:
        print(question.get_intent())
        #print(data['intents'][question.get_intent()])
        if question.get_intent() not in data['intents']:
            data['intents'].append(question.get_intent())
        if 'utter_' + question.get_intent() not in data['actions']:
            data['actions'].append('utter_' + question.get_intent())
        #if data['templates'].get('utter_' + question.get_intent(), None) is None:
        data['templates']['utter_' + question.get_intent()] = [json.dumps({'message': question.content})]
    yaml.indent(mapping=1, sequence=1, offset=0)
    yaml.dump(data, file)
    return


def add_stories(questions, app_key):
    intents = []
    for question in questions:
        intents.append(question.get_intent())

    num = str(random.randint(1, 2345678))
    bot_stories_path = 'customers/' + app_key + '/faq_stories.md'

    file = open(get_abs_path(bot_stories_path), 'a')
    file.write('\n\n## story_' + num)
    for intent in intents:
        file.write('\n* ' + intent)
        file.write('\n - utter_' + intent)
    file.close()
    return


def add_nludata(questions, app_key):
    data = {}
    with open(get_abs_path('customers/' + app_key + '/faq_data.json')) as json_file:
        data = json.load(json_file)

        for question in questions:
            intent = question.get_intent()
            data["rasa_nlu_data"]["common_examples"].append({"text": question.name, "intent": intent, "entities": []})
            data["rasa_nlu_data"]["common_examples"].append({"text": question.name, "intent": intent, "entities": []})
            data["rasa_nlu_data"]["common_examples"].append({"text": question.name, "intent": intent, "entities": []})
    with open(get_abs_path('customers/' + app_key + '/faq_data.json'), 'w') as outfile:
        json.dump(data, outfile, indent=3)
    return



def update_domain(questions, app_key):
    for question in questions:
        delete_domain(intent=question.get_intent(), app_key=app_key)

    add_domain(questions, app_key=app_key)
    return


def update_nludata(questions, app_key):
    for question in questions:
        delete_nludata(intent=question.get_intent(), app_key=app_key)

    add_nludata(questions, app_key=app_key)
    return


def delete_domain(intent, app_key):
    try:
        yaml = YAML(typ='rt')
        yaml.default_flow_style = False
        bot_path = 'customers/' + app_key + '/faq_domain.yml'
        abs_bot_path = get_abs_path(bot_path)
        file = Path(abs_bot_path)
        data = yaml.load(open(abs_bot_path))
        print(data['intents'])
        index = data['intents'].index(intent)
        del data['intents'][index]
        index = data['actions'].index('utter_' + str(intent))
        del data['actions'][index]
        del data['templates']['utter_' + str(intent)]
        yaml.indent(mapping=1, sequence=1, offset=0)
        yaml.dump(data, file)
    except Exception as e:
        print("exception while deleting intent: " + intent + " for app: " + app_key)
        print(e)
    return


def delete_story(intent, app_key):
    base_path = 'customers/' + app_key
    story_file = open(get_abs_path(base_path + '/faq_stories.md'), 'r')
    story = story_file.read().split('\n')
    temp_list = []
    for i in range(0, len(story), 4):
        temp_list.append(story[i:i + 3])
    action = '* ' + str(intent)
    index = -1
    for i in range(len(temp_list)):
        if temp_list[i][1] == action:
            index = i
            break
    del temp_list[index]
    a = []
    for i in temp_list:
        a.extend(i)
    story_file = open(get_abs_path(base_path + '/faq_stories.md'), 'w')
    print(a)
    for i in range(1, len(a)+1):
        story_file.write(a[i-1])
        if(i != len(a)):
            story_file.write('\n')
            if(i%3 == 0):
                story_file.write('\n')

def delete_nludata(intent, app_key):
    data = {}
    with open(get_abs_path('customers/' + app_key + '/faq_data.json')) as json_file:
        data = json.load(json_file)
        temp_list = data["rasa_nlu_data"]["common_examples"]
        c = []
        for i in range(len(temp_list)):
            if temp_list[i]['intent'] == intent:
                c.append(i)
        c.reverse()
        for i in c:
            del data["rasa_nlu_data"]["common_examples"][i]
    with open(get_abs_path('customers/' + app_key + '/faq_data.json'), 'w') as outfile:
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

def load_models(app_key):
    parent = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
    path_model = os.path.join(parent + "/customers/" + app_key + "/models")
    model_exists = os.path.isdir(path_model)
    if(model_exists is False):
        load_training_data(app_key)
    
    path_nlu = os.path.join(parent + "/customers/" + app_key + "/models/nlu")
    if(model_exists is False or os.path.isdir(path_nlu) is False):
        call(["python3 -m rasa_nlu.train --config ../customers/" + app_key + "/faq_config.yml --data ../customers/" + app_key + "/faq_data.json --path ../customers/" + app_key + "/models/nlu --fixed_model_name faq_model_v1"], shell=True)
    
    path_dialogue = os.path.join(parent + "/customers/" + app_key + "/models/dialogue")
    if(model_exists is False or os.path.isdir(path_dialogue) is False):
        train_dialogue(app_key, get_abs_path("customers/" + app_key + "/faq_domain.yml"), get_abs_path("customers/" + app_key + "/models/dialogue"), get_abs_path("customers/" + app_key + "/faq_stories.md"))
    return


def load_agent(application_key):
    print ("loading agent for: " + application_key)
    K.clear_session()
    load_models(application_key)

    interpreter = AgentMap.interpreter_map.get(application_key)
    if interpreter is None:
        interpreter = RasaNLUInterpreter(get_abs_path("customers/" + application_key + "/models/nlu/default/faq_model_v1"))
        AgentMap.interpreter_map[application_key] = interpreter

    agent = Agent.load(get_abs_path("customers/" + application_key + "/models/dialogue"), interpreter)
    return agent


def train_dialogue(app_key, domain_file, model_path, training_data_file):
    AgentMap.interpreter_map.pop(app_key, None)
    K.clear_session()
    fallback = FallbackPolicy(fallback_action_name="utter_default",
                          core_threshold=env.nlu_threshold,
                          nlu_threshold=env.core_threshold)
    agent = Agent(domain_file, policies=[KerasPolicy(), fallback, MemoizationPolicy()])
    #agent = Agent(domain_file, policies=[KerasPolicy(), MemoizationPolicy()])
    training_data = agent.load_data(training_data_file)

    agent.train(training_data, epochs=300)
    agent.persist(model_path)


def get_customer_agent(application_key):
    #current_agent = AgentMap.agent_map.get(application_key)
    #if current_agent is None:
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
    reply_message = json.loads(agent.handle_message(body['message'])[0]['text'])
    outchannel = KommunicateChatBot(body)
    print ("sending message: ")
    print (reply_message)
    reply = reply_message['message']
    #If the reply was of Fallback Policy then it should be stored in MongoDB (knowledgebase) as well
    if(reply == fallback_reply):
        addQusInMongo(body['message'], body['applicationKey'])

    outchannel.send_text_message('', reply)
    return reply

@app.route("/faq/add", methods=["POST"])
def addfaq():
    body = request.json
    print(body)

    questions = []
    for que in body:
        questions.append(Question(que))

    application_id = questions[0].application_id
    load_training_data(application_id)

    add_domain(questions, application_id)
    add_stories(questions, application_id)
    add_nludata(questions, application_id)

    #Upload the training data to s3 after updating
    print ('Uploading new data to s3..')
    upload_training_data(application_id)
    return jsonify({"Success":"We have more data!"})


@app.route("/faq/delete",methods=["POST"])
def deletefaq():
    body = request.json
    print(body)

    questions = []
    for que in body:
        questions.append(Question(que))

    application_id = questions[0].application_id
    load_training_data(application_id)
    
    #Delete data for specified applicationId with id as intent
    for question in questions:
        intent = question.get_intent()
        delete_domain(intent, application_id)
        delete_nludata(intent, application_id)
        delete_story(intent, application_id)
    
    print("Data deleted succesfully")
    
    upload_training_data(application_id)
    
    return jsonify({"Success":"FAQ data has been deleted"})

@app.route("/faq/update",methods=["POST"])
def updatefaq():
    body = request.json
    print(body)

    questions = []
    for que in body:
        questions.append(Question(que))

    #Check if training data is present
    application_id = questions[0].application_id
    load_training_data(application_id)

    add_domain(questions, application_id)
    update_nludata(questions, application_id)

    upload_training_data(application_id)

    return jsonify({"Success":"FAQ data has been updated"})

@app.route("/train",methods=["POST"])
def train_bots():
    body = request.json
    last_run = body['lastRunTime']
    if(body['data'] is None):
        pass
    else:
        for app_key in body['data']:
            try:
                load_training_data(app_key)
                call(["python3 -m rasa_nlu.train --config ../customers/" + app_key + "/faq_config.yml --data ../customers/" + app_key + "/faq_data.json --path ../customers/" + app_key + "/models/nlu --fixed_model_name faq_model_v1"], shell=True)
                train_dialogue(app_key, get_abs_path("customers/" + app_key + "/faq_domain.yml"), get_abs_path("customers/" + app_key + "/models/dialogue"), get_abs_path("customers/" + app_key + "/faq_stories.md"))
                r = requests.post(env.cron_endpoint,
                    headers={'content-type':'application/json'},
                    data=json.dumps({"cronKey": cron_key,
                                   "lastRunTime": last_run}))
            except Exception as e:
                print("error while training for app_key:" + app_key)
                print(e)

    return jsonify({"Success":"The bots are now sentient!"})