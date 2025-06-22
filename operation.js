"use strict";

window.addEventListener("DOMContentLoaded", () => {
    const checkbox = document.getElementById("toggleMechanism");
    if (checkbox) {
        checkbox.addEventListener("change", () => {
            showMechanism = checkbox.checked;
        });
    }
});
document.addEventListener("DOMContentLoaded", () => {
    // メカニズム表示トグルの状態を取得
    const toggle = document.getElementById("toggleMechanism");
    toggle.addEventListener("change", () => {
        showMechanism = toggle.checked;
    });

    // 回転方向切り替えボタン（左アーム）
    document.getElementById("reverseLeft").addEventListener("click", () => {
        if (rotatingLine1) {
            rotatingLine1.reverseDirection();
            orbitReset();
        }
    });

    // 回転方向切り替えボタン（右アーム）
    document.getElementById("reverseRight").addEventListener("click", () => {
        if (rotatingLine2) {
            rotatingLine2.reverseDirection();
            orbitReset();
        }
    });
});