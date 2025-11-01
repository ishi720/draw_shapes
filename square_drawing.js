// 点の位置
let points = {
    A: { x: getRandomValue(0, 600), y: getRandomValue(0, 600) },
    B: { x: getRandomValue(0, 600), y: getRandomValue(0, 600) },
    C: { x: getRandomValue(0, 600), y: getRandomValue(0, 600) },
    D: { x: getRandomValue(0, 600), y: getRandomValue(0, 600) }
};


let isClusterShowA = false;
let isClusterShowB = false;
let isClusterShowC = false;

let velocityA = { vx: getRandomValue(-5, 5), vy: getRandomValue(-5, 5) };
let velocityB = { vx: getRandomValue(-5, 5), vy: getRandomValue(-5, 5) };
let velocityC = { vx: getRandomValue(-5, 5), vy: getRandomValue(-5, 5) };
let velocityD = { vx: getRandomValue(-5, 5), vy: getRandomValue(-5, 5) };

let isDisplaying = false;

let isAutoMove = false;

let fpsCount = 0;
let isDisplayingCount = 0;

function changeAutoMove() {
    isAutoMove = !isAutoMove;
    const btn = document.getElementById('autoMoveBtn');
    btn.textContent = isAutoMove ? '▶' : '⏸';
}
function changeClusterShowA () {
    isClusterShowA = !isClusterShowA;
}
function changeClusterShowB () {
    isClusterShowB = !isClusterShowB;
}
function changeClusterShowC () {
    isClusterShowC = !isClusterShowC;
}
function update() {
    for (let key in points) {
        points[key] = parseInt(document.getElementById(key).value);
    }
}

function setup() {
    createCanvas(600, 600);
    background(50);

    Object.keys(points).forEach(key => {
        ['x', 'y'].forEach(axis => {
            let input = document.getElementById(`${key}${axis}`);
            input.value = points[key][axis];
            input.addEventListener('input', update);
        });

    });
}

