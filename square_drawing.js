let points = {
    Ax: 220,
    Ay: 200,
    Bx: 120,
    By: 300,
    Cx: 320,
    Cy: 260,
    Dx: 330,
    Dy: 520
};

// let points = {
//     Ax: Math.floor(Math.random() * 601),
//     Ay: Math.floor(Math.random() * 601),
//     Bx: Math.floor(Math.random() * 601),
//     By: Math.floor(Math.random() * 601),
//     Cx: Math.floor(Math.random() * 601),
//     Cy: Math.floor(Math.random() * 601),
//     Dx: Math.floor(Math.random() * 601),
//     Dy: Math.floor(Math.random() * 601)
// };

let velocityA = { vx: 2, vy: 3 };
let velocityB = { vx: 4, vy: 1 };
let velocityC = { vx: -1, vy: 2 };
let velocityD = { vx: 1, vy: 2 };

let isAutoMove = false;

function changeIsAutoMove() {
    isAutoMove = !isAutoMove;
}

function update() {
    for (let key in points) {
        points[key] = parseInt(document.getElementById(key).value);
    }
}

function setup() {
    createCanvas(600, 600);
    background(50);

    for (let key in points) {
        let input = document.getElementById(key);
        input.value = points[key];
        input.addEventListener('input', update);
    }
}

function draw() {
    clear();
    background(50);

    if (isAutoMove) {
        // 点Aの位置を更新
        points.Ax += velocityA.vx;
        points.Ay += velocityA.vy;
        points.Bx += velocityB.vx;
        points.By += velocityB.vy;
        points.Cx += velocityC.vx;
        points.Cy += velocityC.vy;
        points.Dx += velocityD.vx;
        points.Dy += velocityD.vy;

        // 境界で跳ね返る処理
        if (points.Ax > width || points.Ax < 0) {
            velocityA.vx *= -1; 
        }
        if (points.Ay > height || points.Ay < 0) {
            velocityA.vy *= -1;
        }
        // 境界で跳ね返る処理
        if (points.Bx > width || points.Bx < 0) {
            velocityB.vx *= -1; 
        }
        if (points.By > height || points.By < 0) {
            velocityB.vy *= -1;
        }
        // 境界で跳ね返る処理
        if (points.Cx > width || points.Cx < 0) {
            velocityC.vx *= -1; 
        }
        if (points.Cy > height || points.Cy < 0) {
            velocityC.vy *= -1;
        }
        // 境界で跳ね返る処理
        if (points.Dx > width || points.Dx < 0) {
            velocityD.vx *= -1; 
        }
        if (points.Dy > height || points.Dy < 0) {
            velocityD.vy *= -1;
        }

        for (let key in points) {
            let input = document.getElementById(key);
            input.value = points[key];
        }
    }
    // 点の座標をベクトルとして定義
    let A = createVector(points.Ax, points.Ay);
    let B = createVector(points.Bx, points.By);
    let C = createVector(points.Cx, points.Cy);
    let D = createVector(points.Dx, points.Dy);

    // let C = createVector(points.Ax, points.Ay);
    // let D = createVector(points.Bx, points.By);
    // let A = createVector(points.Cx, points.Cy);
    // let B = createVector(points.Dx, points.Dy);

    // 2点に接する円を定義
    let center1 = calculateMidpoint(A, B);
    let radius1 = calculateRadius(A, B);

    let center2 = calculateMidpoint(C, D);
    let radius2 = calculateRadius(C, D);

    // 垂直二等分線の交点を計算
    let perpendicular1 = calculatePerpendicularEndpoints(center1, radius1, A);
    let E = perpendicular1.p1;
    let F = perpendicular1.p2
    
    let perpendicular2 = calculatePerpendicularEndpoints(center2, radius2, C);
    let G = perpendicular2.p1;
    let H = perpendicular2.p2

    // 直線と円の第二の交点
    let nearPoint1 = findClosestPoint(center2, E, F);
    let nearPoint2 = findClosestPoint(center1, G, H);
    
    let { slope, intercept } = calculateSlopeAndIntercept(nearPoint1, nearPoint2);
    I = calculateCircleLineIntersection(center1, radius1, slope, intercept, nearPoint1);
    J = calculateCircleLineIntersection(center2, radius2, slope, intercept, nearPoint2);

    // 円を描画
    draw_ellipse(center1, radius1, "#fff");
    draw_ellipse(center2, radius2, "#fff");

    // 直線を描画
    // draw_straight_line(A, B, "#fff");
    // draw_straight_line(C, D, "#fff");
    // draw_straight_line(E, F, "#fff");
    // draw_straight_line(G, H, "#fff");
    draw_straight_line(nearPoint1, nearPoint2, "#ff0");

    // 点とラベルを描画
    draw_point(A, "A", "#f00");
    draw_point(B, "B", "#f00");
    draw_point(C, "C", "#f00");
    draw_point(D, "D", "#f00");
    draw_point(E, "E", "#ff0");
    draw_point(F, "F", "#ff0");
    draw_point(G, "G", "#ff0");
    draw_point(H, "H", "#ff0");


    if (I && J) {
        let { minXPoint, maxXPoint } = findExtremeXPoints([I,J,E,H]);
        I = maxXPoint;
        J = minXPoint;

        // 第二の交点に接する円を定義
        let center3 = calculateMidpoint(I, J);
        let radius3 = calculateRadius(I, J);

        // 垂直二等分線の交点を計算
        let perpendicular3 = calculatePerpendicularEndpoints(center3, radius3, I);
        let K = perpendicular3.p1;
        let L = perpendicular3.p2

        // 円を描画
        draw_ellipse(center3, radius3, "#f0f");

        // 直線を描画
        draw_straight_line(K, L, "#f0f");

        // 点とラベルを描画
        draw_point(I, "I", "#f0f");
        draw_point(J, "J", "#f0f");
        draw_point(K, "K", "#f0f");
        draw_point(L, "L", "#f0f");

        if (
            isPointOnRectangle(A, I, K, J, L) && 
            isPointOnRectangle(B, I, K, J, L) &&
            isPointOnRectangle(C, I, K, J, L) &&
            isPointOnRectangle(D, I, K, J, L)
        ) {
            // 四角形を描画
            draw_rect(I, K, J, L, "#f00");
            endShape(CLOSE);
        }
    }
}

