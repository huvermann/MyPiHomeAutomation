import logging
from utilsTings import is_windows
from ThingsConnectorBase import *
import ItemTypes
from CpuUsageItem import *
from SampleSwitchItem import *
from SampleSliderItem import *
if (not is_windows()):
    from raspiGpioItem import *

from utilsTings import is_windows


class ThingsConnectorRunner(ThingsConectorBase):
    """description of class"""

    def run(self):
        self.RunConnector();

    def initSamples(self):
        logging.info("initSamples called")
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
    
    nodeId = "4711xxo" # Eindeutige Id
    #url = "ws://dev.huvermann.com:8000"
    url = "ws://localhost:8000" #Adresse des Servers
    nodeName = "Solaranlage"
    loopDelay = 0.5

    runner = ThingsConnectorRunner(nodeId, url, nodeName, loopDelay)
    
    if (is_windows()):
        runner.initSamples()
    else:
        runner.initRaspberryHardware()

    runner.run()
    logging.info("Finished")




