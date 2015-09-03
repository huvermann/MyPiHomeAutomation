from ThingsItemBase import *
import ItemTypes
import RPi.GPIO as GPIO

class RaspiGpioItem(ThingsItemBase):
    """RaspiGpioItem Class to drive a GPIO output"""
    def __init__(self, id, gpio, initValue, description):
        itemType = ItemTypes.Switch
        self.itemId = id
        self.gpio = int(gpio)
        self.value = int(initValue)

        # Init Hardware:
        # RPi.GPIO Layout verwenden (wie Pin-Nummern)
        GPIO.setmode(GPIO.BOARD)
        # Pin auf Output setzen:
        GPIO.setup(self.gpio, GPIO.OUT)
        # Schalten
        self.setGPIO(self.value)
        return super(RaspiGpioItem, self).__init__(id, itemType, description)


    def setItemValue(self, value):
        self.setGPIO(value)
        super(RaspiGpioItem, self).setItemValue(value)

    def setGPIO(self, value):
        # Invertiert, LED leuchtet bei GPIO.Low
        if (value == 0):
            GPIO.output(self.gpio, GPIO.HIGH)
        else:
            GPIO.output(self.gpio, GPIO.LOW)


