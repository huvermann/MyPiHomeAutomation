import logging
from utilsTings import is_windows
from ThingsConnectorBase import *
import ItemTypes
from CpuUsageItem import *
from SampleSwitchItem import *
from SampleSliderItem import *
from raspiGpioItem import *
from utilsTings import is_windows


class ThingsConnectorRunner(ThingsConectorBase):
    """description of class"""

    def run(self):
        self.RunConnector();

    def initSamples(self):
        logging.info("initSamples called")
        """ Items definieren, später über config datei"""
        cpuUsageItem = CpuUsageItem("7E463F10-8D83-4226-82A5-DFCF927FD1ED", ItemTypes.Temperature, "CPU Auslastung PC1");
        switch1 = SampleSwitchItem("0001", 1, "Stehlampe")
        switch2 = SampleSwitchItem("EE825339-C673-4D4D-807A-40D80835FCC9", 1, "Deckenleuchte")
        slider1 = SampleSliderItem("8F1D15DB-4247-482B-9F53-CF0B1CF42F89", 1, "Heizung")
        # ----------------------------------------------------------------------------
        # Items anfügen
        # ----------------------------------------------------------------------------
        self.addItem(cpuUsageItem); 
        self.addItem(switch1); 
        self.addItem(switch2); 
        self.addItem(slider1); 

    def initRaspberryHardware(self):
        print "Raspberry hardware init..."
        """Füge Sensoren und Aktoren-Items hier ein"""
        port16 = RaspiGpioItem("R16", 16, 0, "Led an Port 16")
        switch1 = SampleSwitchItem("0001", 1, "Stehlampe")
        switch2 = SampleSwitchItem("EE825339-C673-4D4D-807A-40D80835FCC9", 1, "Deckenleuchte")
        slider1 = SampleSliderItem("8F1D15DB-4247-482B-9F53-CF0B1CF42F89", 1, "Heizung")
        
        self.addItem(port16)
        self.addItem(switch1) 
        self.addItem(switch2) 
        self.addItem(slider1) 
        logging.info("initRaspberryHardware called")
        pass



if __name__ == "__main__":
    #logging.basicConfig(filename='ThingsConnectorRunner.log', level=logging.INFO)
    #logging.info("Started")
    

    #url = "ws://dev.huvermann.com:8000"
    url = "ws://localhost:8000"
    runner = ThingsConnectorRunner(url, "Solaranlage", 10)
    
    if (is_windows()):
        runner.initSamples()
    else:
        runner.initRaspberryHardware()

    runner.run()
    logging.info("Finished")




