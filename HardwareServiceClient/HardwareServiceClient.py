import websocket
import thread
import time
import json

def on_message(ws, message):
    print message

def on_error(ws, error):
    print error

def on_close(ws):
    print "### closed ###"

def on_open(ws):
    print "### opened ###"

def run(*args):
    raw_input("Press Enter to continue...")
    for i in range(3):
        time.sleep(1)
        msg = {
            "messagetype": "gpio",
            "data": "test"
        }
        ws.send(json.dumps(msg))
        time.sleep(1)
    #ws.close()
    print "thread terminating..."
    thread.start_new_thread(run, ())

def run_client():
    ws.run_forever()

if __name__ == "__main__":
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp("ws://localhost:8000/",
                                on_message = on_message,
                                on_error = on_error,
                                on_close = on_close)
    ws.on_open = on_open
    thread.start_new_thread(run_client, ())
    run()
