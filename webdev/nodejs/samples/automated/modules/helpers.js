/**
 * Illustrates exporting multiple functions/objects from a
 * module.
 */

// A helper that sorts array in descending order
exports.sortDescending = array => {
    return array.sort((a, b) => {
        return b - a;
    });
};

exports.config = {
    option1: "ABC"
};