import os
import sys, getopt
import platform

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

def executeOnLinux(port, direction, value):
    print "Not implemented"
    pass
def executeOnWindows(port, direction, value):
    print "port :%s" % (port)
    print "direction: %s" % (direction)
    print "value: %s" % (value)
    pass

def executeArguments(port, direction, value):
    if platform.system == 'Linux':
        executeOnLinux(port, direction, value)
    elif platform.system == "Windows":
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