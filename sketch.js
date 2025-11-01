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
let connectingPointG;
let connectingPointH;

let showMechanism = true;

function setup() {
    let canvas = createCanvas(800, 800);
    canvas.parent('canvas-container');
    angleMode(DEGREES);

    rotatingLine1 = new RotatingLine(300, 600, 60, color(0, 0, 0), 1, 2.2);
    rotatingLine2 = new RotatingLine(500, 600, 60, color(0, 0, 0), -1, 2);

    connectingLine1 = new ConnectingLine(150, color(0, 0, 0));
    connectingLine2 = new ConnectingLine(200, color(0, 0, 0));
    connectingLine3 = new ConnectingLine(100, color(0, 0, 0));
    connectingLine4 = new ConnectingLine(100, color(0, 0, 0));

    connectingPointA = new ConnectingPoint(10, color(0, 0, 0), color(100, 100, 100), false);
    connectingPointB = new ConnectingPoint(10, color(0, 0, 0), color(100, 100, 100), false);
    connectingPointC = new ConnectingPoint(10, color(0, 0, 0), color(100, 100, 100), false);
    connectingPointD = new ConnectingPoint(10, color(0, 0, 0), color(100, 100, 100), false);
    connectingPointE = new ConnectingPoint(10, color(0, 0, 0), color(100, 100, 100), false);
    connectingPointF = new ConnectingPoint(10, color(0, 0, 0), color(200, 100, 200), true);
    connectingPointG = new ConnectingPoint(10, color(0, 0, 0), color(200, 100, 200), false);
    connectingPointH = new ConnectingPoint(10, color(0, 0, 0), color(200, 100, 200), false);

    extensionLine1 = new ExtendedLine(createVector(0, 0), createVector(1, 0), 100, color(0, 0, 0));
    extensionLine2 = new ExtendedLine(createVector(0, 0), createVector(1, 0), 100, color(0, 0, 0));
}

function draw() {
    background(240);

    if (rotatingLine1.dragging) {
        displayReachableArea(rotatingLine1, rotatingLine2, connectingLine1, connectingLine2);
    }

    if (rotatingLine2.dragging) {
        displayReachableArea(rotatingLine2, rotatingLine1, connectingLine1, connectingLine2);
    }

    // 回転更新と描画
    if (!rotatingLine1.dragging && !rotatingLine2.dragging) {
        rotatingLine1.update();
        rotatingLine2.update();
    }

    // ホバー状態の確認
    let hoverG = connectingPointG.checkHover();
    let hoverH = connectingPointH.checkHover();
    if (hoverG || hoverH) {
        cursor(HAND);
    } else {
        cursor(ARROW);
    }

    // 回転軸の中心位置に点を表示
    connectingPointG.update(createVector(rotatingLine1.cx, rotatingLine1.cy));
    connectingPointH.update(createVector(rotatingLine2.cx, rotatingLine2.cy));

    // 回転棒の先端位置を取得
    let A = rotatingLine1.getEndPoint();
    let B = rotatingLine2.getEndPoint();

    // 緑の棒がそれぞれの長さで繋がる交点を計算
    let C = getFixedLengthJointDual(A, B, connectingLine1.length, connectingLine2.length, false);

    if (C) {
        // 緑棒の位置更新
        connectingLine1.update(A, C);
        connectingLine2.update(B, C);

        // AC方向に延長線を更新・描画
        extensionLine1.updateFromPoints(A, C);
        extensionLine2.updateFromPoints(B, C);

        let D = extensionLine1.getEndPoint();
        let E = extensionLine2.getEndPoint();

        let F = getFixedLengthJointDual(D, E, connectingLine3.length, connectingLine4.length, true);
        connectingLine3.update(D, F);
        connectingLine4.update(E, F);

        // 点の描画
        connectingPointA.update(A);
        connectingPointA.displayOrbit();
        connectingPointB.update(B);
        connectingPointB.displayOrbit();
        connectingPointC.update(C);
        connectingPointC.displayOrbit();
        connectingPointD.update(D);
        connectingPointD.displayOrbit();
        connectingPointE.update(E);
        connectingPointE.displayOrbit();
        connectingPointF.update(F);
        connectingPointF.displayOrbit();
        connectingPointG.update(createVector(rotatingLine1.cx, rotatingLine1.cy));
        connectingPointH.update(createVector(rotatingLine2.cx, rotatingLine2.cy));


        if (showMechanism) {
            rotatingLine1.display();
            rotatingLine2.display();
            extensionLine1.display();
            extensionLine2.display();
            connectingLine1.display();
            connectingLine2.display();
            connectingLine3.display();
            connectingLine4.display();
            connectingPointA.displayPoint();
            connectingPointB.displayPoint();
            connectingPointC.displayPoint();
            connectingPointD.displayPoint();
            connectingPointE.displayPoint();
            connectingPointF.displayPoint();
            connectingPointG.displayPoint();
            connectingPointH.displayPoint();
        }
    }
}