function draw() {
    clear();
    background(50);
    isDisplaying = false;


    if (isAutoMove) {

        fpsCount++;

        document.getElementById("meter_ratio").textContent = (isDisplayingCount/fpsCount * 100).toFixed(2) + "%";
        document.getElementById("meter").value = (isDisplayingCount/fpsCount * 100).toFixed(2);

        // 点の位置を更新
        updatePosition(points.A, velocityA);
        updatePosition(points.B, velocityB);
        updatePosition(points.C, velocityC);
        updatePosition(points.D, velocityD);

        // 入力ボックスの値を更新
        Object.keys(points).forEach(key => {
            ['x', 'y'].forEach(axis => {
                let input = document.getElementById(`${key}${axis}`);
                input.value = points[key][axis];
            });
        });
    }

    // 点の座標をベクトルとして定義
    let A = points.A;
    let B = points.B;
    let C = points.C;
    let D = points.D;

    // 2点に接する円を定義
    let center1 = calculateMidpoint(A, B);
    let radius1 = calculateRadius(A, B);

    let center2 = calculateMidpoint(C, D);
    let radius2 = calculateRadius(C, D);

    // 垂直二等分線の交点を計算
    let perpendicular1 = calculatePerpendicularEndpoints(center1, radius1, A);
    let E = perpendicular1.p1;
    let F = perpendicular1.p2;

    let perpendicular2 = calculatePerpendicularEndpoints(center2, radius2, C);
    let G = perpendicular2.p1;
    let H = perpendicular2.p2;

    // 直線と円の第二の交点
    let nearPoint1 = findClosestPoint(center2, E, F);
    let nearPoint2 = findClosestPoint(center1, G, H);

    let { slope, intercept } = calculateSlopeAndIntercept(nearPoint1, nearPoint2);
    let I = calculateCircleLineIntersection(center1, radius1, slope, intercept, nearPoint1);
    let J = calculateCircleLineIntersection(center2, radius2, slope, intercept, nearPoint2);

    if (isClusterShowA) {
        // 円を描画
        draw_ellipse(center1, radius1, "#fff");
        draw_ellipse(center2, radius2, "#fff");

        // 直線を描画
        draw_straight_line(A, B, "#fff");
        draw_straight_line(C, D, "#fff");
        draw_straight_line(E, F, "#fff");
        draw_straight_line(G, H, "#fff");
        draw_straight_line(nearPoint1, nearPoint2, "#ff0");

        // 点とラベルを描画
        draw_point(E, "E", "#ff0");
        draw_point(F, "F", "#ff0");
        draw_point(G, "G", "#ff0");
        draw_point(H, "H", "#ff0");
    }

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
        let L = perpendicular3.p2;

        if (isClusterShowA) {
            // 円を描画
            draw_ellipse(center3, radius3, "#f0f");

            // 直線を描画
            // draw_straight_line(K, L, "#f0f");

            // 点とラベルを描画
            draw_point(I, "I", "#f0f");
            draw_point(J, "J", "#f0f");
            draw_point(K, "K", "#f0f");
            draw_point(L, "L", "#f0f");
        }

        if (
            isPointOnRectangle(A, I, K, J, L) &&
            isPointOnRectangle(B, I, K, J, L) &&
            isPointOnRectangle(C, I, K, J, L) &&
            isPointOnRectangle(D, I, K, J, L)
        ) {
            // 四角形を描画
            if (!isDisplaying) {
                isDisplaying = true;
                if (isAutoMove) {
                    isDisplayingCount++;
                }
                draw_rect(I, K, J, L, "#f00");
            }
        }
    }

    // 二つ目
    let center4 = calculateMidpoint(A, C);
    let radius4 = calculateRadius(A, C);

    let center5 = calculateMidpoint(B, D);
    let radius5 = calculateRadius(B, D);

    let perpendicular3 = calculatePerpendicularEndpoints(center4, radius4, A);
    let M = perpendicular3.p1;
    let N = perpendicular3.p2;

    let perpendicular4 = calculatePerpendicularEndpoints(center5, radius5, B);
    let O = perpendicular4.p1;
    let P = perpendicular4.p2;

    // 直線と円の第二の交点
    let nearPoint3 = findClosestPoint(center5, M, N);
    let nearPoint4 = findClosestPoint(center4, O, P);

    let aaaaa = calculateSlopeAndIntercept(nearPoint3, nearPoint4);
    let Q = calculateCircleLineIntersection(center4, radius4, aaaaa.slope, aaaaa.intercept, nearPoint3);
    let R = calculateCircleLineIntersection(center5, radius5, aaaaa.slope, aaaaa.intercept, nearPoint4);

    if (isClusterShowB) {
        draw_ellipse(center4, radius4, "#fff");
        draw_ellipse(center5, radius5, "#fff");
        draw_straight_line(nearPoint3, nearPoint4, "#ff0");
    }

    if (Q && R) {
        let eeeee = findExtremeXPoints([Q,R,N,P]);
        Q = eeeee.maxXPoint;
        R = eeeee.minXPoint;

        // 第二の交点に接する円を定義
        let center6 = calculateMidpoint(Q, R);
        let radius6 = calculateRadius(Q, R);

        // 垂直二等分線の交点を計算
        let perpendicular6 = calculatePerpendicularEndpoints(center6, radius6, Q);
        let S = perpendicular6.p1;
        let T = perpendicular6.p2;

        if (isClusterShowB) {
            // 円を描画
            draw_ellipse(center6, radius6, "#0f0");

            draw_point(M, "M", "#ff0");
            draw_point(P, "P", "#ff0");
            draw_point(O, "O", "#ff0");
            draw_point(N, "N", "#ff0");
            draw_point(Q, "Q", "#0f0");
            draw_point(R, "R", "#0f0");
            draw_point(S, "S", "#0f0");
            draw_point(T, "T", "#0f0");
        }

        if (
            isPointOnRectangle(A, Q, S, R, T) &&
            isPointOnRectangle(B, Q, S, R, T) &&
            isPointOnRectangle(C, Q, S, R, T) &&
            isPointOnRectangle(D, Q, S, R, T)
        ) {
            // 四角形を描画
            if (!isDisplaying) {
                isDisplaying = true;
                if (isAutoMove) {
                    isDisplayingCount++;
                }
                draw_rect(Q, S, R, T, "#f00");
            }

        }
    }

    // 3つ目
    let center7 = calculateMidpoint(A, D);
    let radius7 = calculateRadius(A, D);

    let center8 = calculateMidpoint(B, C);
    let radius8 = calculateRadius(B, C);

    let perpendicular5 = calculatePerpendicularEndpoints(center7, radius7, A);
    let U = perpendicular5.p1;
    let V = perpendicular5.p2;

    let perpendicular6 = calculatePerpendicularEndpoints(center8, radius8, B);
    let W = perpendicular6.p1;
    let X = perpendicular6.p2;

    // 直線と円の第二の交点
    let nearPoint5 = findClosestPoint(center5, U, V);
    let nearPoint6 = findClosestPoint(center4, W, X);

    let bbbbb = calculateSlopeAndIntercept(nearPoint5, nearPoint6);
    let Z = calculateCircleLineIntersection(center7, radius7, bbbbb.slope, bbbbb.intercept, nearPoint5);
    let AA = calculateCircleLineIntersection(center8, radius8, bbbbb.slope, bbbbb.intercept, nearPoint6);

    if (isClusterShowC) {
        draw_ellipse(center7, radius7, "#fff");
        draw_ellipse(center8, radius8, "#fff");
        draw_straight_line(nearPoint5, nearPoint6, "#ff0");
    }

    if (Z && AA) {
        let eeeee = findExtremeXPoints([Z,AA,V,X]);
        Z = eeeee.maxXPoint;
        AA = eeeee.minXPoint;

        // 第二の交点に接する円を定義
        let center9 = calculateMidpoint(Z, AA);
        let radius9 = calculateRadius(Z, AA);

        // 垂直二等分線の交点を計算
        let perpendicular9 = calculatePerpendicularEndpoints(center9, radius9, Z);
        let BB = perpendicular9.p1;
        let CC = perpendicular9.p2;

        if (isClusterShowC) {
            // 円を描画
            draw_ellipse(center9, radius9, "#00f");

            draw_point(U, "U", "#ff0");
            draw_point(V, "V", "#ff0");
            draw_point(W, "W", "#ff0");
            draw_point(X, "X", "#ff0");
            draw_point(Z, "Z", "#0f0");
            draw_point(AA, "AA", "#0f0");
            draw_point(BB, "BB", "#0f0");
            draw_point(CC, "CC", "#0f0");
        }

        if (
            isPointOnRectangle(A, Z, BB, AA, CC) &&
            isPointOnRectangle(B, Z, BB, AA, CC) &&
            isPointOnRectangle(C, Z, BB, AA, CC) &&
            isPointOnRectangle(D, Z, BB, AA, CC)
        ) {
            // 四角形を描画
            if (!isDisplaying) {
                isDisplaying = true;
                if (isAutoMove) {
                    isDisplayingCount++;
                }
                draw_rect(Z, BB, AA, CC, "#f00");
            }

        }
    }

    if (isSquare([A,B,C,D])) {
        let square = sortPointsClockwise([A,B,C,D]);
        if (!isDisplaying) {
            isDisplaying = true;
            if (isAutoMove) {
                isDisplayingCount++;
            }
            draw_rect(square[0], square[1], square[2], square[3], "#f00");
        }
    }

    // 点とラベルを描画
    draw_point(A, "A", "#f00");
    draw_point(B, "B", "#f00");
    draw_point(C, "C", "#f00");
    draw_point(D, "D", "#f00");
}

