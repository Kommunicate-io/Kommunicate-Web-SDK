from rasa_core.channels.custom import *
from rasa_core.channels.rest import *
from rasa_core.agent import Agent
from os import execl
from rasa_core.interpreter import RasaNLUInterpreter
import importlib
import requests
import json
import random
import sys
from pathlib import Path
from ruamel.yaml import YAML
from flask import Blueprint, request, jsonify, make_response
from typing import Text, Optional

from rasa_core.channels.channel import UserMessage, OutputChannel
from rasa_core.channels.rest import HttpInputComponent, HttpInputChannel

def get_cnfg():
	if(len(sys.argv) > 1):
		cnfg = importlib.import_module('conf.' + sys.argv[1])
	else:
		cnfg = importlib.import_module('conf.default')
	return cnfg
def update_domain(intent,answer,flag):
	yaml = YAML(typ='rt')
	yaml.default_flow_style = False
	file = Path('faq_domain.yml')
	data = yaml.load(open("faq_domain.yml"))
	if(flag==0):
	 data['intents'].append(intent)
	 data['actions'].append('utter_' + intent)
	data['templates']['utter_' + intent] = [answer]
	yaml.indent(mapping=1,sequence=1,offset=0)
	yaml.dump(data,file)
	return
    
def update_stories(intent):
	num = str(random.randint(1,2345678))
	file = open('faq_stories.md','a')
	file.write('\n\n## story_' + num)
	file.write('\n* ' + intent)
	file.write('\n - utter_' + intent)
	file.close()
	return
	
def update_nludata(intent,question):
	data = {}
	with open('faq_data.json') as json_file:
		data = json.load(json_file)
		data["rasa_nlu_data"]["common_examples"].append({"text":question,"intent":intent,"entities":[]})
		data["rasa_nlu_data"]["common_examples"].append({"text":question,"intent":intent,"entities":[]})
		data["rasa_nlu_data"]["common_examples"].append({"text":question,"intent":intent,"entities":[]})
	with open('faq_data.json','w') as outfile:
		json.dump(data,outfile,indent=3)
	return

class KommunicateChatBot(OutputChannel):
    def __init__(self, data):
        self.bot_id = data['botId'] 
        self.group_id = data['groupId']
        self.application_key = data['applicationKey']
        self.authorization = data['authorization']

    def send_text_message(self , recipient_id, message):
        print(message)

        send_message_url = get_cnfg().url + "/rest/ws/message/v2/send"

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

class KommunicateChatInput(HttpInputComponent,HttpInputChannel):
    def __init__(self, url="http://localhost:5000"):
        self.url = url

    def blueprint(self, on_new_message):
        kommunicate_chat_webhook = Blueprint('rocketchat_webhook', __name__)

        @kommunicate_chat_webhook.route("/", methods=["GET", "POST"])
        def health():
            return jsonify({
                "status": "ok",
            })
			
        @kommunicate_chat_webhook.route("/faqdata", methods=["POST"])
        def getfaq():
	        body = request.json
	        if(('answer' in body) and ('question' in body) and ('intent' in body)):
	         update_domain(body['intent'],body['answer'],0)
	         update_stories(body['intent'])
	         update_nludata(body['intent'],body['question'])
	        elif(('intent' in body) and ('answer' in body)):
	         update_domain(body['intent'],body['answer'],1)
	        elif(('question' in body) and ('intent' in body)):
	         update_nludata(body['intent'],body['question'])
	        #execl("sh","retrain.sh")
	        return jsonify({"bot trained!":"wow",
			})
			
        @kommunicate_chat_webhook.route("/webhook", methods=["GET", "POST"])
        def webhook():
            body = request.json
            output = body['message']
            outchannel = KommunicateChatBot(body)
            user_message = UserMessage(output, outchannel, "default")
            on_new_message(user_message)
            return make_response()
        return kommunicate_chat_webhook
	
def agent_run():
    interpreter = RasaNLUInterpreter("models/nlu/default/faq_model_v1")
    agent = Agent.load("models/dialogue", interpreter)
    channel = HttpInputChannel(5001, None , KommunicateChatInput())
    agent.handle_channel(channel)
    return agent
agent_run()
