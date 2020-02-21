/**
 * Illustrates the JavaScript generator functions. These tests aren't
 * related to a specific functionality.
 */
describe("Generator Functions", function () {
    it('illustrates generator functions', function () {
        function* generatorFun() {
            yield 1;
            yield 2;
        }

        var iter = generatorFun();

        var result = iter.next();
        expect(result.done).toBeFalse();
        expect(result.value).toBe(1);
        result = iter.next();
        expect(result.done).toBeFalse();
        expect(result.value).toBe(2);

        // Calling next() one more time will move the generator function beyond
        // the last yield operator, meaning that there's no more values to return
        result = iter.next();
        expect(result.done).toBeTrue();
        expect(result.value).toBe(undefined);
    });

    it('iterate over values produced by a generator using while loop', function () {
        function* generatorFun() {
            yield 1;
            yield 2;
            yield 3;
            yield 4;
            yield 5;
            yield 6;
        }

        let i = 1;
        let iter = generatorFun();
        let item;
        while (!(item = iter.next()).done) {
            expect(item.value).toBe(i++);
        }
    });

    it('iterate over values produced by a generator with for-of loop', function () {
        function* generatorFun() {
            yield 1;
            yield 2;
            yield 3;
            yield 4;
            yield 5;
            yield 6;
        }

        let i = 1;
        for (let item of generatorFun()) {
            expect(item).toBe(i++);
        }
    });

    it('using yield* to delegate to another generator', function () {
        // Uses yield* to delegate calls to another delegator. Once the
        // execution reaches yield*, calls to the generatorFun1 iterator's
        // next method are re-routed to generatorFun2 iterator until that
        // iterator has no work left.
        function* generatorFun1() {
            yield 1;
            yield 2;
            yield* generatorFun2();
            yield 6;
            yield 7;
            yield 8;
        }

        function* generatorFun2() {
            yield 3;
            yield 4;
            yield 5;
        }

        let i = 1;
        for (let value of generatorFun1()) {
            expect(value).toBe(i++);
        }
    });
});