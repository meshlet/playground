/**
 * Illustrates advanced features of the TypeScript's type system
 */

import "mocha";

describe("Advanced Types", function () {
    it('illustrates the keying-in operator', function () {
        type ApiResponse = {
            user: {
                userId: string
                friendList: {
                    count: number
                    friends: {
                        name: string
                        surname: string
                    }[]
                }
            }
        };

        // The type of the `friendList` can be obtained by keying-in:
        type FriendList = ApiResponse["user"]["friendList"];

        // The type of a single friend can be similarly obtained. The `number`
        // is used to key-in to an array type
        type Friend = FriendList["friends"][number];
    });

    it('illustrates the key-of operator', function () {
        type ApiResponse = {
            user: {
                userId: string
                friendList: {
                    count: number
                    friends: {
                        name: string
                        surname: string
                    }[]
                }
            }
        };

        // Key-of operator all type object keys as a union of string literal types
        type ResponseKeys = keyof ApiResponse; // 'user'
        type UserKeys = keyof ApiResponse["user"]; // 'userId' | 'friendList'
        type FriendListKeys = keyof ApiResponse["user"]["friendList"]; // 'count' | 'friends'
    });

    it('illustrates implementing type-safe get via key-in and key-of operators', function () {
        // For given object `o` the following getter returns the value of
        // its property `k`. Note that function accepts only keys which are
        // subtypes of a union of string literal types of O's properties
        // and must return a type which is a subtype of given property's type
        function get<O extends object, K extends keyof O>(o: O, k: K): O[K] {
            return o[k];
        }

        // Usage
        const response = {
            user: {
                userId: "mickey",
                friendList: {
                    count: 2,
                    friends: [
                        {
                            name: "clark",
                            surname: "kent"
                        },
                        {
                            name: "bruce",
                            surname: "wayne"
                        }
                    ]
                }
            }
        };

        const user = get(response, "user");
        // get(response, "userr"); // response has no `userr` property
        get(user, "userId");
        get(user, "friendList");
        // get(user, "friends"); // user has no `friends` property
    });

    it('illustrates the record type', function () {
        type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";
        type Day = Weekday | "Sat" | "Sun";

        // Record can be used to map a set of keys (which can be strings, numbers
        // or symbols) to some values, with constraint that all keys must be
        // mapped
        const nextDayMap: Record<Weekday, Day> = {
            // Removing any of the mappings will cause a compilation error. TypeScript
            // will complain that some of the keys don't have mapping
            Mon: "Tue",
            Tue: "Wed",
            Wed: "Thu",
            Thu: "Fri",
            Fri: "Sat"
        };
    });

    it('illustrates mapped types', function () {
        type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";
        type Day = Weekday | "Sat" | "Sun";

        // `nextDayMap` is an object with key for each Weekday whose value is a Day:
        const nextDayMap: {[K in Weekday]: Day} = {
            // Removing any of the mappings will cause a compilation error. TypeScript
            // will complain that some of the keys don't have mapping
            Mon: "Tue",
            Tue: "Wed",
            Wed: "Thu",
            Thu: "Fri",
            Fri: "Sat"
        };
    });

    it('illustrates various usages of mapped types', function () {
        type Account = {
            id: number
            isEmplyee: boolean,
            notes: string[]
        };

        // Create another account type where all fields are optional
        type OptionalAccount = {
            [K in keyof Account]?: Account[K]
        };

        // Create another account type where all fields are readonly
        type ReadonlyAccount = {
            readonly [K in keyof Account]: Account[K]
        };

        // Create another account type where all fields accept null values
        type NullableAccount = {
            [K in keyof Account]: Account[K] | null
        };

        // Reverse ReadonlyAccount to make all fields writable again
        type WritableAccount = {
            -readonly [K in keyof ReadonlyAccount]: ReadonlyAccount[K]
        };

        // Reverse OptionalAccount to make all fields required again
        type RequiredAccount = {
            [K in keyof OptionalAccount]-?: OptionalAccount[]
        };
    });

    it('illustrates companion object pattern', function () {
        // TypeScript places types and values in to separate namespaces.
        // Hence, there can be a type and a value with the same name in
        // the same scope. This allows us to assign the same name to a
        // type and a related value (object). This is basically the
        // companion object pattern. For example, the following defines
        // the `Currency` type
        type Currency = {
            unit: "EUR" | "USD" | "GBP" | "JPY",
            value: number
        };

        // And here's the value
        // @ts-ignore
        const Currency = {
            DEFAULT: "USD",
            from(value: number, unit = Currency.DEFAULT): Currency {
                return { value, unit };
            }
        };
    });

    it('illustrates user-defined type guards', function () {
        // Consider the following function that checks if its argument is
        // a string at runtime
        function isString(obj: unknown): boolean {
            return typeof obj === "string";
        }

        // Let's use `isString` in another function
        function doSomething(arg: number | string): void {
            const str: string = "";
            if (isString(arg)) {
                // The following won't compile because even though isString has
                // returned true, TypeScript doesn't know that arg is a string
                // within this scope. That's because type refinement is constrained
                // to the given scope, hence refinement done within `isString`
                // function is lost once its scope is left.
                // str = arg;
            }
        }

        // User-defined type guards can be used to work around this issue. The
        // following signature indicates that function will return true IFF
        // the argument is a string
        function isStringImproved(obj: unknown): obj is string {
            return typeof obj === "string";
        }

        function doSomethingElse(arg: number | string): void {
            let str: string;
            if (isStringImproved(arg)) {
                // This now works because arg has been refined to a string by
                // the `isStringImproved` call
                str = arg;
            }
        }
    });

    it('illustrates conditional types', function () {
        // `isString` is a conditional type that resolves to literal type
        // true if T is a subclass of string, otherwise it resolves to
        // literal type false
        type isString<T> = T extends string
            ? true
            : false;

        type A = isString<string>; // true
        type B = isString<number>; // false
    });

    it('illustrates distributive conditionals', function () {
        // Let's say we have a function takes takes an argument of type T
        // and returns T[]. The return type could be:
        type toArray1<T> = T[];

        // When passing a union type as a template argument to `toArray1`,
        // the resulting type will be an array of entire union. Which means
        // that such an array can store elements that match any type in
        // the union
        type ArrayType1 = toArray1<string | number>; // (string | number)[]
        const array1:ArrayType1 = ["abc", 3, "a", -23];

        // Conditional types allow us to distribute T over each element of
        // the union. I.e. when union type is passed as a template argument
        // to `toArray2`, the return type will be a union of array types of
        // each type in the specified union type
        type toArray2<T> = T extends unknown ? T[] : T[];

        type ArrayType2 = toArray2<string | number>; // string[] | number[]
        // const array2:ArrayType2 = [3, "a"]; // Can't assign (string | number)[] to
                                               // string[] | number[]
        const array3:ArrayType2 = [3, 4, 5];
        const array4:ArrayType2 = ["a", "bc", "d"];
    });

    it('illustrates using conditionals to implement difference of two types', function () {
        // The following distributive conditional will check whether each type in
        // union T is a subclass of each type in union U, and result type will be
        // the union of types from union T which are not a subclass of any types
        // from union U
        type Difference<T, U> = T extends U ? never : T;

        type A = Difference<boolean | string | number, boolean | number>; // A is a string
        const a1:A = "Ac";
        // const a2:A = 3; // can't assign number to a string
        // const a3:A = true; // can't assign boolean to a string
    });

    it('illustrates using conditional types infer keyword', function () {
        // The following conditional returns the type of array's elements
        // or the type that was passed in if it's not an array
        type ElementType1<T> = T extends unknown[] ? T[number] : T;
        type A = ElementType1<number[]>; // A is a number

        // Similar can be accomplished with the infer keyword
        type ElementType2<T> = T extends (infer U)[] ? U : T;
        type B = ElementType2<number[]>; // A is a number

        // infer keyword is more powerfull than that. For example, say we want
        // to find the type of the second parameter of a function that takes
        // exactly two arguments
        type SecondArgType<F> =
            F extends (param1: any, param2: infer T) => any
                ? T
                : never;

        function funWithTwoParams(a:string, b:bigint): void {}
        type bArgType = SecondArgType<typeof funWithTwoParams>;
        const val1:bArgType = 45n;
        // const val2:bArgType = 45; // can't assign number to bigint
    });

    it('illustrates type assertions', function () {
        function doSomething(a: string): void {}
        function doSomethingElse(): string | number {
            return "abc";
        }

        const value = doSomethingElse(); // value is of string | number type
        // doSomething(value); // Can't assign string | number to a string

        // But we can use type assertion to indicate to TypeScript that value
        // is indeed a string. `as` and `<>` syntax are equivalent but `as`
        // is preferred
        doSomething(value as string);
        doSomething(<string>value);
    });

    it('illustrates the non-null assertions', function () {
        // Non-null assertion indicates to the TypeScript that the given
        // value cannot be null | undefined. It does this by basically
        // removing null | undefined from the type.
        type A = string | number | bigint | null | undefined;

        // null and undefined can be assigned to `a`
        let a:A = "abcd";
        a = null;
        a = undefined;

        // Use null assertion operator to constraint `a` to a non-null value
        let b = a!; // b is of type string | number | bigint
        b = 23n;
        b = "dg";
        // b = null; // can't assign null to string | number | bigint
        // b = undefined; // can't assign null to string | number | bigint
    });

    it('illustrates definite assignment non-null assertions', function () {
        // The following code segment illustrates a situation where variable
        // will definitely be assigned before it is used, but TypeScript won't
        // be able to detect it
        // let v1:string;
        // fun1();
        //
        // v1.toUpperCase();
        // function fun1(): void {
        //     v1 = "abc";
        // }

        // Definite assignment assertion can be used to work-around this issue
        let v1!:string;
        fun1();

        v1.toUpperCase();
        function fun1(): void {
            v1 = "abc";
        }
    });

    it('illustrates simulating nominal types with type branding', function () {
        // Say application has several different types of IDs
        type CompanyId = string;
        type OrderId = string;
        type UserId = string;
        type Id = CompanyId | OrderId | UserId;

        // And a function that accepts a UserId
        function fn1(id: UserId) {}

        // Such function will happily accept any value assignable to the string
        const id1: CompanyId = "afe43f";
        fn1(id1);
        fn1("fdfsdfs");

        // This is where nominal types are useful and they can be simulated in
        // TypeScript using type branding. Below are ID types redefined in such
        // a way that makes it impossible to assign a value of wrong type to
        // them by accident. This is because a single value cannot be a string
        // and { readonly brand: unique symbol } at once
        type CompanyIdSafer = string & { readonly brand: unique symbol };
        type OrderIdSafer = string & { readonly brand: unique symbol };
        type UserIdSafer = string & { readonly brand: unique symbol };
        type IdSafer = CompanyIdSafer | OrderIdSafer | UserIdSafer;

        // We also need constructors that will create such branded IDs. Note
        // that type assertion is the only way to cast a string to one of
        // these IDs
        function CompanyIdSafer(id: string) {
            return id as CompanyIdSafer;
        }

        function OrderIdSafer(id: string) {
            return id as OrderIdSafer;
        }

        function UserIdSafer(id: string) {
            return id as UserIdSafer;
        }

        // A function that accepts a UserIdSafer
        function fn2(id: UserIdSafer) {}

        // Only values of UserIdSafer can be passed to this function
        const id2 = CompanyIdSafer("sfdsfe334");
        const id3 = OrderIdSafer("5jk45jk4");
        const id4 = UserIdSafer("5453453534fdsf");
        // fn2(id2); // can't assign CompanyIdSafer to UserIdSafer
        // fn2(id3); // can't assign OrderIdSafer to UserIdSafer
        fn2(id4);
    });
});

/**
 * The following illustrates how to safely extend the prototype of a
 * global object.
 *
 * @note Such protype extension code would be placed in a dedicated
 * .ts file that must be included by any script that wishes to use
 * the new Array prototype method. This can be done by excluding the
 * given .ts file from the project (by placing it in `exclude` scripts).
 * In this way, even there are multiple .ts adding the exact same
 * properties to the global object, the one defined in the imported
 * .ts script will be used.
 */
declare global {
    // Inform TypeScript that we're extending Array's prototype with a
    // new method
    interface Array<T> {
        doSomething(a: number, b?: string): void;
    }
}

// Implement the new method
Array.prototype.doSomething = function<T>(a: number, b?: string) {};