(function count(counter) {
    postMessage(counter);
    setTimeout(count, 500, counter + 1);
})(0);