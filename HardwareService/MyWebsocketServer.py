import signal, sys, ssl
from SimpleWebSocketServer import WebSocket, SimpleWebSocketServer, SimpleSSLWebSocketServer
from optparse import OptionParser
from thread import start_new_thread
import time
import websocket


clients = []
class SimpleChat(WebSocket):

    def handleMessage(self):
       for client in clients:
          if client != self:
             client.sendMessage(self.address[0] + ' - ' + self.data)

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

def startWebSocketServer():
   
    server.serveforever()

def sendData(data):
    from websocket import create_connection
    ws = create_connection("ws://localhost:8000/")
    print "Sending data:" + data
    ws.send(data)
    ws.close


server = SimpleWebSocketServer('', 8000, SimpleChat)
start_new_thread(startWebSocketServer, ())

cnt = 0
address = ('127.0.0.1', 1)
while True:
    cnt+=1
    print "Counter: %d" % cnt
    #for client in clients:
        #client.sendMessage(address[0] + u' - Message from hardware broker')
        #client.handleMessage()
    sendData("Nachricht %d von Sam" % cnt)
    time.sleep(10)
        
    # Eingabe
    # Eingabe an alle clients senden

