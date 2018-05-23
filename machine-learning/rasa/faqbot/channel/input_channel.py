from rasa_core.channels.custom import *
from rasa_core.channels.rest import *
from rasa_core.agent import Agent
from rasa_core.interpreter import RasaNLUInterpreter
import requests

from flask import Blueprint, request, jsonify, make_response
from typing import Text, Optional

from rasa_core.channels.channel import UserMessage, OutputChannel
from rasa_core.channels.rest import HttpInputComponent, HttpInputChannel


class KommunicateChatBot(OutputChannel):
    def __init__(self, url="http://localhost:5000"):
        self.url = url 

    def send_text_message(self , recipient_id, message):
        print message

class KommunicateChatInput(HttpInputComponent,HttpInputChannel):
    def __init__(self, url="http://localhost:5000"):
        self.url = url
    def blueprint(self, on_new_message):
        kommunicate_chat_webhook = Blueprint('rocketchat_webhook', __name__)

        @kommunicate_chat_webhook.route("/", methods=["GET"])
        def health():
            return jsonify({
                "status": "ok"
            })
        
        @kommunicate_chat_webhook.route("/webhook/", methods=["GET", "POST"])
        def webhook():
            
            output = request.args.get("message")
            outchannel = KommunicateChatBot()
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