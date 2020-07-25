/**
 * Illustrates TypeScript classes and interfaces.
 */

import "mocha";

describe("Classes and Interfaces", function () {
    it('illustrates defining class properties', function () {
        class Person1 {
            // When access modifiers are used on constructor parameters,
            // the properties with indicated access scopes are added to
            // the class
            constructor(
                private name: string,
                protected surname: string,
                public age: number
            ) {
                // Class has `private name`, `protected surname` and
                // `public age` properties
            }
        }

        class Person2 {
            // Properties can also be defined at class scope. Note that such
            // properties must be either immediately initialized or assigned
            // in the constructor
            private name: string;
            protected  surname: string = "Mouse";
            public age: number;

            constructor(
                name: string,
                age: number
            ) {
                this.name = name;
                this.age = age;
            }
        }
    });

    it('illustrates access modifiers', function () {
        class Person {
            constructor(
                private name: string,
                protected surname: string,
                public age: number
            ) {
            }
        }

        class Employee extends Person {
            // Access modifiers must not be repeated in the extended class
            constructor(
                name: string,
                surname: string,
                age: number,
                private employeeId: string
            ) {
                super(name, surname, age);
            }

            // Access modifiers apply to methods too
            private somePrivateMethod(): void {}
        }
    });

    it('illustrates abstract classes and methods', function () {
        abstract class Person {
            constructor(
                private name: string,
                protected surname: string,
                public age: number
            ) {
            }

            // Abstract class can define methods
            setName(name: string): void {
                this.name = name;
            }

            // Declare an abstract method to force implementations to define it
            abstract someMethod(param1: number, param2: string): number
        }

        // let p = new Person("Mickey", "Mouse", 23); // Illegal

        class Employee extends Person {
            constructor(
                name: string,
                surname: string,
                age: number,
                private employeeId: string
            ) {
                super(name, surname, age);
            }

            someMethod(param1: number, param2: string): number {
                return param1 + Number.parseInt(param2);
            }
        }
    });

    it('illustrates static methods', function () {
        class A {
            static staticMethod(): number {
                return 0;
            }
        }

        A.staticMethod();
    });

    it('illustrates readonly properties', function () {
        class Person {
            public readonly name: string;

            constructor(
                name: string,
                public readonly surname: string
            ) {
                this.name = name;
            }
        }

        let p = new Person("Mickey", "Mouse");
        // p.name = "Tony"; // Readonly
        // p.surname = "Stark"; // Readonly
    });

    it('illustrates using `this` as a Return Type', function () {
        class Set {
            private data: number[] = [];

            // The following method's return type is the class type itself
            add(value: number): this {
                this.data.push(value);
                return this;
            }
        }

        // The extended class' add method's return type is the extended
        // class
        class MultiSet extends Set {
            someMethod(): void {}
        }

        const set = new Set();
        const mSet = new MultiSet();

        // MultiSet.add method returns an instance of MultiSet
        mSet.add(32).someMethod();
    });

    it('illustrates interfaces with regards to type aliases', function () {
        type FoodT = {
            calories: number
            tasty: boolean
        };

        type SushiT = FoodT & {
            salty: boolean
        };

        type CakeT = FoodT & {
            sweet: boolean
        };

        // Identical hierarchy can be achieved with interfaces
        interface FoodI {
            calories: number,
            tasty: number
        }

        interface SushiI extends FoodI{
            salty: boolean
        }

        interface CakeI extends FoodI{
            sweet: boolean
        }
    });

    it('illustrates inheritance wit interfaces', function () {
        type FoodT = {
            calories: number
            tasty: boolean
        };

        class FoodC {
            calories: number = 0;
            tasty: boolean = true;
        }

        interface FoodI {
            calories: number
            tasty: boolean
        }

        // Interface can inherit an object type
        interface Sushi extends FoodT {}

        // Interface can inherit a class
        interface Cake extends FoodC {}

        // Interface can inherit another interface
        interface Fruit extends FoodI {}
    });

    it('illustrates differences between interfaces and type aliases', function () {
        // The following type aliases cannot be expressed as interfaces
        type NumericT = number;
        type NumericOrStringT = NumericT | string;

        // TypeScript makes sure that the interface that we're extending is assignable
        // to the extending interface
        interface A {
            good(x: number): string
            bad(x: number): string
        }

        interface B extends A {
            good(x: number | string): string

            // The following won't compile because of the mismatch in the
            // signature between A.bad and B.bad method types
            // bad(x: string): string
        }

        // Such check is not performed with type aliases
        type T1 = {
            good(x: number): string
            bad(x: number): string
        };

        // The following compiles fine and T2 will have two `bad` method overloads
        type T2 = T1 & {
            good(x: number | string): string
            bad(x: string): string
        }

        // The third difference is that declaration merging applies to interfaces
        // but does not apply to type aliases. TypeScript will merge the following
        // User declarations together
        interface User {
            name: string;
        }

        interface User {
            age: number
        }

        let u: User = {
            name: "Mickey Mouse",
            age: 34
        };

        // Merging won't happen with type aliases - instead a compilation error
        // is raised
        type UserI = {
            name: string
        };

        // Illegal
        // type UserI = {
        //     age: number
        // };
    });

    it('illustrates implementing an interface', function () {
        interface Animal {
            readonly name: string;

            eat(food: string): void
            sleep(hours: number): void
        }

        interface Feline {
            meow(): void
        }

        // The following class implements both interfaces
        class Cat implements Animal, Feline {
            name = "Garfield";

            eat(food: string): void {}
            sleep(hours: number): void {}
            meow(): void {}
        }
    });

    it('illustrates that classes are structurally typed', function () {
        class Horse {
            run(): void {}
        }

        class Donkey {
            run(): void {}
        }

        // The following function accepts a Horse instance
        function runAround(animal: Horse): void {
            animal.run();
        }

        // However, function will happily accept a Donkey instance, because
        // an instance of Donkey is assignable to instance of Horse. In other
        // words, classes are structurally instead of nominally typed in TypeScript.
        runAround(new Horse());
        runAround(new Donkey());

        // It also accepts a plain old object
        runAround({
            run(): void {}
        });

        // Things change if class has private or protected fields
        class A {
            private x = 1;
        }
        class B extends A {}
        function fun(a: A): void {}

        // `fun` will accept instances of A and of classes extending A
        fun(new A());
        fun(new B());

        // But won't accept unrelated classes even they completely match A
        class C {
            private x = 1;
        }
        // fun(new C()); // Illegal

        // Also won't accept plain old objects
        // fun({ x: 1 }); // Illegal
    });

    it('illustrates using generics with classes and interfaces', function () {
        interface MapInterface<K, V> {
            get(key: K): V | null
            set(key: K, value: V): void
            merge<K2, V2>(other: MapInterface<K2, V2>): MapInterface<K | K2, V | V2>
        }

        class MyMap<K, V> implements MapInterface<K, V> {
            get(key: K): V | null {
                return null;
            }
            set(key: K, value: V): void {}
            merge<K2, V2>(other: MapInterface<K2, V2>): MapInterface<K | K2, V | V2> {
                return other;
            }

            static of<K, V>(key: K, value: V): MapInterface<K, V> {
                return new MyMap<K, V>();
            }
        }
    });

    it('illustrates simulating Mixins in TypeScript', function () {
        // The following is a constructor type alias. Only class constructor
        // is assignable to an instance of this type
        type ClassConstructor<T> = new(...args: any[]) => T;

        // Mixin is a function that takes class constructor as an argument
        // and returns another constructor that generally adds some functionality.
        // For example, the following mixin extends the constructor passed in
        // with the debug method
        function debugMixin<C extends ClassConstructor<
                // The class of the passed constructor must at least implement the
                // `getDebugValue` method
                {
                    getDebugValue(): object
                }>
            >(Class: C) {
            // Return an anonymous class that extends the passed constructor
            return class extends Class {
                // We can omit this constructor as it doesn't do anything but
                // call super
                constructor(...args: any[]) {
                    super(...args);
                }

                // The debug method
                debug() {
                    const className = Class.constructor.name;

                    // We are sure that passed in constructor has the `getDebugValue`
                    // method
                    const dbgValue = this.getDebugValue();

                    return className + "(" + JSON.stringify(dbgValue) + ")";
                }
            }
        }

        // And here how to use this mixin
        class MyClass {
            getDebugValue() {
                return {
                    value: "ABC"
                };
            }
        }

        let MyClassDebuggable = debugMixin(MyClass);
        let instance = new MyClassDebuggable();
        instance.debug();
    });

    it('illustrates simulating final classes in TypeScript', function () {
        // Final class can be simulated using private constructor. This
        // prevents extending the class but it also prevents creating
        // instances of that class. This can be worked around by using
        // static create method
        class FinalClass {
            private constructor(
                private field1: number,
                private field2: number
            ) {}

            static create(field1: number, field2: number) {
                return new FinalClass(field1, field2);
            }
        }

        // class ExtendedClass extends FinalClass {} // Illegal
        // let obj: FinalClass = new FinalClass(23, 10); // Illegal
        let obj = FinalClass.create(23, 10);
    });

    it('illustrates implementing factory pattern in TypeScript', function () {
        interface Shoe {
            purpose: string
        }

        class BalletFlat implements Shoe {
            purpose = "dancing";
        }

        class Boot implements Shoe {
            purpose = "woodcutting";
        }

        class Sneaker implements Shoe {
            purpose = "walking";
        }

        // The factory creates concrete shoe type depending on the string
        // argument
        let Shoe = {
            create(type: "balletFlat" | "boot" | "sneaker"): Shoe {
                switch (type) {
                    case "balletFlat": return new BalletFlat();
                    case "boot": return new Boot();
                    case "sneaker": return new Sneaker();
                }
            }
        };

        // And it's used like this
        Shoe.create("balletFlat");
        Shoe.create("boot");
        // Shoe.create("abc"); // Illegal, incompatible argument
    });

    // TODO: improve builder pattern in following ways:
    //  a) Guarantee at compile time that someone can’t call .send before setting at
    //     least a URL and a method. Would it be easier to make this guarantee if you
    //     also force the user to call methods in a specific order? (Hint: what can
    //     you return instead of this?)
    //  b) How would you change your design if you wanted to make this guarantee, but
    //     still let people call methods in any order? (Hint: what TypeScript feature
    //     can you use to make each method’s return type “add” to the this type after
    //     each method call?)
    it('illustrates implementing builder pattern in TypeScript', function () {
        class RequestBuilder {
            private data: object | null = null;
            private method: "get" | "post" | null = null;
            private url: string | null = null;

            setMethod(method: "get" | "post"): this {
                this.method = method;
                return this;
            }

            setData(data: object): this {
                this.data = data;
                return this;
            }

            setUrl(url: string): this {
                this.url = url;
                return this;
            }

            send(){
                // Sends the request
            }
        }
    });
});