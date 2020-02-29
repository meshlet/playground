/**
 * Illustrates the JavaScript classes introduced in ES6.
 */
describe("ES6 Classes", function () {
    it('illustrates how to create ES6 class', function () {
        class Person {
            constructor(name, surname) {
                this.name = name;
                this.surname = surname;
            }

            getFullName() {
                return this.name + " " + this.surname;
            }

            setFullName(name, surname) {
                this.name = name;
                this.surname = surname;
            }
        }

        let person = new Person("Peter", "Pan");
        expect(person instanceof Person).toBeTrue();
        expect(person.getFullName()).toEqual("Peter Pan");

        person.setFullName("Tony", "Stark");
        expect(person.getFullName()).toEqual("Tony Stark");
    });

    it('illustrates static class methods', function () {
        class Person {
            constructor(name, age) {
                this.name = name;
                this.age = age;
            }

            setName(name) {
                this.name = name;
            }

            setAge(age) {
                this.age = age;
            }

            static compareByAge(person1, person2) {
                return person1.age - person2.age;
            }
        }

        let person1 = new Person("Mickey Mouse", 43);
        let person2 = new Person("Albert Hardy", 30);

        // Instances don't have access to static methods
        expect("compareByAge" in person1).toBeFalse();
        expect("compareByAge" in person2).toBeFalse();

        // Class has access to static methods
        expect(Person.compareByAge(person1, person2)).toBeGreaterThan(0);

        // Class has no access to regular methods
        expect("setName" in Person).toBeFalse();
        expect("setAge" in Person).toBeFalse();
    });

    it('implementing inheritance', function () {
        // Base class
        class Person {
            constructor(name, surname) {
                this.name = name;
                this.surname = surname;
            }

            setFullName(fullName) {
                [this.name, this.surname] = fullName.split(" ");
            }

            getFullName() {
                return this.name + " " + this.surname;
            }
        }

        // Derived class
        class Employee extends Person{
            constructor(name, surname, company) {
                super(name, surname);
                this.company = company;
            }

            setCompany(company) {
                this.company = company;
            }

            getCompany() {
                return this.company;
            }
        }

        // Create a few Employee instances
        let employee1 = new Employee("Mickey", "Mouse", "Disney");
        let employee2 = new Employee("Tony", "Stark", "Stark Industries");

        // Assert that instanceof operator work as expected
        expect(employee1 instanceof Employee).toBeTrue();
        expect(employee2 instanceof Employee).toBeTrue();
        expect(employee1 instanceof Person).toBeTrue();
        expect(employee2 instanceof Person).toBeTrue();

        // Employee instances can access both Employee and Person properties
        expect(employee1.getFullName()).toEqual("Mickey Mouse");
        expect(employee1.getCompany()).toEqual("Disney");
        expect(employee2.getFullName()).toEqual("Tony Stark");
        expect(employee2.getCompany()).toEqual("Stark Industries");

        // Modifying Person properties of one Employee instance does not affect
        // Person properties of other instances
        employee1.setFullName("Mike Hardy");
        employee2.setFullName("Tom Egan");
        expect(employee1.getFullName()).toEqual("Mike Hardy");
        expect(employee2.getFullName()).toEqual("Tom Egan");
    });
});