describe("MessageManager Tests", function () {
    function EmptyConsole() {

    }

    function ConsoleMock() {
        this.log = function (txt) {
            return txt;
        }
    }

    beforeEach(function () {
        this.conMock = new ConsoleMock();
        //spyOn(this.conMock, 'log');
    });;


    it("stores the console", function () {
        var container = function () { }
        container.console = "consolemock";

        mm = new MessageManagerII(container);
        expect(mm.getConsole()).toBe(container.console);
    });

    it("console.log to be undefined. (negative test)", function () {
        var mm = new EmptyConsole();
        expect(mm.log).toBeUndefined();
    });

    it("createWebSocket returns instance of WebSocket", function () {
        var container = function () { }
        container.console = "consolemock";
        var mm = new MessageManagerII(container);

        expect(function () { var actual = mm.createWebSocket(""); }).toThrow();
        expect(function () { var xx = mm.createWebSocket("ws://localhost:9999"); }).not.toThrow();
    });

    it("ignores invalid messages", function () {
        var container = function () { }
        var mm = new MessageManagerII(container);
        mm.handleMessageType(null);
    });

    it("handleMessageType executes registered callback.", function () {
        var container = function () { }
        var actual_message = null;
        var actual_target = null;

        var testcall = function(msg, target){
            actual_message = msg;
            actual_target = target;
        }
        var testmessage = {
                "messagetype": "unittest",
                "data": "invalid message data"
            }

        var mm = new MessageManagerII(container);
        mm.registerMessage('unittest', testcall, "xxo");
        //mm.registry['unittest'] = { "callback": testcall, "targetElement": "xxo" }
        mm.handleMessageType(testmessage);
        expect(actual_message).toBe(testmessage);
        expect(actual_target).toBe("xxo");

    });

    it("OnSocketMessage can handle null messages", function () {
       var container = function () { };
       var mm = new MessageManagerII(container);
       var testEvent = null;
       mm.onSocketMessage(testEvent);
    });

    it("OnSocketMessage can handle empty data", function(){
        var consoleMock = function () {
            this.errorCalled = false;
            this.error = function (err) {
                this.errorCalled = true;
            };
        }
        var container = function () { 
            console: consoleMock
        };
        var mm = new MessageManagerII(container);
        var testEvent = { "data": "invalid data." };
        mm.onSocketMessage(testEvent);
    });

    it("requestMappingInfo sends websocket message", function () {
        var container = function (wsuri) { };
        var message = null;
        var webSocketMock = function () {
        }
        webSocketMock.send = function (msg) {
            message = msg;
        };

        var mockCreateWebSocket = function () {
            return webSocketMock

        };
        var mm = new MessageManagerII(container);
        mm.createWebSocket = mockCreateWebSocket
        mm.open();
        mm.requestMappingInfo();
        actual = JSON.parse(message);
        console.log(actual);
        expect(actual.messagetype).toBe('getMappingInfo');
    });

    // todo: write a test for OnSocketMessage with valid json data and calls the messagehandler
    // or does not call the message handler if no messagetype


});