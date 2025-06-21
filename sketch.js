"use strict";

let rotatingLine1;
let rotatingLine2;
let connectingLine1;
let connectingLine2;
let connectingPointA;
let connectingPointB;
let connectingPointC;

function setup() {
    createCanvas(400, 400);
    angleMode(DEGREES);

    rotatingLine1 = new RotatingLine(100, 200, 60, color(255, 0, 0), 1, 2.4);
    rotatingLine2 = new RotatingLine(300, 200, 60, color(255, 0, 0), -1, 2);

    connectingLine1 = new ConnectingLine(150, color(0, 255, 0));
    connectingLine2 = new ConnectingLine(200, color(0, 255, 0));

    connectingPointA = new ConnectingPoint(10, color(0, 0, 0), color(100, 100, 100));
    connectingPointB = new ConnectingPoint(10, color(0, 0, 0), color(100, 100, 100));
    connectingPointC = new ConnectingPoint(10, color(0, 0, 0), color(100, 100, 100));
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
    let joint = getFixedLengthJointDual(A, B, connectingLine1.length, connectingLine2.length);

    if (joint) {
        // 緑棒の位置更新
        connectingLine1.update(A, joint);
        connectingLine2.update(B, joint);

        // 緑棒の描画
        connectingLine1.display();
        connectingLine2.display();

        // 点の描画
        connectingPointA.update(A);
        connectingPointA.display();
        connectingPointB.update(B);
        connectingPointB.display();
        connectingPointC.update(joint);
        connectingPointC.display();
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

/**
 * 回転する線を表すクラス
 */
class RotatingLine {
    /**
     * コンストラクタ
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
 * 回転する線に接続する線のクラス
 */
class ConnectingLine {
    /**
     * コンストラクタ
     * @param {number} length - 線の長さ
     * @param {color} color - 線の色
     */
    constructor(length, color) {
        this.length = length;
        this.color = color;
        this.start = createVector(0, 0);
        this.end = createVector(0, 0);
    }

    update(start, end) {
        this.start = start.copy();
        this.end = end.copy();
    }

    display() {
        stroke(this.color);
        strokeWeight(2);
        line(this.start.x, this.start.y, this.end.x, this.end.y);
    }
}

/**
 * 点クラス
 */
class ConnectingPoint {
    /**
     * コンストラクタ
     * @param {number} size - 表示サイズ
     * @param {color} color - 色
     * @param {color} orbitColor - 軌道の色
     */
    constructor(size, color, orbitColor) {
        this.pos = createVector(0, 0); // 現在位置
        this.size = size;
        this.color = color;
        this.orbitColor = orbitColor;

        this.orbit = []; // 軌跡座標
        this.maxTrailLength = 300; // 保存する軌跡数
        this.showTrail = true; // 軌跡を描くかどうか（ON/OFF制御も可能）
    }

    /**
     * 接続点の位置を更新し、軌跡も保存
     * @param {p5.Vector} pos - 接続点の位置
     */
    update(pos) {
        this.pos = pos.copy();

        // 軌跡保存（移動があった場合のみ）
        if (this.showTrail) {
            this.orbit.push(this.pos.copy());
            if (this.orbit.length > this.maxTrailLength) {
                this.orbit.shift(); // 古いものから削除
            }
        }
    }

    /**
     * 接続点の描画と軌跡の描画
     */
    display() {
        // 軌跡の描画
        if (this.showTrail && this.orbit.length > 1) {
            noFill();
            stroke(this.orbitColor);
            strokeWeight(2);
            beginShape();
            for (let p of this.orbit) {
                vertex(p.x, p.y);
            }
            endShape();
        }

        // 点の描画
        fill(this.color);
        noStroke();
        ellipse(this.pos.x, this.pos.y, this.size, this.size);
    }
}
