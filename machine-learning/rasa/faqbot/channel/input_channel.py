from rasa_core.channels.custom import *
from rasa_core.channels.rest import *
from rasa_core.agent import Agent
from rasa_core.interpreter import RasaNLUInterpreter
import importlib
import requests
import json
import sys

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

class KommunicateChatBot(OutputChannel):
    def __init__(self, data):
        self.bot_id = data['botId'] 
        self.group_id = data['groupId']
        self.application_key = data['applicationKey']
        self.authorization = data['authorization']

    def send_text_message(self , recipient_id, message):
        print(message)

        send_message_url = get_cnfg().url + "/rest/ws/message/v2/send"
        print send_message_url

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
