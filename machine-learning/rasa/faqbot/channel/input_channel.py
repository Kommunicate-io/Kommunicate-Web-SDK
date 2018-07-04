import json
import random
from flask import Flask
from pathlib import Path
from subprocess import call, check_output
from rasa_core.agent import Agent
from rasa_core.channels.custom import *
from rasa_core.interpreter import RasaNLUInterpreter
from ruamel.yaml import YAML
import boto3
import botocore
from conf.default import *
from distutils.dir_util import copy_tree

s3 = boto3.resource('s3', aws_access_key_id=access_key, aws_secret_access_key=secret_access_key)

class AgentMap(object):
    agent_map = {}


def get_abs_path(rel_path):
    return os.path.join(base_customer_path, rel_path)

#To upload data to AWS S3
def upload_training_data(applicationKey):
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
    parent = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
    path_customer = os.path.join(parent + "/customers/" + applicationKey)
    base_data = os.path.join(parent + "/customers/base-data")
    s3_path = applicationKey + "/"
    if(os.path.isdir(path_customer) is False):
        try:
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

def load_models(appkey):
    parent = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
    path_model = os.path.join(parent + "/customers/" + appkey + "/models")
    if(os.path.isdir(path_model) is False):
        load_training_data(appkey)
        call(["python3 -m rasa_nlu.train --config ../customers/" + appkey + "/faq_config.yml --data ../customers/" + appkey + "/faq_data.json --path ../customers/" + appkey + "/models/nlu --fixed_model_name faq_model_v1"], shell=True)
        call(["python3 -m rasa_core.train -d ../customers/" + appkey + "/faq_domain.yml -s ../customers/" + appkey + "/faq_stories.md -o ../customers/" + appkey + "/models/dialogue --epochs 300"], shell=True)
    return


def load_agent(application_key):
    print ("loading agent for: " + application_key)
    load_models(application_key)
    interpreter = RasaNLUInterpreter(get_abs_path("customers/" + application_key + "/models/nlu/default/faq_model_v1"))
    agent = Agent.load(get_abs_path("customers/" + application_key + "/models/dialogue"), interpreter)
    AgentMap.agent_map[application_key] = agent
    return agent


def get_customer_agent(application_key):
    current_agent = AgentMap.agent_map.get(application_key)
    if current_agent is None:
        print("fetching agent for: " + application_key)
        current_agent = load_agent(application_key)
    return current_agent


app = Flask(__name__)


class KommunicateChatBot(OutputChannel):
    def __init__(self, data):
        self.bot_id = data['botId']
        self.group_id = data['groupId']
        self.application_key = data['applicationKey']
        self.authorization = data['authorization']

    def send_text_message(self, recipient_id, message):
        send_message_url = applozic_endpoint + "/rest/ws/message/v2/send"

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
    reply = get_customer_agent(body['applicationKey']).handle_message(body['message'])[0]['text']
    outchannel = KommunicateChatBot(body)
    print ("sending message: " + reply)
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
    if(body['data'] is None):
        pass
    else:
        for appkey in body['data']:
            load_training_data(appkey)
            call(["python3 -m rasa_nlu.train --config ../customers/" + appkey + "/faq_config.yml --data ../customers/" + appkey + "/faq_data.json --path ../customers/" + appkey + "/models/nlu --fixed_model_name faq_model_v1"], shell=True)
            call(["python3 -m rasa_core.train -d ../customers/" + appkey + "/faq_domain.yml -s ../customers/" + appkey + "/faq_stories.md -o ../customers/" + appkey + "/models/dialogue --epochs 300"], shell=True)
            agen = load_agent(appkey)
    return jsonify({"Success":"The bots are now sentient!"})
