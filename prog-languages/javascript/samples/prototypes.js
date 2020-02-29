/**
 * Illustrates JavaScript prototypes.
 */
describe("Prototypes", function () {
    it('illustrates how properties are accessed through prototype chain', function () {
        // obj1 has property1, obj2 has property2 and obj3 has property3
        let obj1 = {
            property1: "A"
        };
        let obj2 = {
            property2: "B"
        };
        let obj3 = {
            property3: "C"
        };

        // obj1 has no access to properties of obj2 nor obj3
        expect("property1" in obj1).toBeTrue();
        expect("property2" in obj1).toBeFalse();
        expect("property3" in obj1).toBeFalse();

        // Set obj2 to be the prototype of obj1. Now, if obj1 doesn't have the
        // given property, its prototype will be searched.
        Object.setPrototypeOf(obj1, obj2);

        // obj1 now has access to obj2's properties but still has no access to
        // obj3's properties
        expect("property2" in obj1).toBeTrue();
        expect("property3" in obj1).toBeFalse();

        // Set obj3 to be the prototype of obj2. If we access a prototype that
        // doesn't exist in obj2, the search is delegated to obj3. This created
        // a prototype chain obj1 -> obj2 -> obj3, which means that obj1 now
        // has access to obj3's properties too.
        Object.setPrototypeOf(obj2, obj3);

        // Both obj1 (via its prototype obj2) and obj2 have access to obj3's
        // properties.
        expect("property3" in obj1).toBeTrue();
        expect("property3" in obj2).toBeTrue();
    });

    it('illustrates adding properties to constructor prototype', function () {
        // An empty constructor function
        function Constructor() {}

        // Every function has a built-in prototype property that references
        // an object that serves as that function's prototype. Add a new
        // property to that object.
        Constructor.prototype.method = function () {
            return "ABC";
        };

        // Try invoking Constructor as a function. As Constructor has no
        // return statement, its return value must be undefined
        expect(Constructor()).toBeUndefined();

        // Invoke Constructor as a constructor (with the new keyword). This
        // creates a new object that acts as the context. The prototype of
        // this object references the prototype of the constructor itself.
        let instance = new Constructor();
        expect(instance).toBeDefined();
        expect(instance.method).toBeDefined();
        expect(instance.method()).toEqual("ABC");
    });

    it('illustrates instance vs prototype properties precedence', function () {
        function Constructor() {
            // Add an property 'method' to the instance
            this.method = function () {
                return "AAAA";
            };
        }

        // Add the property 'method' to the function's prototype
        Constructor.prototype.method = function() {
            return "BBBB";
        };

        // Instance properties always take precedence over prototype
        // properties. If instance itself contain the given property,
        // the prototype is not consulted at all.
        let instance = new Constructor();
        expect(instance.method()).toEqual("AAAA");
    });

    it('each instance gets copy of properties created in constructor', function () {
        function Constructor() {
            this.instanceMethod = function() {
                return 0;
            };
        }

        Constructor.prototype.prototypeMethod = function() {
            return "A";
        };

        let instance1 = new Constructor();
        let instance2 = new Constructor();
        let instance3 = new Constructor();

        // Each of these instances have different copy of instance properties
        // created in the constructor. If many instances of the given type
        // are created, this property duplication can consume lots of memory.
        expect(instance1.instanceMethod).not.toBe(instance2.instanceMethod);
        expect(instance1.instanceMethod).not.toBe(instance3.instanceMethod);
        expect(instance2.instanceMethod).not.toBe(instance3.instanceMethod);

        // Hover, the prototype properties are shared between all instances
        expect(instance1.prototypeMethod).toBe(instance2.prototypeMethod);
        expect(instance1.prototypeMethod).toBe(instance3.prototypeMethod);
    });

    it('illustrates prototype modifications after creating instances', function () {
        function Constructor() {}

        // Create an instance
        let instance1 = new Constructor();

        // Add a method to Constructor's prototype
        Constructor.prototype.prototypeMethod1 = function() {
            return "AAA";
        };

        // instance1 can access the prototype method even though it was added
        // to the prototype after instance has been created. That's because
        // the instance only references the prototype objects, it doesn't
        // store the copy of it.
        expect(instance1.prototypeMethod1()).toEqual("AAA");

        // Overwrite the Constructor's prototype with an entirely new object
        Constructor.prototype = {
            prototypeMethod2: function () {
                return "BBB";
            }
        };

        // Create another instance
        let instance2 = new Constructor();

        // instance2 has no access to prototypeMethod1 (the old prototype object),
        // but has access to prototypeMethod2 (the new prototype object)
        expect(instance2.prototypeMethod1).toBeUndefined();
        expect(instance2.prototypeMethod2()).toEqual("BBB");

        // instance1 has no access to prototypeMethod2, which is the property of
        // the prototype object. instance1 still points to the old prototype
        // objects
        expect(instance1.prototypeMethod2).toBeUndefined();
    });

    it('illustrates how to find the type of an instance', function () {
        function Constructor1() {}
        function Constructor2() {}

        // Create an instance
        let instance = new Constructor1();

        // typeof operator only tells us that the instance is an object
        expect(typeof instance).toEqual("object");

        // However instanceof operator can tell us whether object was created
        // with a given function
        expect(instance instanceof Constructor1).toBeTrue();
        expect(instance instanceof Constructor2).toBeFalse();

        // We can also use the 'constructor' property of the constructor's
        // prototype to check if instance was created by a given function.
        // As 'constructor' is a property of the constructor function's
        // prototype and all instances have reference to this prototype,
        // each instance can access the 'constructor' property via its
        // prototype.
        expect(instance.constructor).toBe(Constructor1);
    });

    it('create instances using the constructor property', function () {
        function Constructor1() {}

        // Create new instance
        let instance1 = new Constructor1();

        // We can use the 'constructor' property which references Constructor1
        // to create more instances
        let instance2 = new instance1.constructor();

        // instance1 and instance2 are two different objects, but instance2 is
        // also instance of the Constructor
        expect(instance2).not.toBe(instance1);
        expect(instance2 instanceof Constructor1).toBeTrue();
    });

    /**
     * This sample illustrates that even though the prototype object has the property
     * with a given name, if a value is assigned to non-existing property of the instance
     * with the same name a new instance property is created. From then on, this instance
     * property hides the prototype property.
     */
    it('new instance property is created when assigning value to it', function () {
        function Constructor() {}
        Constructor.prototype.aProperty = "ABCD";

        // Create an instance
        let instance = new Constructor();
        expect(instance.aProperty).toEqual("ABCD");

        // Note that 'instance' object doesn't have its own 'aProperty' property
        expect(instance.hasOwnProperty("aProperty")).toBeFalse();

        // Assign a new value to the 'aProperty' of 'instance' object
        instance.aProperty = "FFFF";

        // This assignment has created a new instance property on the 'instance'
        // object. This property now hides the prototype property with the same
        // name.
        expect(instance.hasOwnProperty("aProperty")).toBeTrue();
        expect(instance.aProperty).not.toEqual(Constructor.prototype.aProperty);
    });

    /**
     * The issue with prototype inheritance as illustrates in this example is
     * that each instance of Derived class references the same Base instance
     * as its prototype. If a Base property is modified via one Derived instance
     * all other Derived instances see the change which is unacceptable. The
     * 'improved inheritance with prototypes' example addresses this issue.
     */
    it('attempting inheritance with prototypes', function () {
        // Person constructor
        function Person() {
            let name = "Charles Murphy";

            this.setName = function(new_name) {
                name = new_name;
            };

            this.getName = function() {
                return name;
            };
        }

        // Employee constructor
        function Employee() {

        }

        // We want Employee to be a subclass of Person. The best way to achieve
        // this in JavaScript is by setting the Employee constructor's prototype
        // to point an instance of Person. 'employee instanceof Person' will then
        // return true, as the current Person.prototype is in the prototype chain
        // of each employee. In other words, each Employee instance is a Person.
        Employee.prototype = new Person();

        // Create two Employee instances
        let employee1 = new Employee();
        let employee2 = new Employee();

        // Both employees are instances of both the Employee and Person constructors
        expect(employee1 instanceof Employee).toBeTrue();
        expect(employee1 instanceof Person).toBeTrue();
        expect(employee2 instanceof Employee).toBeTrue();
        expect(employee2 instanceof Person).toBeTrue();

        // The trouble is that both employees have the same Person object
        // as their prototype, hence every employee instance shares the
        // properties of that Person instance. Iff we change the Person
        // property via one employee, all the other employees will see
        // that change.
        employee1.setName("John Doe");
        expect(employee1.getName()).toEqual("John Doe");
        expect(employee2.getName()).toEqual("John Doe");

        // Another problem is that Employee.prototype has been overwritten, and
        // its 'constructor' property no longer refers the Employee constructor.
        // It instead references the Person constructor.
        expect(employee1.constructor).toBe(Person);

        // We can fix this problem by defining a 'constructor' property on
        // the Employee.prototype (which is not a Person). As this object
        // appears before the Person.prototype in the employees prototype
        // chain, any access to the 'constructor' property will access
        // this and not the 'constructor' property of the Person prototype.
        // The new 'constructor' property references the Employee function
        // and is not enumerable (just like the actual 'constructor'
        // property of the default prototype objects).
        Object.defineProperty(Employee, "constructor", {
            enumerable: false,
            value: Employee,
            writable: true
        });

        // We now know that employees are created with the Employee constructor
        expect(employee1.constructor).toBeDefined(Employee);
    });

    /**
     * Each Derived class instance has unique Base instance as its prototype. In
     * this way, modifying Base properties via one Derived instance doesn't affect
     * the other Derived instances.
     */
    xit('improved inheritance with prototypes', function () {

    });
});