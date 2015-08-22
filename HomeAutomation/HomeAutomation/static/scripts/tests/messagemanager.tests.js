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
});