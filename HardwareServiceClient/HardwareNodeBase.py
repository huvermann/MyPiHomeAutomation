import websocket
import thread
import json

class HardwareNodeBase(object):
    """The Hardware Node Baseclass."""
    def __init__(self, uri, enableTrace = True):
        if not uri:
            raise ValueError('Uri can not be empty!')
        self.uri = uri
        self.websock = self.initWebSocket(uri, enableTrace)

    def initWebSocket(self, uri, enableTrace = True):
        """Initializes the websocket."""
        print "Init websocket."
        websocket.enableTrace(enableTrace)
        result = websocket.WebSocketApp(uri,
                                on_message = self.on_message,
                                on_error = self.on_error,
                                on_close = self.on_close)
        result.on_open = self.on_open
        return result

    def on_message(self, ws, message):
        """Handles the messages."""
        print message
        pass
    def on_error(self, ws, error):
        """Handles the error."""
        print error
        pass

    def on_close(self, ws):
        """Handles on close connection."""
        print "Close connection."
        pass
    def on_open(self, ws):
        """ Handles on open connection."""
        pass

    def do_connect(self):
        """Runs the connection forever."""
        self.websock.run_forever()

    def createMessage(self, messagetype, data):
        #todo: replace magic strings
        msg = {"messagetype":messagetype,"data":data}
        return json.dumps(msg)
        
   
   

     