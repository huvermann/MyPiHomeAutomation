from ThingsConnectorBase import *
import ItemTypes
from CpuUsageItem import *



class ThingsConnectorRunner(ThingsConectorBase):
    """description of class"""

    def run(self):
        self.RunConnector();



if __name__ == "__main__":
    runner = ThingsConnectorRunner("ms://localhost:8000", "Solaranlage", 5000)
    cpuUsageItem = CpuUsageItem("12345", ItemTypes.Temperature, "CPU Auslastung PC1");
    
    runner.addItem(cpuUsageItem); 
    runner.run()