/***********************************************/
/* 計算処理                                     */
/***********************************************/

/**
 * 2点間の中点を計算
 *
 * @param {p5.Vector} p1 - 1つ目の点の座標を表すp5.Vectorオブジェクト
 * @param {p5.Vector} p2 - 2つ目の点の座標を表すp5.Vectorオブジェクト
 * @returns {p5.Vector} 2点間の中点を表すp5.Vectorオブジェクト
 */
function calculateMidpoint(p1, p2) {
    let x_c = (p1.x + p2.x) / 2;
    let y_c = (p1.y + p2.y) / 2;
    return createVector(x_c, y_c);
}

/**
 * 2点間の距離（半径）を計算
 *
 * @param {p5.Vector} p1 - 1つ目の点の座標を表すp5.Vectorオブジェクト
 * @param {p5.Vector} p2 - 2つ目の点の座標を表すp5.Vectorオブジェクト
 * @returns {number} 2点間の距離（半径）
 */
function calculateRadius(p1, p2) {
    let distance = dist(p1.x, p1.y, p2.x, p2.y);
    return distance / 2;
}

/**
 * 円の中心と点の距離を計算する関数。
 *
 * @param {p5.Vector} center - 円の中心を表すp5.Vectorオブジェクト。
 * @param {p5.Vector} point - 点を表すp5.Vectorオブジェクト。
 * @returns {number} - 円の中心と点の距離。
 */
function calculateDistance(center, point) {
    return center.dist(point);
  }

/**
 * 2つの点のうち、円の中心に近い点を判定する関数
 *
 * @param {p5.Vector} center - 円の中心を表すp5.Vectorオブジェクト
 * @param {p5.Vector} point1 - 点1を表すp5.Vectorオブジェクト
 * @param {p5.Vector} point2 - 点2を表すp5.Vectorオブジェクト
 * @returns {p5.Vector} - 最も近いp5.Vectorオブジェクト

 */
