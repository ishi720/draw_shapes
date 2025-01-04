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

    // 点とラベルを赤で描画
    draw_point(A, "A", "#f00");
    draw_point(B, "B", "#f00");
    draw_point(C, "C", "#f00");
    draw_point(D, "D", "#f00");
}

/***********************************************/
/* 描画処理                                     */
/***********************************************/

/**
 * 点とラベルを描画する
 *
 * @param {p5.Vector} p1 - 点の座標を表すp5.Vectorオブジェクト
 * @param {string} t - 点に付けるラベルのテキスト
 * @param {string} color - 点を描画する際の色（CSSカラーコードや色名を指定）
 */
function draw_point(p1, t, color) {
    fill(color);
    noStroke();
    circle(p1.x, p1.y, 10);

    fill(255);
    text(t, p1.x + 10, p1.y);
}