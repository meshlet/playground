/**
 * An ES6 module.
 */
let name = "Mickey";
let surname = "Mouse";

// Module symbols can be exported by prepending the 'export'
// keyword in front of their definition
export function getFullName() {
    return name + " " + surname;
}

function setFullName(value) {
    [name, surname] = value.split(" ");
}

// Symbols can also be exported by listing them in the 'export'
// block
export { setFullName };