/**
 * Illustrates JavaScript arrays.
 */
describe("Arrays", function () {
    it('illustrates creating arrays', function () {
        const array1 = [1, 5, 10];
        const array2 = new Array("A", "C", "Z", "H");

        expect(array1.length).toBe(3);
        expect(array2.length).toBe(4);

        // Out-of-bound access results in undefined value
        expect(array1[3]).toBeUndefined();

        // Writing to out-of-bound array indices automatically re-sizes
        // the array. Note that undefined is assigned to array1[3] and
        // array1[4] below. In other words, if there's a gap between the
        // old last array element and the new last array element, the
        // elements in that gap are set to undefined.
        array1[5] = 50;
        expect(array1.length).toBe(6);
        expect(array1[3]).toBeUndefined();
        expect(array1[4]).toBeUndefined();

        // Manually overwriting the length property with a lower value
        // deletes the excess items.
        array2.length = 2;
        expect(array2.length).toBe(2);
        expect(array2[0]).toEqual("A");
        expect(array2[1]).toEqual("C");
        expect(array2[2]).toBeUndefined();
        expect(array2[2]).toBeUndefined();

        // Manually overwriting the length property with a greater value
        // extends the array and assigns undefined to new elements.
        array1.length = 8;
        expect(array1.length).toBe(8);
        expect(array1[6]).toBeUndefined();
        expect(array2[7]).toBeUndefined();
    });

    it('illustrates adding/removing items at either end of the array', function () {
        const array = [];

        // Push new item to the end of the array
        array.push(0);
        expect(array.length).toBe(1);
        expect(array).toEqual([0]);

        // Push another item to the end of the array
        array.push(50);
        expect(array.length).toBe(2);
        expect(array).toEqual([0, 50]);

        // Insert an item at the beginning of the array
        array.unshift(-10);
        expect(array.length).toBe(3);
        expect(array).toEqual([-10, 0, 50]);

        // Pops the last item of the array
        const lastItem = array.pop();
        expect(lastItem).toBe(50);
        expect(array.length).toBe(2);
        expect(array).toEqual([-10, 0]);

        // Removes the first element of the array
        const firstItem = array.shift();
        expect(firstItem).toBe(-10);
        expect(array.length).toBe(1);
        expect(array).toEqual([0]);
    });

    it('illustrates adding/removing items at arbitrary positions using splice', function () {
        const array = ["A", "Z", "D", "W", "P", "R", "J"];

        // Insert the sequence ["X", "B", "Q"] at index 3 of the array. Note that this shifts
        // the item currently sitting at that index to the right
        let removedItems = array.splice(3, 0, "X", "B", "Q");
        expect(removedItems).toEqual([]);
        expect(array).toEqual(["A", "Z", "D", "X", "B", "Q", "W", "P", "R", "J"]);

        // Remove 3 items starting at index 5
        removedItems = array.splice(5, 3);
        expect(removedItems.length).toBe(3);
        expect(removedItems).toEqual(["Q", "W", "P"]);
        expect(array).toEqual(["A", "Z", "D", "X", "B", "R", "J"])

        // Remove 2 items at index 0 while also inserting the sequence ["O", "U", "V"]
        removedItems = array.splice(0, 2, "O", "U", "V");
        expect(removedItems.length).toBe(2);
        expect(removedItems).toEqual(["A", "Z"]);
        expect(array).toEqual(["O", "U", "V", "D", "X", "B", "R", "J"])

        // Remove 5 items starting at index 5. Note that the length of the array
        // at this point is 8, so there's only 3 elements to remove starting at
        // index 5. The splice method will stop once it reaches the end of the
        // array
        removedItems = array.splice(5, 5);
        expect(removedItems.length).toBe(3);
        expect(removedItems).toEqual(["B", "R", "J"]);
        expect(array).toEqual(["O", "U", "V", "D", "X"]);

        // Remove 2 elements starting at index 5. Note that index 5 is out-of-bounds,
        // so splice method will do nothing.
        removedItems = array.splice(5, 2);
        expect(removedItems.length).toBe(0);
        expect(array).toEqual(["O", "U", "V", "D", "X"]);

        // Insert the sequence ["L", "F", "C"] starting at index 7. However, as 4 is
        // the last index in the array, splice method will insert the new sequence
        // starting at index 5 instead of leaving the hole at indices 5 and 6.
        array.splice(7, 0, "L", "F", "C");
        expect(array).toEqual(["O", "U", "V", "D", "X", "L", "F", "C"]);
    });

    it('illustrates mapping an array', function () {
        function Person(name, surname) {
            this.name = name;
            this.surname = surname;
        }

        let persons = [
            new Person("Mickey", "Mouse"),
            new Person("Tony", "Stark"),
            new Person("Bob", "Redford")
        ];

        // Map the array to a new array of strings where each string represents the
        // full name of the person
        let personFullNames = persons.map(person => person.name + " " + person.surname);
        expect(personFullNames).toEqual(["Mickey Mouse", "Tony Stark", "Bob Redford"]);
    });

    it('illustrates using every and some array methods', function () {
        // Uses every method to check if all array elements are greater than or equal to 5
        expect(
            [5, 10, 64, 8, 6].every(value => value >= 5)
        ).toBeTrue();

        // Uses every method to check if all array elements are non-negative
        expect(
            [9, 10, 0, 19, -10, 4, -1].every(value => value >= 0)
        ).toBeFalse();

        // Uses some method to check if array contains at least one negative value
        expect(
            [0, 10, 9, 5, 4, 15].some(value => value < 0)
        ).toBeFalse();

        // Uses some method to check if at least one element of array is positive
        expect(
            [-10, -9, -20, -5, -3, 10].some(value => value > 0)
        ).toBeTrue();
    });

    /**
     * Array.find method was introduced in ES6.
     */
    it('illustrates finding the first array item that satisfies a condition', function () {
        function Person(name, surname) {
            this.name = name;
            this.surname = surname;
        }

        let persons = [
            new Person("Mickey", "Mouse"),
            new Person("Tony", "Stark"),
            new Person("Bob", "Redford"),
            new Person("Taylor", "Mouse")
        ];

        // Find the first person with surname Mouse
        let personWithSurnameMouse = persons.find(person => person.surname === "Mouse");
        expect(personWithSurnameMouse.name).toEqual("Mickey");
        expect(personWithSurnameMouse.surname).toEqual("Mouse");

        // Array.find returns undefined if an item can't be found
        let personWithSurnameGates = persons.find(person => person.surname === "Gates");
        expect(personWithSurnameGates).toBeUndefined();
    });

    it('illustrates finding multiple array items that satisfy a condition', function () {
        function Person(name, surname) {
            this.name = name;
            this.surname = surname;
        }

        let persons = [
            new Person("Mickey", "Mouse"),
            new Person("Tony", "Stark"),
            new Person("Bob", "Redford"),
            new Person("Taylor", "Mouse"),
            new Person("Chuck", "Norris"),
            new Person("Charles", "Mouse")
        ];

        let personsWithSurnameMouse = persons.filter(person => person.surname === "Mouse");
        expect(personsWithSurnameMouse.length).toBe(3);
        expect(personsWithSurnameMouse).toEqual([
            new Person("Mickey", "Mouse"),
            new Person("Taylor", "Mouse"),
            new Person("Charles", "Mouse")
        ]);

        // Array.filter returns an empty array if none of the items satisfy the condition
        expect(persons.filter(person => person.surname === "Reeves")).toEqual([]);
    });

    it('illustrates finding array indices', function () {
        let array = ["ABC", "09", "ER", "ABC", "09", "UYT", "BVC", "1AI", "UYT", "BVC", "ER", "ABC"];

        // Find the index of the first array element with value UYT
        expect(array.indexOf("UYT")).toBe(5);

        // Array.indexOf returns -1 if it cannot find the specified item
        expect(array.indexOf("AAAA")).toBe(-1);

        // Find the index of the last array element with value ER
        expect(array.lastIndexOf("ER")).toBe(10);

        // Array.lastIndexOf returns -1 if it cannot find the specified item
        expect(array.lastIndexOf("ERRR")).toBe(-1);

        function Person(name, surname) {
            this.name = name;
            this.surname = surname;
        }

        let persons = [
            new Person("Mickey", "Mouse"),
            new Person("Tony", "Stark"),
            new Person("Bob", "Redford"),
            new Person("Taylor", "Mouse"),
            new Person("Chuck", "Norris"),
            new Person("Charles", "Redford")
        ];

        // Find the index of the first person with surname Redford
        expect(
            persons.findIndex(person => person.surname === "Redford")
        ).toBe(2);

        // Array.findIndex returns -1 if it cannot find the item
        expect(
            persons.findIndex(person => person.surname === "Murphy")
        ).toBe(-1);
    });

    it('illustrates sorting array of numbers in descending order', function () {
        let array = [1, -2, 0, 4, -10, 1, 5, -3];
        array.sort((value1, value2) => value2 - value1);
        expect(array).toEqual([5, 4, 1, 1, 0, -2, -3, -10]);
    });

    it('illustrates sorting array of strings lexicographically', function () {
        let array = ["abcd", "yuyuz", "01a", "0", "AAAA", "aaaa", "pPpP", "PpPp"];

        // Sort array lexicographically
        array.sort((str1, str2) => {
            if (str1 < str2) {
                return -1;
            }
            else if (str1 > str2) {
                return 1;
            }

            return 0;
        });

        expect(array).toEqual([
            "0", "01a", "AAAA", "PpPp", "aaaa", "abcd", "pPpP", "yuyuz"
        ]);
    });

    it('illustrates aggregating array items with reduce method', function () {
        let array = [1, -2, 0, 4, -10, 1, 5, -3];

        // Sum the array items with Array.reduce method. The second argument of the
        // reduce method is the initial value.
        expect(
            array.reduce((aggregated, value) => aggregated + value, 0)
        ).toBe(-4);
    });

    it('illustrates simulating array-like methods in custom objects', function () {
        function Person(name, surname) {
            this.name = name;
            this.surname = surname;
        }

        function PersonCollection() {
            // The initial length of the collection. It is important to define
            // the length property, because Array methods expect that such a
            // property exists in the function context (as it should because
            // the context is supposed to be an array instance)
            this.length = 0;

            // Adds new person to the collection
            this.add = (person) => {
                // Invoke the push method from the Array prototype. This call
                // will create a numbered property on 'this' object and increment
                // the length property. Note that we specify 'this' object as the
                // function context of the push method.
                Array.prototype.push.call(this, person);
            };

            // Finds the first person in the collection with the specified surname.
            // Returns undefined if such person doesn't exist.
            this.findBySurname = (surname) => {
                // Use the find method of the Array prototype
                return Array.prototype.find.call(this, person => person.surname === surname);
            };

            // Removes the first person in the collection with the specified surname.
            // The method returns the removed person or undefined if the person with
            // specified surname wasn't found.
            this.removeBySurname = (surname) => {
                // Find the index of the person with the given surname
                let index = Array.prototype.findIndex.call(this, person => person.surname === surname);

                // If such person exists (index isn't -1), splice the item from the array
                if (index != -1) {
                    var removedPerson = Array.prototype.splice.call(this, index, 1)[0];
                }

                return removedPerson;
            };
        }

        let personCollection = new PersonCollection();
        personCollection.add(new Person("Mickey", "Mouse"));
        personCollection.add(new Person("Tony", "Stark"));
        personCollection.add(new Person("Bob", "Marley"));
        personCollection.add(new Person("Johnny", "Cash"));
        personCollection.add(new Person("Charles", "Redford"));

        // Check the length of the collection
        expect(personCollection.length).toBe(5);

        // Find the person by their surname
        expect(personCollection.findBySurname("Redford").name).toEqual("Charles");

        // Remove persons by their surname
        expect(personCollection.removeBySurname("Marley").name).toEqual("Bob");
        expect(personCollection.removeBySurname("Stark").name).toEqual("Tony");
        expect(personCollection.removeBySurname("Mouse").name).toEqual("Mickey");
        expect(personCollection.removeBySurname("Redford").name).toEqual("Charles");
        expect(personCollection.length).toBe(1);
        expect(personCollection[0]).toEqual(new Person("Johnny", "Cash"));
    });
});