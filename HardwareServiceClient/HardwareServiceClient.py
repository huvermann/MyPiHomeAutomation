##client.py
from socket import *

HOST = 'localhost'
PORT = 29876    #our port from before
ADDR = (HOST,PORT)
BUFSIZE = 4096

cli = socket( AF_INET,SOCK_STREAM)
cli.connect((ADDR))

data = cli.recv(BUFSIZE)
cli.send("Hallo Welt")
print data

cli.close()