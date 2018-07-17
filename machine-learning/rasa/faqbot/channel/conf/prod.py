import os
import boto3

applozic_endpoint = "https://apps.applozic.com"
base_dir = os.path.abspath(os.path.dirname(__file__))


base_customer_path = os.path.abspath(os.path.join(base_dir, "..", ".."))


#Fallback action for bot
#Configuration of threshold answering for bot
core_threshold = 0.55
nlu_threshold = 0.45


#end point of cron time stamp at Node
cron_endpoint = 'https://api.kommunicate.io/crontime'


###############################The data below is yet to be filled###############################

#Credentials for AWS S3 support
bucket_name = "liz-faq-bot"
access_key = "AKIAJ7QAZU7R2GPBCXGQ"
secret_access_key = "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"

s3 = boto3.resource('s3', aws_access_key_id=access_key, aws_secret_access_key=secret_access_key)
