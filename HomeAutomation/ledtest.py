#!/usr/bin/env python
 
import os
import time
 
import RPi.GPIO as GPIO
 
GPIO.setmode(GPIO.BCM)
GPIO.setup(23, GPIO.OUT)
while True:
    GPIO.output(23, True)
    time.sleep(0.5)
    GPIO.output(23, False)
    time.sleep(0.5)
