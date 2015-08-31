from ThingsConnectorBase import *
import ItemTypes
from CpuUsageItem import *
from SampleSwitchItem import *
from SampleSliderItem import *


class ThingsConnectorRunner(ThingsConectorBase):
    """description of class"""

    def run(self):
        self.RunConnector();

    def initSamples(self):
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
        """Füge Sensoren und Aktoren-Items hier ein"""
        pass



if __name__ == "__main__":
    #runner = ThingsConnectorRunner("ws://dev.huvermann.com:8000", "Solaranlage", 5000)
    runner = ThingsConnectorRunner("ws://localhost:8000", "Solaranlage", 10)
    runner.initSamples()
    runner.run()



