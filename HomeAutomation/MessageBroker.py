import signal, sys, ssl
from SimpleWebSocketServer import WebSocket, SimpleWebSocketServer, SimpleSSLWebSocketServer
from optparse import OptionParser
from thread import start_new_thread
import time
import websocket
import json


clients = []


class MessageBroker(WebSocket):

    def __init__(self, server, sock, address):
        self.subscriptions = []

        return super(MessageBroker, self).__init__(server, sock, address)
    def handleMessage(self):
       print "Handle Message: "
       print self.data
        #for client in clients:
          #if client != self:
             #client.sendMessage(self.address[0] + ' - ' + self.data)
       self.parseMessage(self.data)

    def handleConnected(self):
       print self.address, 'connected'
       #for client in clients:
          #client.sendMessage(self.address[0] + u' - connected')
       clients.append(self)

    def handleClose(self):
       clients.remove(self)
       print self.address, 'closed'
       for client in clients:
          client.sendMessage(self.address[0] + u' - disconnected')

    def parseMessage(self, data):
        try:
            item = json.loads(data)
            if item:
                self.parseJsonMessage(item)

        except:
            self.parseMessageAsString(data)

    def parseMessageAsString(self, data):
        # no action
        pass

    def readPagesConfig(self):
        result =  {
        "pages": [
            { "PageName": "Pagex1", "ID": "Page1" },
            { "PageName": "Pagex2", "ID": "Page2" },
            { "PageName": "Pagex3", "ID": "Page3" },
            { "PageName": "Page4x", "ID": "Page4" }]}
        return result

    def envelopeMessage(self, messagetype, data):
        result = {
            "messagetype" : messagetype,
            "data": data
            }
        return unicode(json.dumps(result, ensure_ascii=False))

    def getPages(self, data):
        print "sending get page response"
        pages = self.readPagesConfig()
        msg = self.envelopeMessage("PageList", pages)
        self.sendMessage(msg)
        pass

    def parseJsonMessage(self, message):
        if message:
            messagetype = message['messagetype']
            if messagetype:
                if messagetype == u'subscribe':
                    self.subscribe(message)
                elif messagetype == u'unsubscribe':
                    self.unsubscribe(message)
                elif messagetype == u'getPages':
                    self.getPages(message)
                else:
                    # Sent to all except me
                    self.sentToAll(message)

    def sentToAll(self, message):
        for client in clients:
            if client != self:
                if client.hasSubscribed(message["messagetype"]):
                    #client.sendMessageObjectAsJson(message)
                    client.sendMessage(self.data)

    def hasSubscribed(self, messagetype):
        # Implement check
        hasJoker = "*" in self.subscriptions
        result = (messagetype in self.subscriptions) | hasJoker
        return result

    def subscribe(self, message):
        sub = message["data"]
        if not sub in self.subscriptions:
            self.subscriptions.append(sub)
            print self.address, 'subscribed for: ', sub

    def unsubscribe(self, message):
         sub = message["data"]
         if sub in self.subscriptions:
             self.subscriptions.remove(sub)
             print self.address, 'unsubscribed for: ', sub
        

    def sendMessageObjectAsJson(self, message):
        try:
            client.sendMessage(json.dumps(message))
        except Exception, e: print e


server = SimpleWebSocketServer('', 8000, MessageBroker)

def startWebSocketServer():
    server.serveforever()

def startMessageBroker():
    #server = SimpleWebSocketServer('', 8000, MessageBroker)
    start_new_thread(startWebSocketServer, ())
