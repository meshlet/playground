/**
 * This is a type declarations file that declares an ambient module available
 * to the entire project.
 */

// TODO: figure out why Mocha is having trouble if this file is named
//       with .d.ts extension

// An ambient module declaration
declare module "ambient_module" {
    export type MyType = number;
    export const VARIABLE = "abcd";
    export type MyDefaultType = { a: number };
    let defaultExport: MyDefaultType;
    export default defaultExport;
}