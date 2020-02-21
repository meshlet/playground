/**
 * Sorts the array in descending order.
 *
 * @param array
 */
function sortDescending(array) {
    array.sort(function (value1, value2) {
        return value2 - value1;
    });
}

/**
 * Sorts the array in descending order using an array
 * function to order the elements.
 *
 * @param array
 */
function sortDescendingArrayFunction(array) {
    array.sort((value1, value2) => value2 - value1);
}