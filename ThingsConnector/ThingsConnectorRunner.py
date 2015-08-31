from ThingsConnectorBase import *
import ItemTypes
from CpuUsageItem import *
from SampleSwitchItem import *
from SampleSliderItem import *


class ThingsConnectorRunner(ThingsConectorBase):
    """description of class"""

    def run(self):
        self.RunConnector();



if __name__ == "__main__":
    
    # ----------------------------------------------------------------------------
    #Items definieren, später über config datei
    # ----------------------------------------------------------------------------
    cpuUsageItem = CpuUsageItem("7E463F10-8D83-4226-82A5-DFCF927FD1ED", ItemTypes.Temperature, "CPU Auslastung PC1");
    switch1 = SampleSwitchItem("0001", 0, "Stehlampe")
    switch2 = SampleSwitchItem("EE825339-C673-4D4D-807A-40D80835FCC9", 0, "Deckenleuchte")
    slider1 = SampleSliderItem("8F1D15DB-4247-482B-9F53-CF0B1CF42F89", 20, "Heizung")


    
    # ----------------------------------------------------------------------------
    #runner = ThingsConnectorRunner("ws://dev.huvermann.com:8000", "Solaranlage", 5000)
    runner = ThingsConnectorRunner("ws://localhost:8000", "Solaranlage", 5000)
    
    runner.addItem(cpuUsageItem); 
    runner.addItem(switch1); 
    runner.addItem(switch2); 
    runner.addItem(slider1); 
    
    
    # Connector starten
    runner.run()



