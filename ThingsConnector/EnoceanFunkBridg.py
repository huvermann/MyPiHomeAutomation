from utilsTings import is_windows
from ThingsConnectorBase import *
import ItemTypes

class EnoceanFunkBridge(ThingsConectorBase):
    """Implements a RF-Bridge for Enocean devices"""
    def run(self):
        self.RunConnector();

    def initDevices():
        #todo: implemnt
        pass


if __name__ == "__main__":
    
    nodeId = "enocean_007" # Eindeutige Id
    #url = "ws://dev.huvermann.com:8000"
    url = "ws://localhost:8000" #Adresse des Servers
    nodeName = "Enocan 007"
    loopDelay = 0.5

    enocean =  EnoceanFunkBridge(nodeId, url, nodeName, loopDelay)
    enocean.initDevices();
    enocean.run()

 