/***********************************************/
/* 計算処理                                     */
/***********************************************/

/**
 * ランダムな整数を生成
 *
 * @param {number} min - ランダムな数の最小値
 * @param {number} max - ランダムな数の最大値
 * @returns {number} - ランダムな整数
 */
function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
 *  - `slope` {number}: 直線の傾き
 *  - `intercept` {number}: y切片。直線が垂直の場合はx座標
 */
function calculateSlopeAndIntercept(p1, p2) {
    let slope = (p2.y - p1.y) / (p2.x - p1.x); // 傾きを計算
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
    let a = 1 + slope * slope;
    let b = 2 * (slope * (intercept - center.y) - center.x);
    let c =
      center.x * center.x +
      (intercept - center.y) * (intercept - center.y) -
      radius * radius;

    // 判別式
    let discriminant = b * b - 4 * a * c;
    let returnPoint = null;

    if (discriminant >= 0) {
      // 二次方程式の解の公式に基づいて交点を計算
      const intersectionPoints = calculateIntersectionPoints(a, b, discriminant, slope, intercept);
      // 交点を描画
      if (dist(intersectionPoints[0].x, intersectionPoints[0].y, point.x, point.y) > 1) {
        returnPoint = createVector(intersectionPoints[0].x, intersectionPoints[0].y);
      } else if (dist(intersectionPoints[1].x, intersectionPoints[1].y, point.x, point.y) > 1) {
        returnPoint = createVector(intersectionPoints[1].x, intersectionPoints[1].y);
      }
    }
    return returnPoint;
}

