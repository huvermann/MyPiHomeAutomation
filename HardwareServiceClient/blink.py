import time
import RPi.GPIO as GPIO
import ptvsd
ptvsd.enable_attach('iot')
ptvsd.wait_for_attach()

# RPi.GPIO Layout verwenden (wie Pin-Nummern)
GPIO.setmode(GPIO.BOARD)

# Pin 18 (GPIO 24) auf Input setzen
GPIO.setup(18, GPIO.IN)

# Pin 11 (GPIO 17) auf Output setzen
# Pin 16 (GPIO 23) auf Output setzen
GPIO.setup(16, GPIO.OUT)

# Dauersschleife
while 1:
  # LED immer ausmachen
  GPIO.output(16, GPIO.LOW)
  time.sleep(1)
  GPIO.output(16, GPIO.HIGH)
  time.sleep(1)
