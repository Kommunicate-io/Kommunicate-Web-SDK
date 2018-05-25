from flask import Flask,  jsonify, request
from flask import Response
import json

app = Flask(__name__)

@app.route("/webhook")
def hello_input(*args, **kwargs):
    print args, kwargs
    print request.content
    # return jsonify({"Hello": "Welcome"})
    return Response("What is MAU?")
    


@app.route("/output")
def hello_output(*args, **kwargs):
    print args, kwargs
    # return jsonify({"Hello": "Bye"})

    return Response(json.dumps({"Hello": "Bye"}), content_type="text/json")