/**
 * 二次方程式の解の公式に基づいて交点を計算
 *
 * @param {number} a - 2次項の係数
 * @param {number} b - 1次項の係数
 * @param {number} discriminant - 判別式の値
 * @param {number} slope - 直線の傾き
 * @param {number} intercept - 直線の切片
 * @returns {Array<p5.Vector>} 交点の配列
 */
function calculateIntersectionPoints(a, b, discriminant, slope, intercept) {
    const sqrtDiscriminant = sqrt(discriminant);
    const x1 = (-b + sqrtDiscriminant) / (2 * a);
    const y1 = slope * x1 + intercept;
    const x2 = (-b - sqrtDiscriminant) / (2 * a);
    const y2 = slope * x2 + intercept;
    return [createVector(x1, y1), createVector(x2, y2)];
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

/**
 * 2つの点の間のユークリッド距離の2乗を計算
 *
 * @param {Object} p1 - 1つ目の点。{x, y}形式のオブジェクト。
 * @param {Object} p2 - 2つ目の点。{x, y}形式のオブジェクト。
 * @returns {number} 2つの点間の距離の2乗。
 */
function distance(p1, p2) {
    return (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
}

/**
 * 4点が正方形かどうかを判定
 *
 * @param {Object[]} points - 点の配列。各点は{x, y}形式のオブジェクト
 * @returns {boolean} 点が正方形を形成している場合はtrue、そうでない場合はfalse。
 */
function isSquare(points) {
    let distances = [];
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            distances.push(distance(points[i], points[j]));
        }
    }

    distances.sort((a, b) => a - b);
    return (
        distances[0] > 0 &&
        distances[0] === distances[1] &&
        distances[1] === distances[2] &&
        distances[2] === distances[3] &&
        distances[4] === distances[5] &&
        distances[0] * 2 === distances[4]
    );
}

/**
 * 点の配列を重心を中心に時計回りにソート
 *
 * @param {Array} points - `x`および`y`プロパティを持つ点オブジェクトの配列
 * @returns {Array} - 時計回りにソートされた点の配列
 */
function sortPointsClockwise(points) {
    // 重心を計算
    let centerX = 0, centerY = 0;
    points.forEach(p => {
        centerX += p.x;
        centerY += p.y;
    });
    centerX /= points.length;
    centerY /= points.length;

    let center = createVector(centerX, centerY);

    // 点を角度でソート
    points.sort((a, b) => {
        let angleA = Math.atan2(a.y - center.y, a.x - center.x);
        let angleB = Math.atan2(b.y - center.y, b.x - center.x);
        return angleB - angleA; // 角度が大きい順にソート（時計回り）
    });

    return points;
}

/**
 * 点の位置を更新する
 *
 * @param {Object} point - x座標とy座標を含む点オブジェクト
 * @param {Object} velocity - vxとvy成分を含む速度オブジェクト
 */
function updatePosition(point, velocity) {
    point.x += velocity.vx;
    point.y += velocity.vy;

    // 境界で跳ね返る処理
    if (point.x > width || point.x < 0) {
        velocity.vx *= -1;
    }
    if (point.y > height || point.y < 0) {
        velocity.vy *= -1;
    }
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

/**
 * 四角形を描画
 *
 * @param {p5.Vector} p1 - 頂点1の座標
 * @param {p5.Vector} p2 - 頂点2の座標
 * @param {p5.Vector} p3 - 頂点3の座標
 * @param {p5.Vector} p4 - 頂点4の座標
 * @param {p5.Vector} color - 描画する色
 */
function draw_rect(p1, p2, p3, p4, color) {
    fill(red(color), green(color), blue(color), 100);
    stroke(color);
    beginShape();
    vertex(p1.x, p1.y);
    vertex(p2.x, p2.y);
    vertex(p3.x, p3.y);
    vertex(p4.x, p4.y);
    endShape(CLOSE);
}