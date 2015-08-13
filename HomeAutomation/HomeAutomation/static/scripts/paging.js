

function MessageManager() {
    var registry = [];
    var websocket = null;
    result = this;

    this.getRegistry = function() {
        return registry;
    }

    this.onSocketClose = function (evt) {
        console.log("On Socket Close.");
    }

    this.handleMessageType = function(message) {
        console.log("HandleMessageType" + message.messagetype);
        if (message.messagetype in registry) {
            // Invoce message tpye handler:
            registry[message.messagetype](message);
        }

    }

    this.onSocketMessage = function (evt) {
        // Message parsen...
        console.log(evt);
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
                console.error(err);
           
            }
        }

    }

    this.onSocketError = function (evt) {
        console.log("error:" + evt.data)
    }

    this.sendMessage = function (message) {
        if (message) {
            websocket.send(message);
        }
    }

    this.subscribeMessages = function (){
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


    this.open = function (wsuri) {
        websocket = new WebSocket(wsuri);
        websocket.messageManager = this;
        websocket.onopen = this.onSocketOpen;
        websocket.onclose = this.onSocketClose;
        websocket.onmessage = this.onSocketMessage;
        websocket.onerror = this.onSocketError;
    }
    return result;
}

var messageManager = null;

function onPageList(message) {
    console.log("func onPageList");
    console.log(message);
    if (message.data) {
        if (message.data.pages) {
            UpdatePageListView(message.data.pages);
        }
    }
}

function onMainpageUpdate(message) {
    console.log("onMainpageUpdate called");
}

function pageReady() {

    $('#details').on('pagebeforeshow', function (e, data) {
        if (typeof data.toPage === "string") {
            console.log(data.toPage);
        } else {
            console.log("is no string!");
        }
    });

    messageManager = new MessageManager();
    messageManager.onSocketConnected = function () {
        console.log("My onSocketConnected.");
    }
    messageManager.registerMessage("PageList", onPageList);
    messageManager.registerMessage("UpdateItems", onMainpageUpdate);
    messageManager.open("ws://localhost:8000/");
    var data = loadPageList();
    UpdatePageListView(data.pages);
}

var globalPages;

function updateDetails(page) {
    $("#detailsheader").empty().append(globalPages[page].PageName)
    var content = "PageId: " + globalPages[page].ID + "<br/> " + "Name: " + globalPages[page].PageName;
    content += '<form><label for="switch1">Schalter 1</label><input type="checkbox" data-role="flipswitch" name="switch1" id="switch1"></form>';
    $('#detailcontent').empty().append(content);
    $('#switch1').val(True).flipswitch('refresh');
}

function goDetailPage(page) {
    $.mobile.navigate('#details');
    updateDetails(page)
}





function UpdatePageListView(pages) {
    globalPages = null;
    if (pages) {
        globalPages = pages;
        var entries = "";
        for (var page in pages) {
            //entries += '<li><a href="#details?id=' + pages[page].ID + '">' + pages[page].PageName + '</a></li>';
            entries += '<li><a href="#" onclick="goDetailPage(\'' + page + '\'); return false;">' + pages[page].PageName + '</a></li>';
        }
        $("#mylistview").empty().append(entries).listview("refresh");
    }
}

function loadPageList() {
    var result = {
        "pages": [
            { "PageName": "Page1", "ID": "Page1" },
            { "PageName": "Page2", "ID": "Page2" },
            { "PageName": "Page3", "ID": "Page3" },
            { "PageName": "Page4", "ID": "Page4" }

        ]
    }
    return result;
}