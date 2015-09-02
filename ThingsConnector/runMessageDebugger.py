from ThingsConnectorBase import *
import ItemTypes
import datetime

class runMessageDebugger(ThingsConectorBase):
    """description of class"""
    def registerForMessages(self):
        """Subscribe wildcard"""
        msg = {"messagetype" : "subscribe",
               "data" : "*"}
        js=json.dumps(msg)
        self.ws.send(js)
        self.authenticated = True


    def parseMessage(self, ws, message):
        """Implement the message parser"""
        now = datetime.datetime.now()
        print now.strftime("Got Message on:%Y-%m-%d %H:%M")
        print message
        pass



if __name__ == "__main__":
    url = "ws://localhost:8000"
    runner = runMessageDebugger(url, "Solaranlage", 10)
    runner.RunConnector()