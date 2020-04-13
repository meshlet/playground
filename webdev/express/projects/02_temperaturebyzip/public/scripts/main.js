// Attach a listener for the `load` event
window.addEventListener("load", event => {
    // Get the reference to the form element
    const form = document.getElementById("zip_form");

    // Get the reference to the DOM element where ZIP code is entered
    const zipCodeElem = document.getElementById("zip_code");

    // Get the reference to the DOM element where the temperature is shown
    const outputElem = document.getElementById("output");

    // Attach a listener for the `submit` event
    form.addEventListener("submit", event => {
        // Prevent automatic form submission
        event.preventDefault();

        // Create an XML HTTP request instance
        const ajaxReq = new XMLHttpRequest();

        // Attach a listener for the `load` event
        ajaxReq.addEventListener("load", function() {
            try {
                // Convert the received JSON to an object
                const resObj = JSON.parse(this.responseText);

                if (resObj.error) {
                    // Display the error message explaining why the temperature
                    // couldn't be obtained
                    outputElem.innerHTML = resObj.error;
                }
                else {
                    // Display the retrieved temperature
                    outputElem.innerHTML =
                        `It is ${resObj.temperature} &#176;C in ${resObj.zipcode} ZIP code area`;
                }
            }
            catch (err) {
                outputElem.innerHTML = "Data received from the server is corrupted.";
            }
        });

        // Attach a listener for the `error` event
        ajaxReq.addEventListener("error", function () {
            // Display an error message
            outputElem.innerHTML = "Couldn't retrieve temperature measurement due to error.";
        });

        // Open the connection and send the request
        ajaxReq.open("GET", "/" + zipCodeElem.value);
        ajaxReq.send();
    });
});