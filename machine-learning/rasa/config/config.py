from importlib import import_module
def get_config(param):
    if (param == 'test'):
        return import_module('config.test')
    elif(param == 'prod'):
        return import_module('config.prod')
    else:
        return import_module('config.default')
