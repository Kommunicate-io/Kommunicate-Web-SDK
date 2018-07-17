import os
import boto3


applozic_endpoint = "https://apps-test.applozic.com"
base_dir = os.path.abspath(os.path.dirname(__file__))

base_customer_path = os.path.abspath(os.path.join(base_dir, "..", ".."))

#Fallback action for bot
#Configuration of threshold answering for bot
core_threshold = 0.55
nlu_threshold = 0.45


#end point of cron time stamp at Node
cron_endpoint = 'https://api-test.kommunicate.io/crontime'


######################### Put data here ###########################

#Credentials for AWS S3 support
bucket_name = "faqbot-test"
access_key = "AKIAI67YDIHOPJVDVQHA"
secret_access_key = "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"

s3 = boto3.resource('s3', aws_access_key_id=access_key, aws_secret_access_key=secret_access_key)


#Credentials for MongoDB
uri = "mongodb://applozicdba:applozicdba@ec2-184-72-95-64.compute-1.amazonaws.com:27017/kommunicate?authSource=admin"
