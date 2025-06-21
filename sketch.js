"use strict";

let rotatingLine1;
let rotatingLine2;
let connectingLine1;
let connectingLine2;
let connectingLine3;
let connectingLine4;
let extensionLine1;
let extensionLine2;
let connectingPointA;
let connectingPointB;
let connectingPointC;
let connectingPointD;
let connectingPointE;
let connectingPointF;

function setup() {
    createCanvas(800, 800);
    angleMode(DEGREES);

    rotatingLine1 = new RotatingLine(300, 600, 60, color(255, 0, 0), 1, 2.4);
    rotatingLine2 = new RotatingLine(500, 600, 60, color(255, 0, 0), 1, 2);

    connectingLine1 = new ConnectingLine(150, color(0, 255, 0));
    connectingLine2 = new ConnectingLine(200, color(0, 255, 0));
    connectingLine3 = new ConnectingLine(100, color(0, 255, 255));
    connectingLine4 = new ConnectingLine(100, color(0, 255, 255));

    connectingPointA = new ConnectingPoint(10, color(0, 0, 0), color(100, 100, 100));
    connectingPointB = new ConnectingPoint(10, color(0, 0, 0), color(100, 100, 100));
    connectingPointC = new ConnectingPoint(10, color(0, 0, 0), color(100, 100, 100));
    connectingPointD = new ConnectingPoint(10, color(0, 0, 0), color(100, 100, 100));
    connectingPointE = new ConnectingPoint(10, color(0, 0, 0), color(100, 100, 100));
    connectingPointF = new ConnectingPoint(10, color(0, 0, 0), color(100, 100, 100));

    extensionLine1 = new ExtendedLine(createVector(0, 0), createVector(1, 0), 100, color(0, 255, 0));
    extensionLine2 = new ExtendedLine(createVector(0, 0), createVector(1, 0), 100, color(0, 255, 0));
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
    let C = getFixedLengthJointDual(A, B, connectingLine1.length, connectingLine2.length, false);

    if (C) {
        // 緑棒の位置更新
        connectingLine1.update(A, C);
        connectingLine2.update(B, C);

        // 緑棒の描画
        connectingLine1.display();
        connectingLine2.display();

        // AC方向に延長線を更新・描画
        let dirA = p5.Vector.sub(C, A);
        extensionLine1.setStart(C);
        extensionLine1.setDirection(dirA);
        extensionLine1.display();

        let dirB = p5.Vector.sub(C, B);
        extensionLine2.setStart(C);
        extensionLine2.setDirection(dirB);
        extensionLine2.display();

        let D = extensionLine1.getEndPoint();
        let E = extensionLine2.getEndPoint();

        let F = getFixedLengthJointDual(D, E, connectingLine3.length, connectingLine4.length, true);
        connectingLine3.update(D, F);
        connectingLine4.update(E, F);
        connectingLine3.display();
        connectingLine4.display();


        // 点の描画
        connectingPointA.update(A);
        connectingPointA.display();
        connectingPointB.update(B);
        connectingPointB.display();
        connectingPointC.update(C);
        connectingPointC.display();
        connectingPointD.update(D);
        connectingPointD.display();
        connectingPointE.update(E);
        connectingPointE.display();
        connectingPointF.update(F);
        connectingPointF.display();
    }
}

/**
 * 2点A, Bからそれぞれ異なる長さ r1, r2 で伸ばす棒が交差する点を求める
 * @param {p5.Vector} A - 緑棒1の起点
 * @param {p5.Vector} B - 緑棒2の起点
 * @param {number} r1 - 緑棒1の長さ
 * @param {number} r2 - 緑棒2の長さ
 * @param {boolean} useUpper - trueで上側交点、falseで下側交点を返す
 * @returns {p5.Vector|null} - 交差点（上側）、なければ null
 */
function getFixedLengthJointDual(A, B, r1, r2, useUpper = true) {
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

    // 上側 or 下側を選んで返す
    let sign = useUpper ? 1 : -1;

    return createVector(px + sign * h * nx, py + sign * h * ny);
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

/**
 * 任意の方向に延長する直線クラス
 */
class ExtendedLine {
    /**
     * コンストラクタ
     * @param {p5.Vector} start - 始点
     * @param {p5.Vector} direction - 向きベクトル
     * @param {number} length - 線の長さ
     * @param {color} color - 線の色
     */
    constructor(start, direction, length, color) {
        this.start = start.copy();
        this.setDirection(direction);
        this.length = length;
        this.color = color;
    }

    /**
     * 向きを更新（内部的に正規化）
     * @param {p5.Vector} direction
     */
    setDirection(direction) {
        this.direction = direction.copy().normalize();
    }

    /**
     * 始点の更新
     * @param {p5.Vector} start
     */
    setStart(start) {
        this.start = start.copy();
    }

    /**
     * 線を描画
     */
    display() {
        let end = p5.Vector.add(this.start, p5.Vector.mult(this.direction, this.length));
        stroke(this.color);
        strokeWeight(2);
        line(this.start.x, this.start.y, end.x, end.y);
    }

     /**
     * 線の先端（回転後の位置）を返す
     * @returns {p5.Vector} 線の先端の座標
     */
    getEndPoint() {
        return p5.Vector.add(this.start, p5.Vector.mult(this.direction, this.length));
    }
}