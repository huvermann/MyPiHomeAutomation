import websocket
import time
import json


def on_message(ws, message):
    print message

def on_error(ws, error):
    print error

def on_close(ws):
    print "### closed ###"

def on_open(ws):
    print "On open handler called"
    ws.connector.on_open(ws)



class ThingsConectorBase(object):
    
    """Things connector base class"""
    def __init__(self, url, description, pollingTimeMs = 1000):
        """Constructor"""
        self.url = url
        self.description = description
        self.pollingTime = pollingTimeMs
        self._items = []
        self.ws = None

    def addItem(self, thing):
        """Add a item"""
        self._items.append(thing)
        return self

    def createJSONMessage(self, item, value):
        msg = {
            "messagetype" : "hardware",
            "data" : {
                "hwid": item.getId(),
                "value": "%f" % value}
            }
        return msg

    def createJSONErrorMessage(self, item, error):
        msg = {
            "messagetype" : "error",
            "data" : {
                "hwid": item.getId(),
                "error": item.getLastError()
                }
            }
        return msg

    def sendSocketMessage(self, messageObject):
        msg = json.dumps(messageObject)
        self.ws.send(msg)
        
    def sendSocketErrorMessage(self, messageObject):
        msg = json.dumps(messageObject)
        self.ws.send(msg)
         


    def sendUpdateInfo(self, item):
        """Sends the value of the Item to the service bus"""
        description = item.description
        id = item.getId()

        try:
              (hasChanged, value) = item.checkItemHasChanged()
              if (hasChanged == True):
                  self.sendSocketMessage(self.createJSONMessage(item, value))
        except Exception, e:
            self.lastError = e
            self.sendSocketErrorMessage(self.createJSONErrorMessage(item, e))

    def on_open(self, ws):
        print "### opened ###"
        while(True):
            for item in self._items:
                self.sendUpdateInfo(item)
        print "Loop ended"
        time.sleep(self.pollingTime)


    def RunConnector(self):
        print "RunConnectorCalled"
        websocket.enableTrace(True)
        self.ws = websocket.WebSocketApp("ws://localhost:8000/", on_message = on_message, on_error = on_error, on_close = on_close)
        self.ws.connector = self
        self.ws.on_open = on_open
        self.ws.run_forever()
        
        
        





