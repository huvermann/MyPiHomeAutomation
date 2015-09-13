import logging
from Core import __all__
from Core.utilsTings import is_windows

#from ThingsConnectorBase import *
from Core import ThingsConectorBase
from Core import ItemTypes
from Hardware.CpuUsageItem import CpuUsageItem
from Hardware.SampleSwitchItem import *
from Hardware.SampleSliderItem import *
if (not is_windows()):
    from Hardware.raspiGpioItem import *


class ThingsConnectorRunner(ThingsConectorBase):
    """description of class"""

    def run(self):
        self.RunConnector();

    def initSamples(self):
        """ Items definieren, später evtl. über Config."""
        # ----------------------------------------------------------------------------
        # Items anfügen
        # ----------------------------------------------------------------------------
        self.addItem(CpuUsageItem("7E463F10-8D83-4226-82A5-DFCF927FD1ED", ItemTypes.Temperature, "CPU Auslastung PC1"))
        self.addItem(SampleSwitchItem("0001", 1, "Stehlampe"))
        self.addItem(SampleSwitchItem("EE825339-C673-4D4D-807A-40D80835FCC9", 1, "Deckenleuchte"))
        self.addItem(SampleSliderItem("8F1D15DB-4247-482B-9F53-CF0B1CF42F89", 1, "Heizung"))

    def initRaspberryHardware(self):
        print "Raspberry hardware init..."
        """Füge Sensoren und Aktoren-Items hier ein"""   
        self.addItem(RaspiGpioItem("R16", 16, 0, "Led an Port 16"))
        self.addItem(RaspiGpioItem("R18", 18, 0, "Led an Port 18"))
        self.addItem(CpuUsageItem("CPU001", ItemTypes.Temperature, "Raspberry CPU-Auslastung"))
        self.addItem(SampleSwitchItem("0001", 1, "Stehlampe")) 
        self.addItem(SampleSwitchItem("EE825339-C673-4D4D-807A-40D80835FCC9", 1, "Deckenleuchte")) 
        self.addItem(SampleSliderItem("8F1D15DB-4247-482B-9F53-CF0B1CF42F89", 1, "Heizung")) 
        pass

if __name__ == "__main__":
    #logging.basicConfig(filename='ThingsConnectorRunner.log', level=logging.INFO)
    #logging.info("Started")
    
    if (is_windows):
        nodeId = "WindowsNode4711" # Eindeutige Id
        nodeName = "Schreibtisch"
    else:
        nodeId = "LinuxNode4711" # Eindeutige Id
        nodeName = "Raspberry Keller"

    url = "ws://dev.huvermann.com:8000" #Testserver im Internet
    #url = "ws://localhost:8000" #Adresse des Servers
    
    loopDelay = 0.5

    runner = ThingsConnectorRunner(nodeId, url, nodeName, loopDelay)
    
    if (is_windows()):
        runner.initSamples()
    else:
        runner.initRaspberryHardware()

    runner.run()




