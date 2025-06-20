"use strict"

let rotatingLine1;
let rotatingLine2;
function setup() {
    createCanvas(400, 400);
    angleMode(DEGREES); // 角度は度数法

    // クラスのインスタンス作成
    rotatingLine1 = new RotatingLine(
        100, 200, // 中心点
        60, // 線の長さ
        color(255, 0, 0), // 色
        1, // 回転方向
        2 // 回転速度
    );

    // クラスのインスタンス作成
    rotatingLine2 = new RotatingLine(
        300, 200, // 中心点
        60, // 線の長さ
        color(255, 0, 0), // 色
        -1, // 回転方向
        1 // 回転速度
    );
}

function draw() {
    background(240);
    rotatingLine1.update();
    rotatingLine1.display();
    rotatingLine2.update();
    rotatingLine2.display();


    let end1 = rotatingLine1.getEndPoint();
    let end2 = rotatingLine2.getEndPoint();

    fill(0);
    noStroke();
    ellipse(end1.x, end1.y, 10, 10);
    ellipse(end2.x, end2.y, 10, 10);
}


/**
 * 回転する線を表すクラス。
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