function findClosestPoint(center, point1, point2) {
    const distance1 = calculateDistance(center, point1);
    const distance2 = calculateDistance(center, point2);
    // 最も近い点を判定
    if (distance1 < distance2) {
      return point1;
    } else {
      return point2;
    }
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

/**
 * 与えられた点のリストから最小および最大のx座標を持つ点を見つける
 *
 * @param {Array<{x: number, y: number}>} points - x座標とy座標を持つ点のオブジェクトの配列
 * @returns {{ minXPoint: {x: number, y: number}, maxXPoint: {x: number, y: number} }} 
 * - minXPoint: 最小のx座標を持つ点
 * - maxXPoint: 最大のx座標を持つ点
 */
function findExtremeXPoints(points) {
    let minXPoint = points[0];
    let maxXPoint = points[0];

    // 各点のx座標を比較して最小と最大の点を探す
    for (let i = 1; i < points.length; i++) {
        if (points[i].x < minXPoint.x) {
            minXPoint = points[i];
        }
        if (points[i].x > maxXPoint.x) {
            maxXPoint = points[i];
        }
    }
    return { minXPoint, maxXPoint };
}
/**
 * 円と直線の交点を計算
 *
 * @param {p5.Vector} center - 円の中心座標を表すp5.Vectorオブジェクト
 * @param {number} radius - 円の半径
 * @param {number} slope - 直線の傾き
 * @param {number} intercept - 直線の切片
 * @param {p5.Vector} point - もともと計算して導き出した円の接点
 * @returns {p5.Vector|null} 交点が見つかればp5.Vectorオブジェクト、見つからなければnull
 */
function calculateCircleLineIntersection(center, radius, slope, intercept, point) {
    // 直線と円の交点
    let a2 = 1 + slope * slope;
    let b2 = 2 * (slope * (intercept - center.y) - center.x);
    let c2 =
      center.x * center.x +
      (intercept - center.y) * (intercept - center.y) - 
      radius * radius;
  
    // 判別式
    let discriminant2 = b2 * b2 - 4 * a2 * c2;
    let returnPoint = null;
  
    if (discriminant2 >= 0) {
      let x2_1 = (-b2 + sqrt(discriminant2)) / (2 * a2);
      let y2_1 = slope * x2_1 + intercept;
      let x2_2 = (-b2 - sqrt(discriminant2)) / (2 * a2);
      let y2_2 = slope * x2_2 + intercept;
  
      // 交点を描画
      if (dist(x2_1, y2_1, point.x, point.y) > 5) {
        returnPoint = createVector(x2_1, y2_1);
      } else if (dist(x2_2, y2_2, point.x, point.y) > 5) {
        returnPoint = createVector(x2_2, y2_2);
      }
    }
    return returnPoint;
}

/**
 * 四角形と点が接しているかどうかを判定
 *
 * @param {p5.Vector} point - 判定する点の座標
 * @param {p5.Vector} p1 - 四角形の1つ目の頂点
 * @param {p5.Vector} p2 - 四角形の2つ目の頂点
 * @param {p5.Vector} p3 - 四角形の3つ目の頂点
 * @param {p5.Vector} p4 - 四角形の4つ目の頂点
 * @returns {boolean} - 四角形に接していればtrue、そうでなければfalse
 */
function isPointOnRectangle(point, p1, p2, p3, p4) {
    // 四角形の辺が点と接しているかどうかを判定
    function isPointOnLineSegment(p1, p2, point) {
        let crossProduct = (point.y - p1.y) * (p2.x - p1.x) - (point.x - p1.x) * (p2.y - p1.y);
        if (Math.abs(crossProduct) > 1e-6) return false; // 点が直線上にない場合

        let dotProduct = (point.x - p1.x) * (p2.x - p1.x) + (point.y - p1.y) * (p2.y - p1.y);
        if (dotProduct < 0) return false; // 点がp1より左側にある場合

        let squaredLength = (p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y);
        if (dotProduct > squaredLength) return false; // 点がp2より右側にある場合

        return true; // 点が線分上にある場合
    }

    // 四角形の各辺が点と接しているかをチェック
    return (
        isPointOnLineSegment(p1, p2, point) ||
        isPointOnLineSegment(p2, p3, point) ||
        isPointOnLineSegment(p3, p4, point) ||
        isPointOnLineSegment(p4, p1, point)
    );
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

function draw_rect(p1, p2, p3, p4, color) {
    fill(255, 0, 0, 100);
    stroke(color);
    beginShape();
    vertex(p1.x, p1.y);
    vertex(p2.x, p2.y);
    vertex(p3.x, p3.y);
    vertex(p4.x, p4.y);
}