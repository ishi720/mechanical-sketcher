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

  getEndPoint() {
    let x = this.cx + cos(this.angle) * this.length;
    let y = this.cy + sin(this.angle) * this.length;
    return createVector(x, y);
  }
}