/**
 * 2点A, Bからそれぞれ異なる長さ r1, r2 で伸ばす棒が交差する点を求める
 * @param {p5.Vector} A - 棒1の起点
 * @param {p5.Vector} B - 棒2の起点
 * @param {number} r1 - 棒1の長さ
 * @param {number} r2 - 棒2の長さ
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
        this.dragging = false;
        this.offsetX = 0;
        this.offsetY = 0;

        this.startDragX = centerX;
        this.startDragY = centerY;
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

    /**
     * マウスが回転中心上にあるか判定
     * @returns {boolean} 中心をクリック可能な範囲にある場合true
     */
    isMouseOver() {
        return dist(mouseX, mouseY, this.cx, this.cy) < 12;
    }

    /**
     * ドラッグ開始時の処理
     */
    startDrag() {
        this.dragging = true;
        this.offsetX = this.cx - mouseX;
        this.offsetY = this.cy - mouseY;

        // ドラッグ開始位置を保存
        this.startDragX = this.cx;
        this.startDragY = this.cy;
    }

    /**
     * ドラッグ中の処理
     */
    drag() {
        if (this.dragging) {
            this.cx = mouseX + this.offsetX;
            this.cy = mouseY + this.offsetY;
        }
    }

    /**
     * ドラッグ終了時の処理
     */
    endDrag() {
        this.dragging = false;
        // ドラッグ中に可達性チェック
        if (!checkReachability()) {
            // 不可達なら元の位置に戻す
            this.cx = this.startDragX;
            this.cy = this.startDragY;
        }
    }

    /**
     * 回転方向を反転する
     */
    reverseDirection() {
        this.direction *= -1;
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
     * @param {boolean} isOrbit - 軌道の描画
     */
    constructor(size, color, orbitColor, isOrbit) {
        this.pos = createVector(0, 0); // 現在位置
        this.size = size;
        this.color = color;
        this.orbitColor = orbitColor;
        this.isOrbit = isOrbit;

        this.orbit = []; // 軌跡座標
        this.maxTrailLength = 1000; // 保存する軌跡数
        this.orbitSave = true;
        this.hovered = false;
    }

    /**
     * 接続点の位置を更新し、軌跡も保存
     * @param {p5.Vector} pos - 接続点の位置
     */
    update(pos) {
        this.pos = pos.copy();
        if (this.isOrbit && this.orbitSave) {
            this.orbit.push(this.pos.copy());

            if (this.orbit.length >= 200) {
                const head = this.orbit.slice(0, 100);

                // 先頭100個と一致する並びを orbit 内で探す
                for (let i = 100; i <= this.orbit.length - 100; i++) {
                    let match = true;
                    for (let j = 0; j < 100; j++) {
                        if (this.orbit[i + j].dist(head[j]) > 0.5) {
                            match = false;
                            break;
                        }
                    }
                    if (match) {
                        this.orbitSave = false;
                        console.log("軌道が繰り返されたため、保存を終了しました");
                        break;
                    }
                }
            }
        }
    }


    /**
     * 軌跡の描画
     */
    displayOrbit() {
        if (this.isOrbit && this.orbit.length > 1) {
            noFill();
            stroke(this.orbitColor);
            strokeWeight(1.5);
            beginShape();
            for (let p of this.orbit) {
                vertex(p.x, p.y);
            }
            endShape();
        }
    }

    /**
     * 点の描画
     */
    displayPoint() {
        push();
        translate(this.pos.x, this.pos.y);

        if (this.isOrbit) {
            fill(this.color);
            noStroke();
            ellipse(0, 0, this.size, this.size);
        } else {
            // ねじ風デザイン
            fill(180);
            stroke(60);
            strokeWeight(1.5);
            ellipse(0, 0, this.size+5, this.size+5);

            // 十字のドライバー溝
            stroke(60);
            strokeWeight(1);
            line(-this.size * 0.3, -this.size * 0.3, this.size * 0.3, this.size * 0.3);
            line(-this.size * 0.3, this.size * 0.3, this.size * 0.3, -this.size * 0.3);
        }

        pop();
    }

    /**
     * 点と軌道の両方を描画（従来の display の統合関数）
     */
    display() {
        this.displayOrbit();
        this.displayPoint();
    }

    // ホバー状態を更新して返す
    checkHover() {
        this.hovered = dist(mouseX, mouseY, this.pos.x, this.pos.y) < this.size / 2 + 5;
        return this.hovered;
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
     * 始点と終点から向きベクトルを自動計算して更新する
     * @param {p5.Vector} start - 始点ベクトル
     * @param {p5.Vector} end - 終点ベクトル
     */
    updateFromPoints(start, end) {
        this.setStart(end);
        const direction = p5.Vector.sub(end, start);
        this.setDirection(direction);
    }

     /**
     * 線の先端（回転後の位置）を返す
     * @returns {p5.Vector} 線の先端の座標
     */
    getEndPoint() {
        return p5.Vector.add(this.start, p5.Vector.mult(this.direction, this.length));
    }
}

function mousePressed() {
    if (rotatingLine1.isMouseOver()) rotatingLine1.startDrag();
    if (rotatingLine2.isMouseOver()) rotatingLine2.startDrag();
}

function mouseDragged() {
    rotatingLine1.drag();
    rotatingLine2.drag();
}

function mouseReleased() {
    let wasDragging = rotatingLine1.dragging || rotatingLine2.dragging;

    rotatingLine1.endDrag();
    rotatingLine2.endDrag();

    if (wasDragging) {
        orbitReset();
    }
}


/**
 * 接続点Fの軌跡記録をリセットする
 */
function orbitReset() {
    connectingPointF.orbit = [];
    connectingPointF.orbitSave = true;
}

/**
 * 現在の構造が物理的に成立するかどうかをチェックする
 * @returns {boolean} - 成立するならtrue、しないならfalse
 */
function checkReachability() {
    let endPointA = rotatingLine1.getEndPoint();
    let endPointB = rotatingLine2.getEndPoint();
    let centerA = createVector(rotatingLine1.cx, rotatingLine1.cy);
    let centerB = createVector(rotatingLine2.cx, rotatingLine2.cy);

    let lengthACenter  = p5.Vector.dist(endPointA, centerA);
    let lengthBCenter = p5.Vector.dist(centerA, centerB);
    let centerToCenter = p5.Vector.dist(centerB, endPointB);

    let jointPoint = getFixedLengthJointDual(endPointA, endPointB, connectingLine1.length, connectingLine2.length, false);
    if (!jointPoint) {
        console.log("リンクの交点が存在しない（姿勢が無理）");
        return false;
    }

    let lengthAJoint = p5.Vector.dist(endPointA, jointPoint);
    let lengthBJoint = p5.Vector.dist(endPointB, jointPoint);

    let totalByLink = lengthAJoint + lengthBJoint;
    let totalByFixed = lengthACenter  + lengthBCenter + centerToCenter;

    let condition1 = totalByLink - totalByFixed;
    let condition2 = lengthACenter  + Math.abs(lengthAJoint - lengthBJoint) + centerToCenter < lengthBCenter;
    return condition1 > 0 && condition2;
}

/**
 * ドラッグ中の回転中心の可動可能範囲を円で表示する
 * @param {RotatingLine} draggedLine - ドラッグ中の回転ライン
 * @param {RotatingLine} fixedLine - 相手側の固定回転ライン
 * @param {ConnectingLine} line1 - 接続ライン1
 * @param {ConnectingLine} line2 - 接続ライン2
 */
function displayReachableArea(draggedLine, fixedLine, line1, line2) {
    let fixedCenter = createVector(fixedLine.cx, fixedLine.cy);
    let draggedCenter = createVector(draggedLine.cx, draggedLine.cy);
    let fixedEnd = fixedLine.getEndPoint();
    let draggedEnd = draggedLine.getEndPoint();

    let distFixedToCenter = p5.Vector.dist(fixedEnd, fixedCenter);
    let distCenterToDragged = p5.Vector.dist(draggedCenter, draggedEnd);

    let baseRadius = line1.length + line2.length;
    let innerRadius  = baseRadius - distFixedToCenter - distCenterToDragged;

    if (innerRadius > 0) {
        background(100, 100, 100)
        fill(250);
        stroke(240, 240, 240, 0);
        strokeWeight(1.5);
        ellipse(fixedCenter.x, fixedCenter.y, innerRadius * 2, innerRadius * 2);
    }

    let outerRadius = distFixedToCenter + Math.abs(line1.length - line2.length) + distCenterToDragged;

    if (innerRadius > 0) {
        fill(100, 100, 100);
        stroke(100, 100, 100, 0);
        strokeWeight(1.5);
        ellipse(fixedCenter.x, fixedCenter.y, outerRadius * 2, outerRadius * 2);
    }
}