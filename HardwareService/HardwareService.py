##server.py
from socket import *      #import the socket library
import sys
from thread import *

def clientthread(conn):
    #Sending message to connected client
    conn.send('Welcome to the server. Type something and hit enter\n') #send only takes string
     
    #infinite loop so that function do not terminate and thread do not end.
    while True:
        #Receiving from client
        data = conn.recv(1024)
        
        reply = 'OK...' + data
        if not data: 
            break
     
        conn.sendall(reply)
    #came out of loop
    conn.close()

##let's set up some constants
HOST = ''    #we are the host
PORT = 29876    #arbitrary port not currently in use
ADDR = (HOST,PORT)    #we need a tuple for the address
BUFSIZE = 4096    #reasonably sized buffer for data

## now we create a new socket object (serv)
## see the python docs for more information on the socket types/flags
serv = socket( AF_INET,SOCK_STREAM)    

##bind our socket to the address
serv.bind((ADDR))    #the double parens are to create a tuple with one element
serv.listen(5)    #5 is the maximum number of queued connections we'll allow
print 'Socket now listening'

while True:
    conn,addr = serv.accept() #accept the connection
    print 'Connected with ' + addr[0] + ':' + str(addr[1])
    start_new_thread(clientthread ,(conn,))


conn.close()



