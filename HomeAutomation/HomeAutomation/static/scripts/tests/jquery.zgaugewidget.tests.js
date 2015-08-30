describe("jQuery.zgauge tests", function () {
    var actual = null;
    beforeEach(function () {
        setFixtures('</canvas><div id="actual" data-role="gaugewidget" height=50 width=60 ' +
            'data-lines="20" data-height=50 data-width=60></div>');
        actual = $('#actual').gaugewidget().gaugewidget('instance');
    });
    it('Attributes contains lines', function () {
        expect(actual.options.lines).toBe(20);
    });

    it('Attributes contains height', function () {
        console.log("------------------------------");
        console.log(actual.options);
        console.log("------------------------------");

        expect(actual.options.height).toBe(50);
        expect(actual.options.width).toBe(60)
        //expect(actual.getAttribute('height')).toBe(50);
    });

});