from importlib import import_module
def get_config(param):
        return import_module('config.' + param)
