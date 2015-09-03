import subprocess
from ThingsItemBase import *
from locale import *
from utilsTings import is_windows
if (not is_windows()):
    import psutil
    #import random


class CpuUsageItem(ThingsItemBase):
    """Displays the CPU Usage"""
    def __init__(self, id, itemType, description):
        return super(CpuUsageItem, self).__init__(id, itemType, description)

    def readWindowsCpuUsage(self):
        try:
            # Die Cpu-Auslastung von der commandozeile einlesen:
            str = subprocess.Popen(["tools/CPUTemp.exe", ""], stdout=subprocess.PIPE).communicate()[0]
            self.value = float(str.replace(',','.'))
            self.lastError = None
            print str
            return self.value
        except Exception, e:
            return (None, e)

    def readArmCpuUsage(self):
        try:
            #cpu = psutil.cpu_percent(interval=1)
            #return random.random(1,100)
            return psutil.cpu_percent(interval=1)
        except Exception, e:
            return 0

    def readCpuUsage(self):
        if is_windows():
            return self.readWindowsCpuUsage()
        else:
            return self.readArmCpuUsage()

    def getItemValue(self):
        """Hier wird das Lesen des Wertes implementiert..."""
        self.value = self.readCpuUsage()
        return self.value


