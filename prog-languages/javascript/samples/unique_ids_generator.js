/**
 * Generator function that generates unique sequence of IDs.
 *
 * @returns {IterableIterator<number>}
 */
function* generateUniqueId() {
    let id = 0;
    while (true) {
        yield id++;
    }
}

/**
 * Tests.
 */
describe("Unique IDs Generator", function () {
    it('should generate unique IDs', function () {
        let iter = generateUniqueId();
        for (let i = 0; i < 10; ++i) {
            expect(iter.next().value).toBe(i);
        }
    });
});