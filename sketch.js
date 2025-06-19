let rotatingLine;

function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES); // 角度は度数法

  // クラスのインスタンス作成
  rotatingLine = new RotatingLine(
    200, 200, // 中心点
    120, // 線の長さ
    color(255, 0, 0), // 色
    1, // 時計回り
    2 // 回転速度
  );
}

function draw() {
  background(240);
  rotatingLine.update();
  rotatingLine.display();
}

class RotatingLine {
  constructor(centerX, centerY, length, color, direction, speed) {
    this.cx = centerX;
    this.cy = centerY;
    this.length = length;
    this.color = color;
    this.direction = direction;
    this.speed = speed;
    this.angle = 0;
  }

  update() {
    this.angle += this.speed * this.direction;
  }

  display() {
    push();
    translate(this.cx, this.cy);
    rotate(this.angle);
    stroke(this.color);
    strokeWeight(2);
    line(0, 0, this.length, 0);
    pop();
  }
}