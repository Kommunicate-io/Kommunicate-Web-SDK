import os
from rasa_core.policies.fallback import FallbackPolicy

applozic_endpoint = "https://apps-test.applozic.com"
base_dir = os.path.abspath(os.path.dirname(__file__))

base_customer_path = os.path.abspath(os.path.join(base_dir, "..", ".."))

#Credentials for AWS S3 support
bucket_name = "faqbot-test"
access_key = "AKIAI67YDIHOPJVDVQHA"
secret_access_key = "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"


#Fallback action for bot
#Configuration of threshold answering for bot
fallback = FallbackPolicy(fallback_action_name="utter_default",
                          core_threshold=0.55,
                          nlu_threshold=0.45)


#end point of cron time stamp at Node
cron_endpoint = 'http://localhost:3999/cronTime'
