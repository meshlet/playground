/**
 * Illustrates TypeScript functions.
 */

import "mocha";
import { expect } from "chai";

describe("Functions", function () {
    it('illustrates annotating function parameters and return type', function () {
        function sum(a: number, b: number): number {
            return a + b;
            // return "abc"; // Returning anything but a number is illegal
        }

        expect(sum(5, 4)).to.equal(9);
        // let s1: string = sum(20, 2); // Can't assign number to string
        // let s2 = sum(20, "abc"); // Can't assign "abc" to numeric parameter `b`
    });

    it('illustrates different ways of defining a function', function () {
        // Named function
        function fun1(name: string) {
            return "hello " + name;
        }

        // Function expression
        let fun2 = function (name: string) {
            return "hello " + name;
        };

        // Array function expression
        let fun3 = (name: string) => {
            return "hello " + name;
        };

        // Shorthand arrow function expression (one liner function)
        let fun4 = (name: string) => "hello " + name;

        // Function constructor (should be avoided)
        let fun5 = new Function("name", "return 'hello ' + name");

        expect(fun1("Mickey")).to.equal("hello Mickey");
        expect(fun2("Mickey")).to.equal("hello Mickey");
        expect(fun3("Mickey")).to.equal("hello Mickey");
        expect(fun4("Mickey")).to.equal("hello Mickey");
        expect(fun5("Mickey")).to.equal("hello Mickey");
    });

    it('illustrates optional parameters', function () {
        function fun1(p1: number, p2?: string) {
            return p1.toString() + (p2 || "");
        }

        // Optional parameters must appear at the end of the parameter list
        // function fun2(p1?: number, p2: string) {} // Illegal

        expect(fun1(123)).to.equal("123");
        expect(fun1(456, "abc")).to.equal("456abc");
    });

    it('illustrates default parameters', function () {
        // Note that `p2` is not explicitly typed. TypeScript will infer
        // that its type is string from the default value
        function fun1(p1: number, p2 = "") {
            return p1.toString() + p2;
        }
        expect(fun1(123)).to.equal("123");
        expect(fun1(456, "abc")).to.equal("456abc");

        // Default parameters don't have to appear at the end of the parameter
        // list. However, note that the order of parameters in the following
        // function means that caller always has to provided an argument for
        // `p1` even though it has a default value. This is because `p2` has
        // no default value so it requires an argument
        function fun2(p1 = "ABC", p2: number) {
            return p1 + p2.toString();
        }
        // fun2(); // Argument for `p2` is missing
        expect(fun2("abc", 45)).to.equal("abc45");

        // It is possible to specify the type of the default parameter if needed
        type MyType = {
            prop1?: number,
            prop2?: string
        };

        // TypeScript wouldn't be able to deduce that p2 is of MyType type
        // without explicit typing. Because default value is {}, TypeScript
        // would assume that p2 has object type
        function fun3(p1: number, p2: MyType = {}) {}
    });

    it('illustrates rest parameters', function () {
        function sumVariadic(...params: number[]) {
            return params.reduce((total, n) => total + n, 0);
        }
        expect(sumVariadic(1, 2, 3)).to.equal(6);
    });

    it('illustrates call, apply and bind', function () {
        function add(a: number, b:number) {
            return a + b;
        }

        expect(add.apply(null, [2, 4])).to.equal(6);
        expect(add.call(null, 10, 9)).to.equal(19);
        expect(add.bind(null, 2)(20)).to.equal(22);
    });

    it('illustrates how to explicitly type `this` parameter', function () {
        type Pair = {
            a: number,
            b: number
        };

        // `this` must be a Pair
        function sum(this: Pair) {
            return this.a + this.b;
        }

        expect(sum.apply({ a: 10, b: 15 })).to.equal(25);
        // sum(); // `this` must be a Pair
    });

    it('illustrates generator functions', function () {
        function* createFibonacciGenerator() {
            let a = 0;
            let b = 1;

            while (true) {
                yield a;
                [a, b] = [b, a + b];
            }
        }

        const fibGenerator = createFibonacciGenerator();
        expect(fibGenerator.next()).to.deep.equal({value: 0, done: false});
        expect(fibGenerator.next()).to.deep.equal({value: 1, done: false});
        expect(fibGenerator.next()).to.deep.equal({value: 1, done: false});
        expect(fibGenerator.next()).to.deep.equal({value: 2, done: false});
        expect(fibGenerator.next()).to.deep.equal({value: 3, done: false});

        // Generator return type can be explicitly typed
        function* generatorWithExplicitReturnType(): IterableIterator<number> {}
    });

    it('illustrates iterators', function () {
        let numbers = {
            *[Symbol.iterator]() {
                for (let i = 0; i < 10; ++i) {
                    yield i;
                }
            }
        };

        // Iterate over an iterator using for-of loop
        for (let a of numbers){}

        // Spread the iterator
        let allNumbers = [...numbers]; // allNumbers is a number[]
        expect(allNumbers).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

        // Destructure the iterator
        let [zero, one, ...rest] = numbers;
        expect(zero).to.equal(0);
        expect(one).to.equal(1);
        expect(rest).to.deep.equal([2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('illustrates typing functions with call signatures', function () {
        // A call signature for a function that sums to numbers and returns the
        // sum
        type Sum = (a: number, b: number) => number;

        // A call signature with an optional parameter
        type FunWithOptionalParam = (p1: number, p2?: string) => string;

        // A sumVariadic call signature
        type SumVariadic = (...numbers: number[]) => number;

        // Explicitly typing a function defined using a function expression.
        // Note that there's no need to repeat parameter nor function return
        // type. TypeScript will infer that from the set call signature.
        let sumVariadic: SumVariadic = (...numbers) => {
            return numbers.reduce((total, n) => total + n, 0);
        }
    });

    it('illustrates shorthand vs. full call signature', function () {
        type SumShorthand = (a: number, b: number) => number;
        type SumFull = {
            (a: number, b: number): number
        };
    });

    it('illustrates contextual typing', function () {
        function repeatedlyInvokeCallback(
            cb: (index: number) => void,
            invocationCount: number
        ) {
            for (let i = 0; i < invocationCount; ++i) {
                cb(i);
            }
        }

        // When passing a callback to `repeatedlyInvokeCallback`, we don't
        // need to explicitly type callback parameters and return value.
        // TypeScript will infer those from the `repeatedlyInvokeCallback`
        // signature. This is an example of contextual typing
        repeatedlyInvokeCallback(index => index, 4);

        // However, note that this only works if `cb` is defined inline.
        // TypeScript won't allow leaving out the parameter type in `cb`
        // function in the following code, even though we later pass that
        // callback to `repeatedlyInvokeCallback`
        // function cb(index) {
        //     return index;
        // }
        // repeatedlyInvokeCallback(cb, 3);
    });

    it('illustrates overloaded function types', function () {
        // The following call signature has two overloads
        enum ReservationType {
            OneWayTrip,
            RoundTrip
        }

        type ReserveFnType = {
            // This overload is used to book a round-trip
            (from: Date, to: Date, destination: string): ReservationType

            // This overload is used to book a one-way trip
            (from: Date, destination: string): ReservationType
        };

        // ReserveFnType implementation signature must be a combination of two
        // overloaded signatures which is done manually
        let reserve: ReserveFnType = (
            from: Date,
            toOrDestination: Date | string,
            destination?: string) => {

            if (toOrDestination instanceof Date && destination !== undefined) {
                // Book a round trip
                return ReservationType.RoundTrip;
            }
            else {
                // Book a one-way trip
                return ReservationType.OneWayTrip;
            }
        };

        // Book a one-way trip
        expect(
            reserve(new Date(2020, 8, 20), "Tokyo")
        ).to.equal(ReservationType.OneWayTrip);
        // Book a round trip
        expect(
            reserve(
                new Date(2020, 8, 20),
                new Date(2020, 8, 27),
                "New York"
            )
        ).to.equal(ReservationType.RoundTrip);

        // Note that even though the ReserveFnType implementation defines
        // `destination` as an optional parameter, TypeScript won't allow
        // calling `reserve` function with dates for first two parameters
        // but without providing a string for the 3rd argument. The reason
        // is that such an invocation does not match any of the ReserveFnType
        // overloads
        // reserve(
        //     new Date(2020, 8, 20),
        //     new Date(2020, 8, 27)); // Must provide a string for 3rd parameter
    });

    it('illustrates using overloads to implement createElement DOM function', function () {
        // NOTE: not sure how to make this work with function expressions.
        // Don't know how to signal that function expression can have multiple
        // return types.
        type CreateElement = {
            (tag: "a"): HTMLAnchorElement
            (tag: "p"): HTMLParagraphElement
            (tag: string): HTMLElement
        };
        //
        // let createElement1: CreateElement = (tag: string): HTMLElement => {
        //     if (tag === "a") {
        //         return new HTMLAnchorElement();
        //     }
        //     else if (tag === "p") {
        //         return new HTMLParagraphElement();
        //     }
        //     else {
        //         return new HTMLElement();
        //     }
        // };

        // Overloading using function declaration
        function createElement(tag: "a"): HTMLAnchorElement;
        function createElement(tag: "p"): HTMLParagraphElement;
        function createElement(tag: string): HTMLElement {
            if (tag === "a") {
                return new HTMLAnchorElement();
            }
            else if (tag === "p") {
                return new HTMLParagraphElement();
            }
            else {
                return new HTMLElement();
            }
        }
    });

    it('illustrates defining properties in function types', function () {
        // The following call signature means that function has a single
        // string argument, has no return value and has a property `wasCalled`
        type FnType = {
            (param: string): void

            // It function definition below won't compile if this property is
            // mandatory (non-optional)
            wasCalled?: boolean
        }

        // Implement FnType using a function expression
        let fnImpl: FnType = (param: string) => {
            if (fnImpl.wasCalled) {
                return;
            }

            fnImpl.wasCalled = true;
        };
        fnImpl.wasCalled = true;
    });

    it('illustrates generic type parameters', function () {
        // Generic type definition for the filter function
        type Filter = {
            <T>(items: T[], fn: (item: T) => boolean): T[]
        };

        // A function that filters an array using the given callback
        let filter: Filter = (items, fn) => {
            // `result` is initially an any[] array, but it's type will
            // later be refined to T[] because Ts are pushed into it
            let result = [];
            for (let item of items) {
                if (fn(item)) {
                    result.push(item);
                }
            }
            return result;
        };

        // Use filter with numbers, strings and objects
        expect(filter([1, 2, 3, 4, 5],(item) => item < 3 )).to.deep.equal([1, 2]);
        expect(filter(
            ["abc", "", "de", "a", "cb"],
            (item) => item.includes("a"))).to.deep.equal(["abc", "a"]);
        expect(filter([
            {
                name: "Mickey",
                age: 34
            },
            {
                name: "Tony",
                age: 50
            },
            {
                name: "Clark",
                age: 45
            },
            {
                name: "Abby",
                age: 31
            }
        ], (item) => item.age < 40)).to.deep.equal([
            {
                name: "Mickey",
                age: 34
            },
            {
                name: "Abby",
                age: 31
            }
        ])
    });

    it('illustrates where one can declare generics', function () {
        // 1) Full call signature, T scoped to a single signature
        type GenType1 = {
            <T>(param: T): T[]
        };
        // No concrete type is bound to the function definition right below
        let fn1: GenType1 = (param) => {
            let result = [param];
            return result;
        };
        // TypeScript will bind the concrete type only when a function of type
        // GenType is called. Note that each call to `fn1` will get its own
        // binding of T
        expect(fn1("abc")).to.deep.equal(["abc"]); // T is string
        expect(fn1(23)).to.deep.equal([23]); // T is number

        // 2) Full call signature, T scoped to all signatures
        type GenType2<T> = {
            (param: T): T[]
        };
        // Concrete type is bound when GenType2 function is defined
        let fn2: GenType2<string> = (param) => {
            let result = [param];
            return result;
        };
        expect(fn2("abc")).to.deep.equal(["abc"]);

        // 3) Same like 1) but uses shorthand instead of full call signature.
        //    Concrete type bound when function of GetType3 is called. Each
        //    call to the given function will get its own binding of T
        type GenType3 = <T>(param: T) => T[];

        // 4) Same like 2) but uses shorthand instead of full call signature.
        //    Concrete type is bound when GenType4 function is defined
        type GenType4<T> = (param: T) => T[];

        // 5) A named function call signature, T scoped to the signature. The
        //    concrete type is bound when function is called and each call get
        //    its own binding of T
        function fn3<T>(param: T): T[] {
            let result = [param];
            return result;
        }
        expect(fn3("abc")).to.deep.equal(["abc"]); // T is string
        expect(fn3(23)).to.deep.equal([23]); // T is number
    });

    it('illustrates a generic map function', function () {
        function map<T, U>(items: T[], fn: (item: T) => U): U[] {
            let result = [];
            for (let item of items) {
                result.push(fn(item));
            }
            return result;
        }

        expect(map(
            ["2", "34", "12", "-12"],
            (item) => parseInt(item))).to.deep.equal([2, 34, 12, -12]);
    });

    it('illustrates explicitly bounding generic types', function () {
        function map<T, U>(items: T[], fn: (item: T) => U): U[] {
            let result = [];
            for (let item of items) {
                result.push(fn(item));
            }
            return result;
        }

        // Will work because boolean is assignable to boolean | string. TypeScript
        // checks that inferred concrete types match the explicitly specified types
        map<string, boolean | string>(
            ["a", "b", "c"],
            (item) => item === "a"
        );

        // Won't work because boolean can't be assigned to a number
        // map<string, number>(
        //     ["a", "b", "c"],
        //     (item) => item === "a"
        // );
    });

    it('illustrates generic type aliases', function () {
        type MyEvent<T> = {
            target: T,
            eventType: string
        };

        // Types must be explicitly bound when using generic type alias
        let event: MyEvent<string> = {
            target: "HTMLAnchorElement",
            eventType: "click"
        };
        // let event: MyEvent = {
        //     target: new HTMLAnchorElement(),
        //     eventType: "click"
        // }; // Illegal, must explicitly set type for T in MyEvent<T>

        // MyEvent<T> can be used within another generic type alias. Once T
        // is bound to ComplexEvent<T> it is also bound to MyEvent<T>
        type ComplexEvent<T> = {
            event: MyEvent<T>,
            timestamp: Date
        };

        // Generic type aliases can be used as function parameters
        function triggerEvent<T>(event: MyEvent<T>): void {}

        // T is bound to HTMLParagraphElement
        triggerEvent({
            target: "HTMLParagraphElement",
            eventType: "click"
        });
    });

    it('illustrates bounded polymorphism', function () {
        type TreeNode = {
            value: string
        };

        type LeafNode = TreeNode & {
            isLeaf: true
        };

        type InnerNode = TreeNode & {
            children: [TreeNode] | [TreeNode, TreeNode]
        };

        // A function that accepts a TreeNode or on if its descendant types,
        // invokes the callback on node's value and returns a node of the same
        // type as the input node.
        function mapNode<T extends TreeNode>(
            node: T,
            f: (value: string) => string): T {

            return {
                ...node,
                value: f(node.value)
            };
        }

        let node1: TreeNode = { value: "treeNode" };
        let node2: LeafNode = { value: "leafNode", isLeaf: true }
        let node3: InnerNode = {
            value: "innerNode",
            children: [{value: "leftChild"}]
        };
        let node4: InnerNode = {
            value: "innerNode",
            children: [{value: "leftChild"}, {value: "rightChild"}]
        };

        let mappedNode1 = mapNode(node1, (value => value.toUpperCase()));
        let mappedNode2 = mapNode(node2, (value => value.toUpperCase()));
        let mappedNode3 = mapNode(node3, (value => value.toUpperCase()));
        let mappedNode4 = mapNode(node4, (value => value.toUpperCase()));

        // Note that the object returned by mapNode retains its original
        // node type. Hence, if TreeNode is passed in a TreeNode comes out,
        // and the same for LeafNode and InnerNode.
        expect(mappedNode1).to.deep.equal(
            { value: "TREENODE" }
        );
        expect(mappedNode2).to.deep.equal(
            { value: "LEAFNODE", isLeaf: true }
        );
        expect(mappedNode3).to.deep.equal(
            {
                value: "INNERNODE",
                children: [
                    { value: "leftChild" }
                ]
            }
        );
        expect(mappedNode4).to.deep.equal(
            {
                value: "INNERNODE",
                children: [
                    { value: "leftChild" },
                    { value: "rightChild" }
                ]
            }
        );

        // Note that one could write a mapNode function in the following way
        function badMapNode(
            node: TreeNode,
            f: (value: string) => string): TreeNode {

            return {
                ...node,
                value: f(node.value)
            };
        }

        // The problem with this version is that node doesn't preserve its
        // type after mapping. Hence, the function will return TreeNode even
        // if LeafNode or InnerNode is passed in
        // badMapNode(node2, (value => value.toUpperCase())).isLeaf // No isLeaf property
        // badMapNode(node3, (value => value.toUpperCase())).children // No children property
    });

    it('illustrates bounded polymorphism with multiple constraints', function () {
        type Type1 = {
            a: number
        };

        type Type2 = {
            b: string
        };

        // The following function accepts an object whose type is an intersection
        // of Type1 and Type2
        function fn1<T extends Type1 & Type2>(obj: T): T {
            return {
                ...obj
            };
        }
        fn1({ a: 43, b: "65" });
        // fn1({ a: 54 }); // Missing property `b`
        // fn1({ b: "abc" }); // Missing property `a`

        // The following function accepts an object whose type is Type1 or Type2
        // or both
        function fn2<T extends Type1 | Type2>(obj: T): T {
            return {
                ...obj
            };
        }
        fn2({ a: 45 });
        fn2({ b: "ghj" });
        fn2({ a: 20, b: "bnm" });
    });

    it('illustrates using bounded polymorphism with variadic functions', function () {
        // The following is a poor man's implementation of built-in `call` function
        function call<T extends unknown[], R>(
            fn: (...args: T) => R,
            ...args: T
        ): R {
            return fn(...args);
        }

        // A fill function that creates an array of given length filled with
        // given value
        function fill(length: number, value: string): string[] {
            return Array.from({length}, () => value);
        }

        // Use `call` to invoke `fill`
        expect(call(fill, 4, "a")).to.deep.equal(["a", "a", "a", "a"]);
        // call(fill, 4); // Missing argument for `value` param
        // call(fill, 4, "a", "b"); // Too many arguments
    });

    it('illustrates generic type defaults', function () {
        // The MyEvent's generic type element with the default type set
        // to HTMLElement. Also note that the generic type has an upper
        // bound set to HTMLElement to restrict the allowed to types to
        // HTMLElement and its descendants
        type MyEvent<TargetT extends HTMLElement = HTMLElement> = {
            target: TargetT,
            eventType: string
        };

        // Just as with optional parameters in functions, default types must appear
        // after the types which don't have defaults
        type MyEvent2<EventT extends string, TargetT extends HTMLElement = HTMLElement> = {
            target: TargetT,
            eventType: EventT
        };
    });

    it('illustrates `call` that only accepts functions whose 2nd param is string',
        function () {

        // This `call` method accepts only functions with at least 2 parameters,
        // where the second parameters must be a string.
        function call<T extends unknown, U extends unknown[], R>(
            fn: (arg0: T, arg1: string, ...args: U) => R,
            arg0: T, arg1: string, ...args: U
        ): R {
            return fn(arg0, arg1, ...args);
        }

        function fn1(a: number, b: string): void {}
        function fn2(a: number): void {}
        function fn3(a: number, b: number): void {}
        function fn4(a: string, b:string, c:number): void {}
        function fn5(a?: bigint, b?: string): void {}

        call(fn1, 45, "a");
        // call(fn2, 9); // No 2nd argument
        // call(fn3, 56, 3); // 2nd argument is not string
        call(fn4, "ab", "43", 6);
        call(fn5, 34n, "af");
    });

    it('illustrates a simple type-safe assertion library', function () {
        // At the minimum it expects two arguments, but will work with
        // arbitrary number of arguments (>= 2).
        function isEqual<T extends unknown>(arg1: T, arg2: T, ...rest: T[]): boolean {
            // TODO: Such comparison will work only for built-in types
            if (arg1 === arg2) {
                for (let elem of rest) {
                    if (arg1 !== elem) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        }

        expect(isEqual("string", "otherstring")).to.be.false;
        expect(isEqual(true, false)).to.be.false;
        expect(isEqual(54, 54)).to.be.true;
        expect(isEqual(34, 65, 12)).to.be.false;
        expect(isEqual("abc", "abc", "abc")).to.be.true;
        // isEqual(); // At least 2 arguments expected
        // isEqual(23); // At least 2 arguments expected
        // isEqual(23, "afb"); // string not assignable to number
    });
});