"use strict";

let rotatingLine1;
let rotatingLine2;

// 緑の棒の長さ
let greenLength1 = 150;
let greenLength2 = 200;

function setup() {
    createCanvas(400, 400);
    angleMode(DEGREES);

    rotatingLine1 = new RotatingLine(
        100, 200, // 中心点
        60, // 長さ
        color(255, 0, 0), // 色
        1, // 回転方向
        2.4 // 回転速度
    );

    rotatingLine2 = new RotatingLine(
        300, 200, // 中心点
        60, // 長さ
        color(255, 0, 0), // 色
        1, // 回転方向
        2 // 回転速度
    );
}

function draw() {
    background(240);

    // 回転更新と描画
    rotatingLine1.update();
    rotatingLine1.display();
    rotatingLine2.update();
    rotatingLine2.display();

    // 回転棒の先端位置を取得
    let A = rotatingLine1.getEndPoint();
    let B = rotatingLine2.getEndPoint();

    // 緑の棒がそれぞれの長さで繋がる交点を計算
    let joint = getFixedLengthJointDual(A, B, greenLength1, greenLength2);

    if (joint) {
        // 緑の棒を描画
        stroke("green");
        strokeWeight(2);
        line(A.x, A.y, joint.x, joint.y);
        line(B.x, B.y, joint.x, joint.y);

        // 点の描画
        fill(0);
        noStroke();
        ellipse(A.x, A.y, 10, 10);
        ellipse(B.x, B.y, 10, 10);

        fill("green");
        ellipse(joint.x, joint.y, 10, 10); // 接続点
    }
}

/**
 * 回転する線を表すクラス
 */
class RotatingLine {
    /**
     * コンストラクタ。
     * @param {number} centerX - 回転の中心X座標
     * @param {number} centerY - 回転の中心Y座標
     * @param {number} length - 線の長さ
     * @param {color} color - 線の色
     * @param {number} direction - 回転の向き（1で時計回り、-1で反時計回り）
     * @param {number} speed - 回転速度（角度の増加量）
     */
    constructor(centerX, centerY, length, color, direction, speed) {
        this.cx = centerX;
        this.cy = centerY;
        this.length = length;
        this.color = color;
        this.direction = direction;
        this.speed = speed;
        this.angle = 0;
    }

    /**
     * フレームごとの回転角度を更新
     */
    update() {
        this.angle += this.speed * this.direction;
    }

    /**
     * 回転した線をキャンバスに描画
     */
    display() {
        push();
        translate(this.cx, this.cy);
        rotate(this.angle);
        stroke(this.color);
        strokeWeight(2);
        line(0, 0, this.length, 0);
        pop();
    }

    /**
     * 線の先端（回転後の位置）を返す
     * @returns {p5.Vector} 線の先端の座標
     */
    getEndPoint() {
        let x = this.cx + cos(this.angle) * this.length;
        let y = this.cy + sin(this.angle) * this.length;
        return createVector(x, y);
    }
}

/**
 * 2点A, Bからそれぞれ異なる長さ r1, r2 で伸ばす棒が交差する点を求める
 * @param {p5.Vector} A - 緑棒1の起点
 * @param {p5.Vector} B - 緑棒2の起点
 * @param {number} r1 - 緑棒1の長さ
 * @param {number} r2 - 緑棒2の長さ
 * @returns {p5.Vector|null} - 交差点（上側）、なければ null
 */
function getFixedLengthJointDual(A, B, r1, r2) {
    let d = dist(A.x, A.y, B.x, B.y);
    if (d > r1 + r2 || d < abs(r1 - r2) || d === 0) return null;

    // ベースベクトル
    let dx = (B.x - A.x) / d;
    let dy = (B.y - A.y) / d;

    // 三角形の底辺から高さ h を計算（余弦定理の派生）
    let a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
    let h = Math.sqrt(r1 * r1 - a * a);

    // 中点からのベース位置（交差線の直下）
    let px = A.x + a * dx;
    let py = A.y + a * dy;

    // 垂直ベクトル（上側を選択）
    let nx = -dy;
    let ny = dx;

    return createVector(px + h * nx, py + h * ny); // 上側交点
}