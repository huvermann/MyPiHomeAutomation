// Injector tests.
describe("Injector Tests", function () {
    function dummyInjectorTestFunc() {
        this.foo = function () {
            return "foo";
        }
        return "1234"
    }

    it("can create classes", function () {
        var inj = new Injector(function () { });
        var actual = inj.CreateClass(dummyInjectorTestFunc);
        expect(actual.foo()).toBe("foo");
    });

    it("calls bootstrapper method", function () {
        var called = false;
        function testBootStrap() {
            called = true;
        }
        expect(called).toBe(false);
        var inj = new Injector(testBootStrap);
        expect(called).toBe(true);
    });

    it("can attatch methods by bootstrap", function () {
        var actual = new Injector(dummyInjectorTestFunc);
        expect(actual.foo()).toBe("foo");
    });
});