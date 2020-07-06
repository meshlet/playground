/**
 * Illustrates TypeScript type system and various supported types.
 */

import "mocha";
import { expect } from "chai";

describe("Types", function() {
    it("illustrates explicit typing in TypeScript", function() {
        let num1: number = 100;

        function sqrt(v: number) {
            return v * v;
        }

        sqrt(2);
        // sqrt("a"); // This causes compilation error
    });

    it('illustrates `any` type', function () {
        let v1: any = 4;
        let v2: any = [342];
        let v3 = v1 + v2;
        expect(v3).to.equal("4342");
    });

    it('illustrates `unknown` type', function () {
        let v1: unknown = 30;

        // Comparing unknown variables is legal
        expect(v1 === 120).to.be.false;

        // let num = v1 + 45; // Can't do addition on an uknown type

        // We can add an unknown variable after its type has been refined
        // (i.e. we've let TypeScript know the exact type of the variable
        // using the typeof or instanceof operators)
        if (typeof v1 === "number") {
            expect(v1 + 100).to.equal(130);
        }
    });

    it('illustrates `boolean` type', function () {
        let v1 = true;
        var v2 = false;

        // This creates a type literal that can contain a single value only -
        // a boolean false
        const v3 = false;

        let v4: boolean = true;

        // This also creates a type literal that can contain a single value only -
        // a boolean true
        let v5: true = true;
        // v5 = false; // Not allowed, as v5 is of type 'true'

        // let v6: false = true; // Not allowed, v6 is literal type 'false'
    });

    it('illustrates `number` type', function () {
        let v1 = 1234;
        let v2 = Infinity * 0.3;

        // Type literal
        const v3 = 456;

        let v4: number = 567;

        // More type literals
        let v5: 46.76 = 46.76;
        // let v6: 94 = 94.12; // Not allowed, v6 is a literal type '94'
    });

    it('illustrates numeric separators', function () {
        let v1 = 2_000_000;
        let v2: 4_3 = 43;
        expect(v1).to.equal(2000000);
        expect(v2).to.equal(43)
    });

    it('illustrates `bigint` type', function () {
        let v1 = 9453n;
        let v2 = 654n;
        let v3 = v1 + v2;
        expect(typeof v3).to.equal("bigint");
        // let v4 = 45.5n; // Bigint literal must be an integer
    });

    it('illustrates `symbol` type', function () {
        let s1 = Symbol("symbol1");
        let s2 = Symbol("symbol1");
        expect(s1).to.not.equal(s2);

        // It is legal to assign one symbol to another
        s1 = s2;
        expect(s1).to.equal(s2);

        // Unique symbols can be created to prevent this. The following two
        // definitions are equivalent
        const s3 = Symbol("symbol2");
        const s4: unique symbol = Symbol("symbol3");

        // let s5: unique symbol = Symbol("symbol4"); // Not allowed, s5 must be const
    });

    it('illustrates TypeScript objects', function () {
        let obj1: object = {
            a: 5
        };
        // obj1.a; // Won't work, the fact that obj1 is an object only means that
                   // it is not null and is a JavaScript object. But can't access
                   // its properties
        // Note, however, that obj1 clearly has property `a` at runtime
        expect(obj1.hasOwnProperty("a")).to.be.true;

        // Objects can be defined using object literals
        let obj2 = {
            a: 5
        };
        // Object properties are not accessible
        expect(obj2.a).to.equal(5);

        // Explicitly specifying types of properties
        let obj3: {
            a: number,
            b: string
        } = {
            a: 45, // assigning a non-numeric value to `a` would cause compilation error
            b: "afb"
        };

        // Assigning types explicitly using a class
        class Person {
            constructor(
                // public is a shorthand for this.firstName = firstName
                public firstName: string,
                public lastName: string
            ){}
        }

        let c: {
            firstName: string,
            lastName: string
        } = {
            firstName: "Mickey",
            lastName: "Mouse"
        };
        // TypeScript allows assigning a Person instance to `c` because both
        // have the same object shape (i.e. their properties and their types
        // match
        c = new Person("Tony", "Stark");

        // c = {}; // Not allowed, mismatch between `c` and an object assigned to it
        // c = {
        //     firstName: "Clark",
        //     last_name: "Kent"
        // } // Not allowed, mismatch between `c` and an object assigned to it
    });

    it('illustrates optional object properties', function () {
        // Declare an object (doesn't assign any value to it). The object has
        // numeric property `a` and and optional string property `b`
        let obj: {
            a: number,
            b?: string
        };

        obj = { a: 45 };
        obj = { a: -1, b: undefined };
        obj = { a: 10, b: "abc" };

        // obj = { a: 66, b: 5 }; // Can't assign number to property `b`
    });

    it('illustrates index signatures', function () {
        // Declare an object (doesn't assign any value to it). The object has
        // numeric property `a` and 0 or more properties whose key is a number
        // and value is a boolean
        let obj: {
            a: number,
            [T: number]: boolean
        };

        obj = { a: 45 };
        obj = { a: -1, 10: true };
        obj = { a: 10, 45: false, 0: true };

        // obj = { a: 90, 5: "abc" }; // Can't assign string to boolean property `5`

        // Note that index signature key's type must be a number or a string, so the
        // following won't compile
        // let obj1: {
        //     [T: bigint]: number
        // };
    });

    it('illustrates readonly properties', function () {
        let obj: {
            readonly a: number,
            b: string
        } = {
            a: 55,
            b: "abc"
        };

        // obj.a = 0; // Not allowed, `a` is readonly
    });

    it('illustrates empty object type {}', function () {
        // Declare `obj` as an empty object type
        let obj: {};

        // Almost anything can be assigned to a variable of an empty object type
        obj = 2;
        obj = {};
        obj = { a: 45 };
        obj = Symbol("sym");

        // null and undefined can't be assigned to a variable of an empty object type
        // obj = null;
        // obj = undefined;
    });

    it('illustrates type aliasing', function () {
        type Age = number;
        type Person = {
            name: string,
            surname: string
            age: Age
        };

        // Aliases are never inferred by TypeScript, so they have to be
        // set explicitly
        let age: Age = 45;
        let p: Person = {
            name: "Mickey",
            surname: "Mouse",
            age: 54
        };

        // type Age = number; // Can't define the same type twice

        // Type definitions are scoped
        type MyType = number;
        (function() {
            type MyType = string;
            let str: MyType = "ABCD";
            expect(typeof str).to.equal("string");
        })();
        let num: MyType = 45;
        expect(typeof num).to.equal("number");
    });

    it('illustrates type unions and intersections', function () {
        type FirstType = { prop1: number, prop2: string };
        type SecondType = { prop1: number, prop3: string, prop4: number };

        // Union of FirstType and SecondType
        type FirstSecondTypeUnion = FirstType | SecondType;
        // An object of FirstSecondTypeUnion type can be FirstType, SecondType
        // or both of those
        // FirstType
        let obj1: FirstSecondTypeUnion = {
            prop1: 45,
            prop2: "abcd"
        };
        // SecondType
        obj1 = {
            prop1: 90,
            prop3: "yte",
            prop4: 3
        };
        // Both FirstType and SecondType
        obj1 = {
            prop1: 100,
            prop2: "abcd",
            prop3: "ooo",
            prop4: 10
        };
        // A variable of FirstSecondTypeUnion can't store an object that is neither
        // of FirstType nor SecondType type. The following results in compilation error
        // obj1 = {
        //     prop1: 65,
        //     prop3: "mgh"
        // };

        // Intersection of FirstType and SecondType
        type FirstSecondTypeIntersection = FirstType & SecondType;
        // Variable of FirstSecondTypeIntersection type can store an object with
        // all the properties of FirstType and SecondType
        let obj2: FirstSecondTypeIntersection = {
            prop1: 100,
            prop2: "abcd",
            prop3: "ooo",
            prop4: 10
        };
        // Omitting any properties from either types results in a compilation error.
        // The following is illegal:
        // obj2 = {
        //     prop1: 100,
        //     prop2: "abcd",
        //     prop3: "ooo"
        // };
    });

    it('illustrates TypeScript arrays', function () {
        let arr1 = [1, 2, 3]; // number[]
        let arr2 = ["a", "b"]; // string[]
        let arr3: string[] = ["c", "d"]; // string[]

        // Heterogeneous arrays
        let arr4 = [1, "ab"]; // (number | string)[]
        const arr5 = [2, "po"]; // (number | string)[]

        let arr6 = ["try"];
        arr6.push("abc");
        // arr6.push(45); // Can't push number to a string[] array

        // When an empty array is created without specifying the type explicitly,
        // TypeScript will set the array type to any[]. As items are pushed to
        // the array, it's type is expanded and once array leaves the scope where
        // it was created TypeScript won't allow changing the type anymore
        function buildArray() {
            let arr = []; // any[] at this point
            arr.push(23); // now it's number[]
            arr.push("abc"); // not it's (number | string)[]
            return arr;
        }
        let arr7 = buildArray();
        arr7.push("ere"); // Strings are accepted
        arr7.push(0); // Numbers are accepted
        // arr7.push(true); // Booleans aren't, as array's final type is (number | string)[]

        // Enforce type of an empty array
        let arr8: number[] = [];
        arr8.push(456);
        // arr8.push("A"); // Can't push string to a number[] array

        // Array type can be specified with Array<T> syntax as well
        let arr9: Array<boolean> = [];
        arr9.push(true);
        // arr9.push(56); // Can't push number to a boolean[] array
    });

    it('illustrates TypeScript tuples', function () {
        let tup1: [number] = [1];
        let tup2: [string, string, number] = ["Mickey", "Mouse", 1970];
        // tup2 = ["Moly", "Shannon", "Ab", 1984]; // Can't assign `Ab` to a number

        // Optional tuple elements
        let tup3: [number, string?];
        tup3 = [56];
        tup3 = [56, "ABC"];
        // Optional elements can't be expressed using type unions as well
        let tup4: [number] | [number, string];
        tup4 = [90];
        tup4 = [89, "ABC"];

        // Rest elements
        // A tuple with string as its first element followed by 0 or more
        // number elements
        let tup5: [string, ...number[]];
        tup5 = ["abc"];
        tup5 = ["er", 5, 3, -12];
    });

    it('illustrates immutable arrays and tuples', function () {
        // Immutable array
        let arr: readonly number[] = [4, 5, 6];
        expect(arr[0]).to.equal(4);
        // arr[0] = 34; // Array is readonly
        // arr.push(90); // Readonly arrays don't have push() method

        // Readonly arrays can also be defined using following syntax
        type ImmutableArray1 = ReadonlyArray<string>; // readonly string[]
        type ImmutableArray2 = Readonly<string[]>; // readonly string[]

        // Immutable tuple type can be defined using the following syntax
        type ImmutableTuple1 = readonly [number, string]; // readonly [number, string]
        type ImmutableTuple2 = Readonly<[number, string]>; // readonly [number, string]
    });

    it('illustrates TypeScript enums', function () {
        enum Language {
            English,
            Spanish,
            Bosnian,
            French
        }
        let myFirstLanguage = Language.Bosnian;
        let mySecondLanguage = Language.English;
        // Enum can be accessed as an array, in which case a string representing
        // the given value is returned
        expect(Language[2]).to.equal("Bosnian");

        // Enums can be split across multiple declarations
        enum MyEnum {
            Value1 = 0,
            Value2 = 1,
        }
        enum MyEnum {
            Value3 = 2
        }

        // Computed values can be used for enum values
        enum AnotherEnum {
            Value1 = 100,
            Value2 = 200 + 300,
            Value3 // TypeScript will set this one to 501
        }

        // Using string values for enums
        enum Color {
            Red = "#ff0000",
            Blue = "#0000ff",
            Pink = 0xc10050,
            White = 255
        }
        // The fact that TypeScript allows using array syntax to access enums
        // can cause problems. For instance, Color[6] shouldn't be allowed but
        // TypeScript doesn't complain
        expect(Color[6]).to.be.undefined;

        // Const enums forbid using the array like access syntax
        const enum ConstLanguage {
            Bosnian,
            English,
            Spanish
        }
        // ConstLanguage[0] // Not allowed

        // TypeScript allows any number to be assigned to an enum variable.
        let lang: ConstLanguage = 12;
        // The only way to prevent this is to use strings for every enum value
        enum SafeEnum {
            Value1 = "Value1",
            Value2 = "Value2",
            Value3 = "Value3"
        }
        let v: SafeEnum = SafeEnum.Value1;
        // v = 12; // Illegal
        // v = "Value2"; // Illegal
    });
});