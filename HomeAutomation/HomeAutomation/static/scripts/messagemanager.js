

function MessageManagerII(injector) {
    var registry = [];
    var websocket = null;
    var consoleObject = injector.console;
    result = this;

    this.getRegistry = function () {
        return registry;
    }

    this.getConsole = function () {
        return consoleObject;
    }

    this.onSocketClose = function (evt) {
        consoleObject.log("On Socket Close.");
    }

    this.handleMessageType = function (message) {
        consoleObject.log("HandleMessageType" + message.messagetype);
        if (message.messagetype in registry) {
            // Invoce message tpye handler:
            registry[message.messagetype](message);
        }

    }

    this.onSocketMessage = function (evt) {
        // Message parsen...
        consoleObject.log(evt);
        if (evt.data) {
            try {
                var msg = JSON.parse(evt.data);
                if (msg.messagetype) {
                    if (this.messageManager) {
                        this.messageManager.handleMessageType(msg);
                    }

                }
            }
            catch (err) {
                console.log(evt);
                consoleObject.error(err);

            }
        }

    }

    this.onSocketError = function (evt) {
        consoleObject.log("error:" + evt.data)
    }

    this.sendMessage = function (message) {
        if (message) {
            websocket.send(message);
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
        console.log("onSocketOpen called.");
        // subscribe the message types
        if (this.messageManager) {
            this.messageManager.subscribeMessages();
            this.messageManager.requestPages();
        }
    }


    this.registerMessage = function (messageType, callback) {
        registry[messageType] = callback;
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