import os
import sys, getopt
import platform
import ptvsd
#ptvsd.enable_attach('iot')
#ptvsd.wait_for_attach()



def printHelp():
    print
    print "Sets a port on the raspberry pi."
    print "--------------------------------"
    print 'usage: python driveport.py -p <IOPORTNUMMER> -d <IN | OUT> -v <VALUE 1|0>'
    print 'example: sudo python driveport.py -p 23 -d out -v 1'
    print 'or for input'
    print 'example: sudo python driveport.py -p 23 -d in'
    print 'or for help:'
    print 'python driveport.py -h'
    print

def readPort(port):
    print "readPort"
    pass

def writePort(port, value):
    print "writePort"
    import RPi.GPIO as GPIO

    # RPi.GPIO Layout verwenden (wie Pin-Nummern)
    try:
        GPIO.setmode(GPIO.BOARD)
        GPIO.setwarnings(False)
        # Pin 16 (GPIO 23) auf Output setzen
        GPIO.setup(16, GPIO.OUT)
        # Wert setzen:
        if value == "1":
            GPIO.output(16, GPIO.HIGH)
            print 1
        else:
            GPIO.output(16, GPIO.LOW)
            print 0
    finally:
        #GPIO.cleanup()
        pass

def executeOnLinux(port, direction, value):
    if direction:
        if direction == 'in':
            readPort(port)
        elif direction == 'out':
            writePort(port, value)
        else:
            print "Error: Direction can be -d out or -in"

def executeOnWindows(port, direction, value):
    print "port :%s" % (port)
    print "direction: %s" % (direction)
    print "value: %s" % (value)
    cmd = '"C:\Program Files (x86)\PuTTY\plink.exe" pi@192.168.2.108 -pw hhk13mi sudo python ~/webserver/driveport.py -p %s -d %s -v %s' % (port, direction, value)
    os.system(cmd)
    pass

def executeArguments(port, direction, value):
    if platform.system() == 'Linux':
        executeOnLinux(port, direction, value)
    elif platform.system() == "Windows":
        executeOnWindows(port, direction, value)
        

def main(argv):
    try:
        opts, args = getopt.getopt(argv, "p:d:v:", [])
    except getopt.GetoptError:
        printHelp()
        sys.exit(2)

    port = ''
    direction = ''
    value = ''    
    for opt, arg in opts:
        if opt == '-h':
            printHelp()
        elif opt == '-p':
            port = arg
        elif opt == '-d':
            direction = arg
        elif opt == '-v':
            value = arg

    executeArguments(port, direction, value)

if __name__ == "__main__":
    main(sys.argv[1:])