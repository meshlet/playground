/**
 * Illustrates JavaScript sets introduce in ES6.
 */
describe("Sets", function () {
    it('illustrates creating sets', function () {
        // Create a set with some initial items
        let set = new Set(["Mickey", "Bob", "Tony", "Charles", "Rob"]);

        expect(set.size).toBe(5);
        expect(set.has("Bob")).toBeTrue();
        expect(set.has("Steve")).toBeFalse();

        set.add("Steve");
        expect(set.size).toBe(6);
        expect(set.has("Steve")).toBeTrue();

        // Adding existing item to the set has no effect
        set.add("Mickey");
        expect(set.size).toBe(6);
    });

    it('illustrates iterating over set with for-of loop', function () {
        let array = ["Mickey", "Bob", "Tony", "Charles", "Rob"];
        let set = new Set(array);

        // Iterate over the set and assert that values are visited in
        // insertion order
        let i = 0;
        for (let value of set) {
            expect(value).toEqual(array[i++]);
        }
    });

    it('illustrates using sets to create union of collections', function () {
        let names1 = ["Mickey", "Rob", "Tony", "Mark", "Charlie", "Terry"];
        let names2 = ["Robert", "Alec", "Rob", "David", "Charlie", "Terry", "Mickey"];

        // Union of these two arrays can be easily created by merging the two
        // arrays and then creating the set out of that merged array. The set
        // will filter out the duplicates. The arrays can be conveniently
        // merged with the spread operator.
        let union = new Set([...names1, ...names2]);

        let expectedUnion = ["Mickey", "Rob", "Tony", "Mark", "Charlie", "Terry", "Robert", "Alec", "David"];
        expect(union.size).toBe(expectedUnion.length);

        // Verify that items in the produced union are in correct order
        let i = 0;
        for (let value of union) {
            expect(value).toEqual(expectedUnion[i++]);
        }
    });

    it('illustrates finding intersection of two sets', function () {
        let names1 = new Set(["Mickey", "Rob", "Tony", "Mark", "Charlie", "Terry"]);
        let names2 = new Set(["Robert", "Alec", "Rob", "David", "Charlie", "Terry", "Mickey"]);

        // Intersection of two sets can be found by using spread operator to turn one
        // set into an array, and then using Array.filter method to include only those
        // array elements that are also found in the second set. The array returned
        // by the Array.filter is then passed to the Set constructor to create a new
        // set that represents the intersection.
        let intersection = new Set(
            [...names1].filter(name => names2.has(name)));

        let expectedIntersection = ["Mickey", "Rob", "Charlie", "Terry"];
        expect(intersection.size).toBe(expectedIntersection.length);

        // Verify that items in the intersection are in expected order (their order
        // in the original sets needs to be preserved)
        let i = 0;
        for (let value of intersection) {
            expect(value).toEqual(expectedIntersection[i++]);
        }
    });

    it('illustrates finding difference of two sets', function () {
        let names1 = new Set(["Mickey", "Rob", "Tony", "Mark", "Charlie", "Terry"]);
        let names2 = new Set(["Robert", "Alec", "Rob", "David", "Charlie", "Terry", "Mickey"]);

        // Difference of two sets can be found by using the spread operator to turn the
        // first set into an array, and the using Array.filter method to include only
        // those array elements that are not found in the second set. The array returned
        // by the Array.filter is then passed to the Set constructor to create a new
        // set that represents the difference.
        let difference = new Set(
            [...names1].filter(name => !names2.has(name)));

        let expectedDifference = ["Tony", "Mark"];
        expect(difference.size).toBe(expectedDifference.length);

        // Verify that items in the difference are in expected order (their order
        // in the original sets needs to be preserved)
        let i = 0;
        for (let value of difference) {
            expect(value).toEqual(expectedDifference[i++]);
        }
    });
});