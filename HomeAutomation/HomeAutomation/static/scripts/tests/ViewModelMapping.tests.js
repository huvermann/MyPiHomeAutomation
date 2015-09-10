describe("Mappin View Model tests", function () {

    it("inherites from viewmodelbase", function () {
        var xx = Viewmodel_mapping('#mapping');
        expect(xx).toBeDefined();
    });

    it("bla", function () {
        var xx = Viewmodel_mapping('#mapping');
        console.log(xx);
        expect(xx.onViewPageCreate).toBeDefined();
    });


});