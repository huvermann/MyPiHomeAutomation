describe("HtmlHelper tests", function () {
    it('two guids can not be equal.', function () {
        var guid1 = guid();
        var guid2 = guid();
        expect(guid1).not.toBe(guid2);
    });
    it("guids have length", function () {
        var actual = guid();
        expect(actual.length).toBe(36);
    });

});