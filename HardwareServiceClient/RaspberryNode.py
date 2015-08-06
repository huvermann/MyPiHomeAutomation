from websocket import ABNF
from HardwareNodeBase import HardwareNodeBase
import Constants as CONST
import time

class RaspberryNode(HardwareNodeBase):
    """description of class"""
    def __init__(self, uri, enableTrace = True):
        self.counter = 0
        return super(RaspberryNode, self).__init__(uri, enableTrace)

    def on_open(self, ws):
        """ Handles on open connection."""
        print "Raspi on open"
        
        while True:
            self.runLoop(ws)
            time.sleep(2)
        pass

    def runLoop(self, ws):
        """The execution run loop"""
        txt = u'Loop %d" % (0)'
        self.counter +=1
        #test = jsonify({'tasks': tasks})
        msg = {"messagetype" : "test", "data": "Daten"}
        msg2=self.createMessage("test2", "daten")
        print msg2
        ws.send(msg2)


if __name__ == "__main__":
    uri = "ws://localhost:" + CONST.WEBSOCKETPORT + "/"
    node = RaspberryNode(uri, False)
    node.do_connect()

