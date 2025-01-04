function setup() {
    // Canvasの設定
    createCanvas(600, 600);
    background(50);
}

function draw() {
    // 点の座標をベクトルとして定義
    let A = createVector(220, 200);
    let B = createVector(120, 300);
    let C = createVector(300, 260);
    let D = createVector(300, 350);

    // 点を赤で描画
    fill("#f00");
    noStroke();
    circle(A.x, A.y, 10);
    circle(B.x, B.y, 10);
    circle(C.x, C.y, 10);
    circle(D.x, D.y, 10);

    // ラベルを白で描画
    fill(255);
    text("A", A.x + 10, A.y);
    text("B", B.x + 10, B.y);
    text("C", C.x + 10, C.y);
    text("D", D.x + 10, D.y);
}