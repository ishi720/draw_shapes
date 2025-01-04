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

    // 2点に接する円を描画
    let circle1 = calculateCircle(A, B)
    let center1 = circle1.center;
    let radius1 = circle1.radius;
    draw_ellipse(center1, radius1, "#fff");

    let circle2 = calculateCircle(C, D)
    let center2 = circle2.center;
    let radius2 = circle2.radius;
    draw_ellipse(center2, radius2, "#fff");
}

/***********************************************/
/* 計算処理                                     */
/***********************************************/

/**
 * 2点に接する円を作成
 *
 * @param {p5.Vector} p1 - 1つ目の点の座標を表すp5.Vectorオブジェクト。
 * @param {p5.Vector} p2 - 2つ目の点の座標を表すp5.Vectorオブジェクト。
 * @returns {{ center: p5.Vector, radius: number }} 
 * 2点に接する円の中心座標と半径を含むオブジェクト。
 * - `center`: 円の中心座標を表すp5.Vector。
 * - `radius`: 円の半径を表す数値。
 */
function calculateCircle(p1, p2) {
    let center = createVector((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
    let radius = dist(p1.x, p1.y, p2.x, p2.y) / 2;
    return { center, radius };
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

/**
 * 円を描画する
 *
 * @param {p5.Vector} center - 円の中心座標を表すp5.Vectorオブジェクト
 * @param {number} radius - 円の半径
 * @param {string} color - 円の線の色（CSSカラーコードや色名を指定）
 */
function draw_ellipse(center, radius, color){
    noFill();
    stroke(color);
    ellipse(center.x, center.y, radius * 2, radius * 2);
}