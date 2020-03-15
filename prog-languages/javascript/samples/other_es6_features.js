/**
 * Illustrate ES6 features not covered by other samples.
 */
describe("Other ES6 Features", function () {
    it('illustrates concatenation using template literals', function () {
        const person = {
            name: "Mickey",
            surname: "Mouse"
        };

        // Forming a formatted string: "Name: Mickey, Surname: Mouse"
        // using pre-ES6 looks like this:
        let formattedStr = "Name: " + person.name + ", Surname: " + person.surname;

        // Template literals are special type of string that can contain
        // placeholders ${} that can contain any JavaScript expression.
        // When a template literal is evaluated, the placeholders are
        // replaced with the result of JavaScript expression contained in
        // those placeholders.
        let templateStr = `Name: ${person.name}, Surname: ${person.surname}`;

        expect(formattedStr).toEqual(templateStr);
    });

    it('illustrate multiline template literals', function () {
        // Unlike classic JavaScript strings, template literals can span
        // multiple lines. Note how the leading whitespace to the second
        // and third line has been removed. Otherwise, it becomes part
        // of the template string.
        let multilineStr =
            `First line
Second line
Third line`;

        expect(multilineStr).toEqual("First line\nSecond line\nThird line");
    });

    it('illustrates destructing objects', function () {
        const person = {
            name: "Mickey",
            surname: "Mouse",
            age: 35
        };

        // Extracting fields of the `person` object into variables would
        // look like this in pre-ES6 code:
        const name1 = person.name;
        const surname1 = person.surname;
        const age1 = person.age;

        // With ES6 destructing, we can easily specify which properties to
        // extract from an object. For instance, the following will extract
        // `name`, `surname` and `age` from the `person` object and assign
        // then two three variables for the same name
        const { name, surname, age } = person;

        expect(name).toEqual(name1);
        expect(surname).toEqual(surname1);
        expect(age).toEqual(age1);

        // It is also possible to explicitly specify the names for the
        // variables if original property names are not suitable. The
        // following extracts the `name` property to variable `firstName`
        // and `surname` property to variable `lastName`
        const { name: firstName, surname: lastName } = person;

        expect(firstName).toEqual(name1);
        expect(lastName).toEqual(surname1);
    });

    it('illustrates destructing arrays', function () {
        const names = ["Mickey", "Tony", "Robert", "Charlie"];

        // Extract first three array items into variables
        const [firstName, secondName, thirdName] = names;
        expect(firstName).toEqual(names[0]);
        expect(secondName).toEqual(names[1]);
        expect(thirdName).toEqual(names[2]);

        // Skip first three array items and extract the fourth item
        const [, , , fourthName] = names;
        expect(fourthName).toEqual(names[3]);

        // Extract the first array item into a variable and capture
        // the remaining items into another array
        const [firstItem, ...remainingItems] = names;
        expect(firstItem).toEqual(names[0]);
        expect(remainingItems).toEqual([names[1], names[2], names[3]]);
    });

    it('illustrate enhanced object literals', function () {
        const name = "Mickey";
        const surname = "Mouse";

        // The following defines a person object with name and surname
        // properties whose value is set according to the value of the
        // variables with the same name in current scope. Additionally,
        // the objects has the getters for these properties as well
        // a property with a dynamic name which cannot be created as
        // part of object literal in pre-ES6 JavaScript.
        const preES6Person = {
            name: name,
            surname: surname,

            getName: function() {
                return this.name;
            },

            getSurname: function () {
                return this.surname;
            }
        };

        // Define the property with dynamic name
        preES6Person["ageOf" + name + surname] = 35;

        expect(preES6Person.getName()).toEqual("Mickey");
        expect(preES6Person.getSurname()).toEqual("Mouse");
        expect(preES6Person.ageOfMickeyMouse).toEqual(35);

        // The following defines the equivalent person object using ES6
        // enhanced object literals. When defines properties whose value
        // is to be taken from in-scope variables of the same name we
        // don't need to specify the property value. When defining
        // object methods, we can use the simplified syntax `method() {}`
        // instead of `method: function() {}`. Finally, properties with
        // dynamic name can now be defined within the object literal
        // using the `[dynamicPropName]: value` syntax.
        const es6Person = {
            name,
            surname,

            getName() {
                return this.name;
            },

            getSurname() {
                return this.surname;
            },

            ["ageOf" + name + surname]: 40
        };

        expect(es6Person.getName()).toEqual("Mickey");
        expect(es6Person.getSurname()).toEqual("Mouse");
        expect(es6Person.ageOfMickeyMouse).toEqual(40);
    });
});