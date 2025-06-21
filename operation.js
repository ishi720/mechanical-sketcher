"use strict";

window.addEventListener("DOMContentLoaded", () => {
    const checkbox = document.getElementById("toggleMechanism");
    if (checkbox) {
        checkbox.addEventListener("change", () => {
            showMechanism = checkbox.checked;
        });
    }
});