
function Injector(bootstrap) {
    bootstrap.call(this);
    this.CreateClass = function (classname) {
        var result = eval('new ' + classname);
        return result;
    }
}