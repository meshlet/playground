/**
 * Illustrates JavaScript maps introduced in ES6.
 */
describe("Maps", function () {
    function Person(name, surname) {
        this.name = name;
        this.surname = surname;
    }

    it('illustrates why objects should not be used as maps', function () {
        let map = {
            a: 0,
            b: 1,
            c: 2
        };

        // When accessing an unknown key of a map, expected result would
        // be for map to return undefined as its doesn't know how to map
        // the given key. However, objects have access to properties that
        // weren't explicitly defined via their prototype. 'constructor'
        // is one of those properties.
        expect(map.constructor).not.toBeUndefined();

        // Another issue is that in plain JavaScript objects all keys are
        // stored as strings. If given key is not a string it is converted
        // to one when mapping is created. Consider the following example
        // in which HTML div elements are used as keys.
        function createDiv(id) {
            let divElement = document.createElement("div");
            divElement.id = id;
            return divElement;
        }

        let div1 = createDiv("firstDiv");
        let div2 = createDiv("secondDiv");

        let divMap = {};

        // Insert mapping for the first div
        divMap[div1] = { data: "firstDiv" };
        expect(divMap[div1].data).toEqual("firstDiv");

        // Insert mapping for the second div
        divMap[div2] = { data: "secondDiv" };
        expect(divMap[div2].data).toEqual("secondDiv");

        // But, the second mapping has overwritten the first one because
        // div elements are cast to a string to create the key, and div's
        // toString method returns the same string for all div elements.
        expect(divMap[div1].data).toEqual("secondDiv");
        expect(div1.toString()).toEqual(div2.toString());
    });

    it('illustrates creating maps', function () {
        let person1 = new Person("Mickey", "Mouse");
        let person2 = new Person("Tony", "Stark");
        let person3 = new Person("Bob", "Redford");

        // Add person1 and person2 to the map
        let personMap = new Map();
        personMap.set(person1, "person1");
        personMap.set(person2, "person2");

        // The number of keys in the map should be 2
        expect(personMap.size).toBe(2);

        // Get values for person1 and person2 keys
        expect(personMap.get(person1)).toEqual("person1");
        expect(personMap.get(person2)).toEqual("person2");

        // But mapping for person3 is undefined
        expect(personMap.get(person3)).toBeUndefined();

        // Map.has method returns true for person1 and person 2 but false for
        // person3
        expect(personMap.has(person1)).toBeTrue();
        expect(personMap.has(person2)).toBeTrue();
        expect(personMap.has(person3)).toBeFalse();

        // Delete person1 from the map
        personMap.delete(person1);
        expect(personMap.has(person1)).toBeFalse();
        expect(personMap.size).toBe(1);

        // Clear the map
        personMap.clear();
        expect(personMap.size).toBe(0);

        // Map has not mapping for the 'constructor' key (unlike the
        // objects serving as a map)
        expect(personMap.get("constructor")).toBeUndefined();
    });

    it('illustrates that key equality is based on object equality', function () {
        // Create two persons with same name and surname
        let person1 = new Person("Mickey", "Mouse");
        let person2 = new Person("Mickey", "Mouse");

        // Add these persons to the map
        let map = new Map();
        map.set(person1, "person1");
        map.set(person2, "person2");

        // The map has two mappings, one for each person
        expect(map.size).toBe(2);
        expect(map.get(person1)).toEqual("person1");
        expect(map.get(person2)).toEqual("person2");

        // The reason for this is that JavaScript considers each two object
        // instances different (and it's impossible to override the equality
        // operator)
        expect(person1 == person2).toBeFalse();
    });

    it('illustrates iterating over maps wit for-of loop', function () {
        // Create several persons
        let persons = [
            new Person("Mickey", "Mouse"),
            new Person("Tony", "Stark"),
            new Person("Bob", "Redford"),
            new Person("Tom", "Egan")
        ];

        // Map these persons to their full name
        let personMap = new Map();
        for (let person of persons) {
            personMap.set(person, person.name + " " + person.surname);
        }

        expect(personMap.size).toBe(4);

        // Iterate over mappings and make sure they are visited in order of
        // their insertion
        let i = 0;
        for (let personMapping of personMap) {
            expect(personMapping[0] == persons[i]).toBeTrue();
            expect(personMapping[1]).toEqual(persons[i].name + " " + persons[i].surname);
            ++i;
        }

        // Iterate over keys
        i = 0;
        for (let key of personMap.keys()) {
            expect(key == persons[i]).toBeTrue();
            ++i;
        }

        // Iterate over values
        i = 0;
        for (let value of personMap.values()) {
            expect(value).toEqual(persons[i].name + " " + persons[i].surname)
            ++i;
        }
    });
});