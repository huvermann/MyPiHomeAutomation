

function MessageManagerII(injector) {
    var registry = [];
    var websocket = null;
    var consoleObject = injector.console;
    this.parentElement = injector.parent;
    result = this;

    this.getRegistry = function () {
        return registry;
    }

    this.getConsole = function () {
        return consoleObject;
    }

    this.onSocketClose = function (evt) {
    }

    this.handleMessageType = function (message) {
        if (message) {
            if (message.messagetype in registry) {
                // Invoce message tpye handler:
                registry[message.messagetype].callback(message, registry[message.messagetype].targetElement);
            } 
        }
    }

    this.onSocketMessage = function (evt) {
        // Message parsen...
        if (evt && evt.data) {
            try {
                var msg = JSON.parse(evt.data);
                if (msg != null && msg.messagetype) {
                    if (this.messageManager) {
                        this.messageManager.handleMessageType(msg);
                    }

                }
            }
            catch (err) {
                if (consoleObject) {
                    consoleObject.error(err);
                } else {
                    console.error(err);
                }
                

            }
        }

    }

    this.onSocketError = function (evt) {
        consoleObject.log("error:" + evt.data)
    }

    this.sendMessage = function (message) {
        if (message) {
            websocket.send(message);
            console.log("mm send messag");
        }
    }

    this.subscribeMessages = function () {
        for (var i in registry) {
            var subscribeMsg = {
                "messagetype": "subscribe",
                "data": i
            }
            websocket.send(JSON.stringify(subscribeMsg));
        }
    }

    /*
    Send GetPages
    */
    this.requestPages = function () {
        var requestMsg = {
            "messagetype": "getPages",
            "data": ""
        }
        websocket.send(JSON.stringify(requestMsg));
    }

    this.onSocketOpen = function (evt) {
        // subscribe the message types
        if (this.messageManager) {
            this.messageManager.subscribeMessages();

            // request pages erst nach logon
            this.messageManager.requestPages();
        }
    }


    this.registerMessage = function (messageType, callback, targetElement) {
        registry[messageType] = {
            callback: callback,
            targetElement: targetElement
        };
    }

    this.createWebSocket = function (wsuri) {
        return new WebSocket(wsuri);
    }


    this.open = function (wsuri) {
        websocket = this.createWebSocket(wsuri);
        websocket.messageManager = this;
        websocket.onopen = this.onSocketOpen;
        websocket.onclose = this.onSocketClose;
        websocket.onmessage = this.onSocketMessage;
        websocket.onerror = this.onSocketError;
    }
    return result;
}