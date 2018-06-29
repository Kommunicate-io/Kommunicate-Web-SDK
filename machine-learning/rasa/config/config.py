from importlib import import_module
def get_config(param):
    if(param is None):
        return import_module('config.default')
    else:
        return import_module('config.' + param)
