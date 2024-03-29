/**
 * Illustrates the JavaScript generator functions introduced in ES6.
 * It also illustrates async generators supported starting from ES8
 * which can be used with `for await...of` loops starting in ES9.
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

    it('illustrates iterating over generated values using while loop', function () {
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

    it('illustrates iterating over generated values with for-of loop', function () {
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

    it('illustrates using yield* to delegate to another generator', function () {
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

    it('illustrates communicating with generator functions', function () {
        function* generatorFun(initial) {
            // Value passed to the second call to iterator's next method is
            // assigned to 'passed_value1'
            let passed_value1 = yield initial;

            // Yield the value passed in the last next() call. Value passed
            // to the following next() call is assigned to 'passed_value2'
            let passed_value2 = yield passed_value1;

            // Yield the value passed in the last next() call.
            yield passed_value2;
        }

        // Initialize the generator and pass it initial value
        let iter = generatorFun(5);

        // Assert that first yield returns the initial value. Note that arguments
        // passed to the very first next() call are ignored. As there is no yield
        // waiting at this point (iterator isn't started yet), there's no way for
        // generator to access this value.
        expect(iter.next().value).toBe(5);

        // Call the next() method for the second time and pass it a value. This
        // value becomes the return value of the last yield statement (where the
        // generator waits to be resumed from).
        expect(iter.next(10).value).toBe(10);

        // Call the next one last time but do not provide an argument to it. The
        // return value of the yield statement in which generator is blocked in
        // should be undefined.
        expect(iter.next().value).toBe(undefined);

        // Calling next one last time will terminate the iterator (no more yields)
        expect(iter.next().done).toBeTrue();
    });

    it('illustrates throwing exceptions to generators', function () {
        function* generatorFun() {
            try {
                yield 0;

                // Don't expect to reach this point
                expect(true).toBeFalse();
                yield 1;
            }
            catch (e) {}
        }

        let iter = generatorFun();
        expect(iter.next().value).toBe(0);

        // Throw the exception to the generator. This should terminate
        // generator as the catch block (nor the rest of the generator)
        // has no further yield statements.
        iter.throw();
        expect(iter.next().done).toBeTrue();
    });

    it('illustrates terminating the iterator with return statement', function () {
        function* generatorFun() {
            yield 0;

            // The return statement terminates the iterator
            return 1;

            // The execution will never reach here
            yield 2;
        }

        let array = [];
        for (let value of generatorFun()) {
            array.push(value);
        }

        // The array will contain a single value 0, returned by the first yield
        // statement of the iterator. Note that for-of loop doesn't run an
        // additional iteration once iterator.done becomes true. And when iterator
        // encounters a 'return' statement it moves to done state. Hence value
        // returned by 'return' is ignored by the for-of loop.
        expect(array).toEqual([0]);
    });

    it('illustrates generating unique IDs using generator function', function () {
        function* generateUniqueId() {
            let id = 0;
            while (true) {
                yield id++;
            }
        }

        let iter = generateUniqueId();
        for (let i = 0; i < 10; ++i) {
            expect(iter.next().value).toBe(i);
        }
    });

    it('illustrates using async generators with `for await...of` loop', async function () {
        // Define an async generator that implements the async iterator protocol
        async function* asyncGenerator() {
            for (let i = 0; i < 3; ++i) {
                yield i;
            }
        }

        // Iterate over the values produced by the async iterator using the
        // for await...of loop
        const expectedValues = [0, 1, 2];
        let i = 0;
        for await(let value of asyncGenerator()) {
            expect(value).toBe(expectedValues[i++]);
        }
    });

    it('illustrates that async generator yield returns a promise', function () {
        // Define an async generator
        async function* asyncGenerator() {
            for (let i = 0; i < 3; ++i) {
                yield i;
            }
        }

        // Create the async iterator object
        const asyncIter = asyncGenerator();

        // The async generator's yield statements returns a promise
        expect(asyncIter.next()).toBeInstanceOf(Promise);
    });

    it('illustrates implementing async iterator protocol using async generators', async function () {
        class Person {
            constructor(name, surname) {
                this.name = name;
                this.surname = surname;
            }
        }

        // A user-defined object implements the async iterator protocol by
        // defining the method with Symbol.asyncIterator key. This test
        // implements this method as an async generator function that
        // yields the Promise object for each value it generates. The
        // promise is resolved once the value becomes available (or an
        // error occurs)
        const personAsyncIterable = {
            // The array of persons that is iterated over. In real-world scenario
            // this data would be retrieved from the server
            persons: [
                new Person("Mickey", "Mouse"),
                new Person("Tony", "Stark"),
                new Person("Rob", "Shawn")
            ],

            // Defines `asyncIterator` method as an async generator. We can use await
            // statement within an async generator to suspend the execution of the
            // generator until the promise resolves
            async *[Symbol.asyncIterator]() {
                // The delays in milliseconds used to simulate the delay in retrieving
                // each person
                const delays = [30, 10, 20];

                let index = 0;

                for (const person of this.persons) {
                    // Use await to suspend the execution of the generator until the
                    // promise resolves
                    let resolvedPerson = await new Promise(resolve => {
                        // The person is retrieved with some delay
                        setTimeout(() => {
                            // Resolve the promise with the Person object. Note that this
                            // object is picked up by the await statement and assigned to
                            // the `resolvedPerson` variable once the generator continues
                            // executing
                            resolve(person);
                        }, delays[index++]);
                    });

                    // Yield the person back to the caller
                    yield resolvedPerson;
                }
            }
        };

        // Iterate of the async iterable using the `for await...of` loop. The await
        // statement within the async generator suspend the generator's execution
        // returning a promise. The await statement of the `for await...of` loop
        // then suspends the execution of the test function and returns the same
        // promise to the Jasmine framework informing it that it needs to wait for
        // the promise to resolve. The promise resolves with the person object that
        // generator then yields to the `for await...of` loop. The process repeats
        // until generator completes.
        let i = 0;
        for await (let person of personAsyncIterable) {
            expect(person).toEqual(personAsyncIterable.persons[i++]);
        }

        expect(i).toBe(personAsyncIterable.persons.length);
    });
});