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

    // 軌道の色変更
    const orbitColorPicker = document.getElementById("orbitColor");
    orbitColorPicker.addEventListener("input", () => {
        if (connectingPointF) {
            const col = orbitColorPicker.value;
            const c = color(col); // p5.js の color() に変換
            connectingPointF.orbitColor = c;
        }
    });

    // 左アーム速度
    const speedLeftSlider = document.getElementById("speedLeft");
    const speedLeftValue = document.getElementById("speedLeftValue");
    speedLeftSlider.addEventListener("input", () => {
        const val = parseFloat(speedLeftSlider.value);
        speedLeftValue.textContent = val.toFixed(1);
        if (rotatingLine1) {
            rotatingLine1.speed = val;
            orbitReset();
        }
    });

    // 右アーム速度
    const speedRightSlider = document.getElementById("speedRight");
    const speedRightValue = document.getElementById("speedRightValue");
    speedRightSlider.addEventListener("input", () => {
        const val = parseFloat(speedRightSlider.value);
        speedRightValue.textContent = val.toFixed(1);
        if (rotatingLine2) {
            rotatingLine2.speed = val;
            orbitReset();
        }
    });
});