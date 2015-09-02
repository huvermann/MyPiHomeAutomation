describe("jquery.servicemenuewidget tests", function () {
    var actual = null;

    beforeEach(function () {
        setFixtures('<div id="actual" data-role="servicemenuwidget" data-url="ws://testhost:12345/" data-mode="collapsible"></div>');
        actual = $('#actual').servicemenuwidget().servicemenuwidget('instance');
    });

    it("sets data-url argument to options", function () {
        expect(actual.options.url).toBe('ws://testhost:12345/');

    }),
    it("sets data-mode argument to options", function () {
        expect(actual.options.mode).toBe('collapsible');

    }),
    it("calls registerMessages", function () {
        spyOn(actual, 'registerMessages');
        actual._create();
        expect(actual.registerMessages).toHaveBeenCalled();
    }),
    // Loading show has been removed from on_create
    //it("calls loading show on _create", function () {
    //    spyOn(window, 'loading');
    //    actual._create();
    //    expect(window.loading).toHaveBeenCalledWith('show');
    //}),
    it("calls _update when refresh is called.", function () {
        spyOn(actual, '_update');
        actual.refresh();
        expect(actual._update).toHaveBeenCalled();
    }),
    it("onPageList calls loading().", function () {
        spyOn(window, 'loading');
        actual.onPageList('', $('#actual'));
        expect(window.loading).toHaveBeenCalled();
    }),
    it("onPageList calls refreshJQueryComponents().", function () {
        spyOn(window, 'refreshJQueryComponents');
        actual.onPageList('', $('#actual'));
        expect(window.refreshJQueryComponents).toHaveBeenCalled();
    }),
    it("onPageList calls loading with hide.", function () {
        var callParam = null;

        spyOn(window, 'loading');
        actual.onPageList('', $('#actual'));
        expect(window.loading).toHaveBeenCalledWith('hide');
    }),
    it("onPageList calls pagesToCollapsible if message contains pages.", function () {
        spyOn(window, 'pagesToCollapsible');
        message = { data: { pages: "test" } };
        actual.onPageList(message, $('#actual'));
        expect(window.pagesToCollapsible).toHaveBeenCalled();
    }),
    it("Servicelocator contains MessageManager", function () {
        expect(actual.servicelocator).toBeDefined();
        expect(actual.servicelocator.MessageManager).toBeDefined();
    })
});
