import websocket
import time
import json
from thread import start_new_thread


def on_message(ws, message):
    print message
    ws.connector.parseMessage(ws, message)

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
            "messagetype" : "Hardware",
            "data" : {
                "hwid": item.getId(),
                "value": "%f" % value}
            }
        return msg

    def createJSONErrorMessage(self, item, error):
        msg = {
            "messagetype" : "Error",
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

    def registerForMessages(self):
        msg = {"messagetype" : "subscribe",
               "data" : "UI-Message"}
        js=json.dumps(msg)
        self.ws.send(js)

    def hardwareLoop(self, ws):
        print "Hardware loop started..."
        while(True):
            time.sleep(self.pollingTime)
            for item in self._items:
                self.sendUpdateInfo(item)
            print "Next loop"

    def on_open(self, ws):
        """When connected, the clients sends sensor updates"""
        self.registerForMessages()
        start_new_thread(self.hardwareLoop, (ws,))

            
        

    def parseMessage(self, ws, message):
        """Implement the message parser"""
        try:
            #item = json.loads(message.replace("u'", "'"))
            item = json.loads(message.encode('utf-8'))
            if (item):
                self.parseJsonMessage(ws, item);
        except Exception, e:
            print e
        pass

    def parseJsonMessage(self, ws, message):
        if message:
            messagetype = message['messagetype']
            if messagetype:
                if messagetype == u'UI-Message':
                    self.handleUIMessage(ws, message)
                elif messagetype == "implementThis":
                    # implement message type
                    pass
        pass

    def handleUIMessage(self, ws, message):
        if (message['data']):
            print "***********************"
            print "***** handle message"
            print message['data']
            data = message['data']
            hwid = data['hwid']
            value = float(data['value'])
            self.changeHardware(ws, hwid, value)
            # send the message
            

    def changeHardware(self, ws, hwid, value):
        for item in self._items:
            if (item.itemId == hwid):
                item.setItemValue(value)
                newMessage = self.createJSONMessage(item, value)
                msg = json.dumps(newMessage)
                ws.send(msg)



                    



    def RunConnector(self):
        print "RunConnectorCalled"
        websocket.enableTrace(True)
        self.ws = websocket.WebSocketApp(self.url, on_message = on_message, on_error = on_error, on_close = on_close)
        self.ws.connector = self
        self.ws.on_open = on_open
        self.ws.run_forever()
        
        
        





