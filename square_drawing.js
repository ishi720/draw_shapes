function setup() {
    // Canvasの設定
    createCanvas(600, 600);
    background(50);
}

function draw() {
    // 点の座標をベクトルとして定義
    let A = createVector(220, 200);
    let B = createVector(120, 300);
    let C = createVector(380, 260);
    let D = createVector(330, 350);

    // 2点に接する円を定義
    let circle1 = calculateCircle(A, B)
    let center1 = circle1.center;
    let radius1 = circle1.radius;

    let circle2 = calculateCircle(C, D)
    let center2 = circle2.center;
    let radius2 = circle2.radius;

    // 垂直二等分線の交点を計算
    let perpendicular1 = calculatePerpendicularEndpoints(center1, radius1, A);
    let E = perpendicular1.p1;
    let F = perpendicular1.p2
    
    let perpendicular2 = calculatePerpendicularEndpoints(center2, radius2, C);
    let G = perpendicular2.p1;
    let H = perpendicular2.p2

    // TODO: 垂直二等分線の交点のうち、2つの円の内側の点を判定する


    // 2点に接する円を描画
    draw_ellipse(center1, radius1, "#fff");
    draw_ellipse(center2, radius2, "#fff");

    // 直線を描画
    // draw_straight_line(A, B, "#fff");
    // draw_straight_line(C, D, "#fff");
    // draw_straight_line(E, F, "#fff");
    // draw_straight_line(G, H, "#fff");
    draw_straight_line(E, H, "#ff0");

    // 点とラベルを描画
    draw_point(A, "A", "#f00");
    draw_point(B, "B", "#f00");
    draw_point(C, "C", "#f00");
    draw_point(D, "D", "#f00");
    draw_point(E, "E", "#ff0");
    draw_point(F, "F", "#ff0");
    draw_point(G, "G", "#ff0");
    draw_point(H, "H", "#ff0");
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

/**
 * 垂直二等分線の交点交点を計算
 *
 * @param {p5.Vector} center - 円の中心座標を表すp5.Vectorオブジェクト
 * @param {number} radius - 円の半径
 * @param {p5.Vector} point - 円周上または円の中心から見て基準となる点の座標
 * @returns {{ p1: p5.Vector, p2: p5.Vector }}
 * 垂直方向の2つの交点を含むオブジェクト
 * - `p1`: 垂直方向に1つ目の交点の座標
 * - `p2`: 垂直方向に2つ目の交点の座標
 */
function calculatePerpendicularEndpoints(center, radius, point) {
    // 中心点と点Aを基にした垂直ベクトルを計算
    let perpendicular = createVector(center.y - point.y, point.x - center.x)
        .normalize()
        .mult(radius);

    // 垂直ベクトルを加算・減算して交点を計算
    let p1 = p5.Vector.add(center, perpendicular);
    let p2 = p5.Vector.sub(center, perpendicular);

    return { p1, p2 };
}
/**
 * 2点からベクトルの傾きとy切片を計算
 *
 * @param {Object} p1 - 1つ目の点
 * @param {Object} p2 - 2つ目の点
 * @returns {Object} 次のプロパティを持つオブジェクトを返します：
 *  - `slope` {number}: 直線の傾き。直線が垂直の場合はInfinity
 *  - `intercept` {number}: y切片。直線が垂直の場合はx座標
 */
function calculateSlopeAndIntercept(p1, p2) {
    // x座標が同じ場合（垂直線）
    if (p1.x === p2.x) {
        return { slope: Infinity, intercept: p1.x }; // 傾きはInfinity、y切片はx座標
    }
    let direction = createVector(p1.x - p2.x, p1.y - p2.y); // ベクトル方向を求める
    let slope = direction.y / direction.x; // 傾きを計算
    let intercept = p2.y - slope * p2.x; // y切片を計算
    return { slope, intercept }; // 傾きとy切片をオブジェクトで返す
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
function draw_ellipse(center, radius, color) {
    noFill();
    stroke(color);
    ellipse(center.x, center.y, radius * 2, radius * 2);
}

/**
 * 2点を通る直線を描画
 *
 * @param {p5.Vector} p1 - 直線が通る点の座標
 * @param {p5.Vector} p2 - 直線が通る点の座標
 * @param {p5.Vector} color - 描画する色
 */
function draw_straight_line(p1, p2, color) {
    // 2点を結ぶベクトルの方向を計算
    let { slope, intercept } = calculateSlopeAndIntercept(p1, p2);

    // 傾きが無限大の場合（垂直線）
    if (slope === Infinity) {
        stroke(color);
        line(intercept, 0, intercept, height);
        return;
    }

    // x座標が0（キャンバスの左端）のときのy座標を計算
    let yStart = slope * 0 + intercept;
    // x座標がwidth（キャンバスの右端）のときのy座標を計算
    let yEnd = slope * width + intercept;
  
    // 線を描画
    stroke(color);
    line(0, yStart, width, yEnd);
}