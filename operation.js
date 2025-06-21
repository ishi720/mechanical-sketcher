"use strict";

window.addEventListener("DOMContentLoaded", () => {
    const checkbox = document.getElementById("toggleMechanism");
    if (checkbox) {
        checkbox.addEventListener("change", () => {
            showMechanism = checkbox.checked;
        });
    }
});

function mousePressed() {
    if (rotatingLine1.isMouseOver()) rotatingLine1.startDrag();
    if (rotatingLine2.isMouseOver()) rotatingLine2.startDrag();
}

function mouseDragged() {
    rotatingLine1.drag();
    rotatingLine2.drag();
}

function mouseReleased() {
    rotatingLine1.endDrag();
    rotatingLine2.endDrag();
}