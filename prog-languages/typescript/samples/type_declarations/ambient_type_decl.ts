/**
 * This is a type declarations file that declares a TS type available
 * to entire project.
 */

// TODO: figure out why Mocha is having trouble if this file is named
//       with .d.ts extension

// The following declares a type (note that there's no need for declare
// keyword when declaring types and interfaces)
type ToArray<T> = T extends unknown[] ? T : T[];