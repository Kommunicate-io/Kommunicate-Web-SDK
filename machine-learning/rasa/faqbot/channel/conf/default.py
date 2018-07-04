import os

applozic_endpoint = "https://apps-test.applozic.com"
base_dir = os.path.abspath(os.path.dirname(__file__))

base_customer_path = os.path.abspath(os.path.join(base_dir, "..", ".."))

#Credentials for AWS S3 support
bucket_name = "faqbot-test"
access_key = "AKIAI67YDIHOPJVDVQHA"
secret_access_key = "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"
