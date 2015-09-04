import websocket
import time
import datetime
import json
import sys
from thread import start_new_thread
from utilsTings import is_windows


def on_message(ws, message):
    print message
    ws.connector.parseMessage(ws, message)

def on_error(ws, error):
    print error

def on_close(ws):
    print "### closed ###"
    ws.connector.cleanup()

def on_open(ws):
    """
    The on_open method called by the webservice client.
    This is used, because the on_open method on the ThingsConnector base class
    could not been used directly.
    """
    ws.connector.on_open(ws)



class ThingsConectorBase(object):
    
    """Things connector base class"""
    def __init__(self, nodeId, url, description, pollingTimeMs = 5):
        """Constructor"""
        self.nodeId = nodeId
        self.url = url
        self.description = description
        self.pollingTime = pollingTimeMs
        self._items = []
        self.ws = None
        self.authenticated = False
        self.hardwareLoopThread = None

    def cleanup(self):
        """Does a cleanup."""
        if ws.connector.hardwareLoopThread:
            ws.connector.hardwareLoopThread._stop()

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
        """Sends a message to the websocket."""
        msg = json.dumps(messageObject)
        self.ws.send(msg)
        
    def sendSocketErrorMessage(self, messageObject):
        """Sends a error message on the websocket."""
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
        """Subscribes for message type UI-Message"""
        msg = {"messagetype" : "subscribe",
               "data" : "UI-Message"}
        js=json.dumps(msg)
        self.ws.send(js)

    def authHardware(self):
        """Sends logon request for hardware"""
        #todo: implement hardware authentication
        msg = {"messagetype" : "authHardware",
               "data" : {"nodeid" : self.nodeId,
                         "key": "secretkey"
                         }
               }
        js=json.dumps(msg)
        self.ws.send(js)
        pass

    def hardwareLoop(self, ws):
        """Runs the hardware loop forever."""
        if (not is_windows()):
            import ptvsd
        # wait until node is authenticated
        while(not self.authenticated):
            time.sleep(1)

        while(True):
            time.sleep(self.pollingTime)
            for item in self._items:
                now = datetime.datetime.now()
                print now.strftime("process item... %Y-%m-%d %H:%M")
                print item
                self.sendUpdateInfo(item)
            print "Next loop"

    def on_open(self, ws):
        """When connected, start a new thread to send sensor and actor updates"""
        self.authHardware()
        self.registerForMessages()
        self.hardwareLoopThread = start_new_thread(self.hardwareLoop, (ws,))

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
            now = datetime.datetime.now()
            print now.strftime("Parse message... %Y-%m-%d %H:%M")
            messagetype = message['messagetype']
            print "MessageType: " + messagetype
            if messagetype:
                if messagetype == u'UI-Message':
                    self.handleUIMessage(ws, message)
                elif messagetype == "LogonResult":
                    # todo: implement: if the logon fails, then disconnect
                    self.handleLogonResult(ws, message)
                elif messagetype == "Refresh":
                    self.prepareRefresh()
                    pass
        pass

    def handleLogonResult(self, ws, message):
        data = message["data"]
        if data:
            if data["success"] == True:
                self.authenticated = True
                self.sendHardwareInfo()
            else:
                self.cutConnection()
        else:
            self.cutConnection()

    def sendHardwareInfo(self):
        pass


    def cutConnection(self):
        """Terminate connection and exit"""
        if self.hardwareLoopThread:
            self.hardwareLoopThread.exit()
        self.ws.close()
        sys.exit()


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
    
    def prepareRefresh(self):
        print "===== Prepare update ====="
        for item in self._items:
            item.refresh()        

    def changeHardware(self, ws, hwid, value):
        for item in self._items:
            if (item.itemId == hwid):
                item.setItemValue(value)
                newMessage = self.createJSONMessage(item, value)
                msg = json.dumps(newMessage)
                ws.send(msg)

                   
    def RunConnector(self):
        """Starts the run loop."""
        websocket.enableTrace(True)
        self.ws = websocket.WebSocketApp(self.url, on_message = on_message, on_error = on_error, on_close = on_close)
        self.ws.connector = self
        self.ws.on_open = on_open
        self.ws.run_forever()
        
        
        





