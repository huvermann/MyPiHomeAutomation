describe("UI Test template", function () {
    beforeEach(function () {
        setFixtures('\
                    <input type="checkbox" id="checked" checked="checked" />\n\
                    <input type="checkbox" id="not_checked" />');
    });
    it("should pass on checked elelment", function () {
        expect($('#checked')).toBeChecked()
    });
});

