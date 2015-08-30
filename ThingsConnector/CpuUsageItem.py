import subprocess
from ThingsItemBase import *
from locale import *

class CpuUsageItem(ThingsItemBase):
    """Displays the CPU Usage"""
    def __init__(self, id, itemType, description):
        return super(CpuUsageItem, self).__init__(id, itemType, description)

    def readCpuUsage(self):
        try:
            # Die Cpu-Auslastung von der commandozeile einlesen:
            str = subprocess.Popen(["tools/CPUTemp.exe", ""], stdout=subprocess.PIPE).communicate()[0]
            self.value = float(str.replace(',','.'))
            self.lastError = None
            print str
            return self.value
        except Exception, e:
            return (None, e)

    def getItemValue(self):
        """Hier wird das Lesen des Wertes implementiert..."""
        self.value = self.readCpuUsage()
        return self.value


