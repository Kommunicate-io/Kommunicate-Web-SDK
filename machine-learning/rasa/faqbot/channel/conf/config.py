from importlib import import_module

def get_config(param):
    if(param is None):
        return import_module('.default', 'conf')
    else:
        return import_module('.' + param, 'conf')

cron_key = 'FAQ_BOT'

fallback_reply = "Please wait while we connect you to an agent..."