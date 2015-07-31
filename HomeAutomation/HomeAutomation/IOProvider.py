import json
import os.path

class IOProvider(object):
    """description of class"""
    def __init__(self):
        """Constructor of IOProvider."""
        self.loadConfigFile()
    def loadConfigFile(self):
        self.gpio = []
        """Load the config file."""
        if os.path.isfile('config.json'):
            try:
                with open('config.json') as data_file:
                    data = json.load(data_file)
                #pprint(data)
                self.gpio = data
            except:
                pass

    def gpioData(self):
         #dat = [{"name":"gpio-0","value":"off"},{"name":"gpio-1","value":"off"},{"name":"gpio-2","value":"on"},{"name":"gpio-3","value":"off"},{"name":"gpio-4","value":"on"}]
         #return dat
         return self.gpio




