// Use fdescribe to only run a particular suite and fit to only run
// a particular test in the suite.
// Use xdescribe to disable a particular suite and xit to disable
// a particular test
describe("SampleTestSuite", function() {
    it("will unconditionally pass", function() {
        expect(true).toBe(true);
    });
    fit("will unconditionally fail", function() {
        expect(true).toBe(false);
    });
});