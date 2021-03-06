﻿import signal, sys, ssl
from SimpleWebSocketServer import WebSocket, SimpleWebSocketServer, SimpleSSLWebSocketServer
from optparse import OptionParser
from thread import start_new_thread
import time
import websocket
import json
import codecs
import os


clients = []

class MessageBroker(WebSocket):

    def __init__(self, server, sock, address):
        self.subscriptions = []
        self.grandAccess = False
        self.wronLogonAttempts = 0
        self._clientType = None
        self._hardware = None
        self._groupConfigFile = os.path.join(os.path.dirname(__file__), 'homeconfig.json')

        return super(MessageBroker, self).__init__(server, sock, address)

    def handleMessage(self):
       print "Handle Message: "
       print self.data
       self.parseMessage(self.data)

    def handleConnected(self):
       print self.address, 'connected'
       clients.append(self)

    def handleClose(self):
       clients.remove(self)
       print self.address, 'closed'
       # Can be used later to inform the UI if a hardware node is down
       # or if a chat user is leaving.
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
   
        result = ""
        try:
            # Can not handle utf8!!!!
            input_file = file(self._groupConfigFile, "r")
            result = json.loads(input_file.read().decode("utf-8-sig"))
        except Exception, e:
            print e

        return result

    def savePagesConfigFile(self, data):
        """Saves the config file."""
        try:
            if data:
                prettyOutput = json.dumps(data, indent=4, separators=(',', ': '))
                f=open(self._groupConfigFile, 'w')
                f.write(prettyOutput)
                f.flush()
                f.close

            pass
        except Exception, e:
            print e
        pass



    def envelopeMessage(self, messagetype, data):
        result = {
            "messagetype" : messagetype,
            "data": data
            }
        return unicode(json.dumps(result, ensure_ascii=True))

    def getPages(self, data):
        if (self.grandAccess):
            pages = self.readPagesConfig()
            msg = self.envelopeMessage("PageList", pages)
            self.sendMessage(msg)
        else:
            self.sendRequireLogon()
        pass

    def parseJsonMessage(self, message):
        if message:
            messagetype = message['messagetype']
            if messagetype:
                if messagetype == u'subscribe': #client subscribes a message type
                    self.subscribe(message)
                elif messagetype == u'unsubscribe': #client unsubscribes from message type
                    self.unsubscribe(message)
                elif messagetype == u'getPages': # client requests page info
                    self.getPages(message)                        
                elif messagetype == u'pullupdates': # Client requests for hardware status update
                     self.sendRefreshBroadcast()
                elif messagetype == u'logon': # Client tries to authenticate
                    self.logon(message)
                elif messagetype == u'authHardware': # Hardware client tries to authenticate
                    self.logonHardware(message)
                elif messagetype == u'nodeinfo': # Hardware node sends node infos
                    self.nodeInfo(message)
                elif messagetype == u'getMappingInfo': # Browser client requests for mapping infos
                    self.sendMappingInfo()
                elif messagetype == u'savePages':
                    self.savePages(message)
                    
                else:
                    # Sent to all except me
                    self.sentToAll(message)

    def savePages(self, message):
        if self.grandAccess:
            print "save pages!!!"
            self.savePagesConfigFile(message["data"])
        pass
    
    def sendMappingInfo(self):
        """Send current hardware mapping data to client"""
        mapping = []
        for client in clients:
            if client._clientType == "hardware":
                mapping.append(client._hardware)
        message = self.envelopeMessage("MappingInfo", mapping)
        self.sendMessage(message)
        pass

    def nodeInfo(self, message):
        """Reads the node info from message."""
        if message["data"]:
            self._hardware = message["data"]
        pass

    def sendRefreshBroadcast(self):
        if self.grandAccess:
            for client in clients:
                if client != self:
                    client.sendMessage(self.refreshMessageString())

        pass
    def refreshMessageString(self):
        """Create a refresh message json string."""
        msg = {}
        return self.envelopeMessage("Refresh", msg)

    def sentToAll(self, message):
        if self.grandAccess:
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

    def logon(self, message):
        credentials = message["data"]
        if (self.checkUserAccess(credentials) and self.wronLogonAttempts < 4):
            self.grandAccess = True
            self._clientType = "browser"
            self.sendGrandAccess(True)
        else:
            self.grandAccess = False
            self.wronLogonAttempts += 1
            self.sendGrandAccess(False)

    def logonHardware(self, message):
        credentials = message["data"]
        # Todo: implement security check
        # 
        # now we don´t check just grand access, this is a security hole!!!
        self.grandAccess = True
        self._clientType = "hardware"
        self.sendGrandAccess(True)
        pass
        

    #def sendMessageObjectAsJson(self, message):
    #    try:
    #        client.sendMessage(json.dumps(message))
    #    except Exception, e: print e

    def checkUserAccess(self, credentials):
        """Check user credentials"""
        # just for having someting
        result = False;
        
        if (credentials["username"]=='admin' or (credentials["username"]=="gerold" and credentials["password"]=="test")):
            return True
        else: return False


    def sendGrandAccess(self, success):
        """Send the logon result"""
        msg = {"success" : success}
        js = self.envelopeMessage("LogonResult", msg)
        self.sendMessage(js)

    def sendRequireLogon(self):
        """Force the user or node to logon"""
        msg = {}
        js = self.envelopeMessage("LogonRequired", msg)
        self.sendMessage(js)
        

server = SimpleWebSocketServer('', 8000, MessageBroker)

def startWebSocketServer():
    server.serveforever()

def startMessageBroker():
    start_new_thread(startWebSocketServer, ())
