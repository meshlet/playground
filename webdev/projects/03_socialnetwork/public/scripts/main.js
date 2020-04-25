// Attach a listener for the `window.load` event
window.addEventListener("load", () => {
    const selectProfilePicBtn = document.getElementById("select_profile_pic");
    if (selectProfilePicBtn) {
        const uploadPicInput = document.getElementById('selected_profile_pic');

        // Attach a listener for the `click` event for the `select_profile_pic`
        // button
        selectProfilePicBtn.addEventListener("click", () => {
            // Invoke `click` handler for the input field used to upload
            // profile image (which is hidden)
            uploadPicInput.click();
        });

        // Attach a listener for the `change` event on the input field used
        // to upload profile image. This event is emitted once user selects
        // a new image
        const profilePicPreview = document.getElementById("profile_pic_preview");
        uploadPicInput.addEventListener("change", () => {
            profilePicPreview.src = URL.createObjectURL(uploadPicInput.files[0]);
        });
    }
});