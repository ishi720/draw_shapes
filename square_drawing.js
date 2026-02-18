// 点の位置
let points = {
    A: { x: getRandomValue(0, 600), y: getRandomValue(0, 600) },
    B: { x: getRandomValue(0, 600), y: getRandomValue(0, 600) },
    C: { x: getRandomValue(0, 600), y: getRandomValue(0, 600) },
    D: { x: getRandomValue(0, 600), y: getRandomValue(0, 600) }
};


let isClusterShow = { A: false, B: false, C: false };

let velocities = {
    A: { vx: getRandomValue(-5, 5), vy: getRandomValue(-5, 5) },
    B: { vx: getRandomValue(-5, 5), vy: getRandomValue(-5, 5) },
    C: { vx: getRandomValue(-5, 5), vy: getRandomValue(-5, 5) },
    D: { vx: getRandomValue(-5, 5), vy: getRandomValue(-5, 5) }
};

let isDisplaying = false;

let isAutoMove = false;

let fpsCount = 0;
let isDisplayingCount = 0;

function changeAutoMove() {
    isAutoMove = !isAutoMove;
    const btn = document.getElementById('autoMoveBtn');
    btn.textContent = isAutoMove ? '▶' : '⏸';
}
function changeClusterShow(key) {
    isClusterShow[key] = !isClusterShow[key];
}
function update() {
    for (let key in points) {
        points[key].x = parseInt(document.getElementById(`${key}x`).value);
        points[key].y = parseInt(document.getElementById(`${key}y`).value);
    }
}

function setup() {
    let canvas = createCanvas(600, 600);
    canvas.parent('canvas-container');
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
        Object.keys(points).forEach(key => {
            updatePosition(points[key], velocities[key]);
        });

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

    // 3通りのペアの組み合わせから正方形を探索
    tryFindSquareFromPairs(A, B, C, D, isClusterShow.A, "#f0f");
    tryFindSquareFromPairs(A, C, B, D, isClusterShow.B, "#0f0");
    tryFindSquareFromPairs(A, D, B, C, isClusterShow.C, "#00f");

    if (isSquare([A,B,C,D])) {
        let square = sortPointsClockwise([A,B,C,D]);
        tryDisplayRect(square[0], square[1], square[2], square[3]);
    }

    // 点とラベルを描画
    Object.entries(points).forEach(([key, p]) => draw_point(p, key, "#f00"));
}

/**
 * 2つの点ペアから正方形の頂点を探索し、見つかれば描画する
 *
 * @param {p5.Vector} pair1a - ペア1の1つ目の点
 * @param {p5.Vector} pair1b - ペア1の2つ目の点
 * @param {p5.Vector} pair2a - ペア2の1つ目の点
 * @param {p5.Vector} pair2b - ペア2の2つ目の点
 * @param {boolean} isClusterShow - デバッグ描画を表示するかどうか
 * @param {string} debugColor - デバッグ描画の色
 */
function tryFindSquareFromPairs(pair1a, pair1b, pair2a, pair2b, isClusterShow, debugColor) {
    // 2点に接する円を定義
    let center1 = calculateMidpoint(pair1a, pair1b);
    let radius1 = calculateRadius(pair1a, pair1b);

    let center2 = calculateMidpoint(pair2a, pair2b);
    let radius2 = calculateRadius(pair2a, pair2b);

    // 垂直二等分線の端点を計算
    let perp1 = calculatePerpendicularEndpoints(center1, radius1, pair1a);
    let perp2 = calculatePerpendicularEndpoints(center2, radius2, pair2a);

    // 直線と円の第二の交点
    let nearPoint1 = findClosestPoint(center2, perp1.p1, perp1.p2);
    let nearPoint2 = findClosestPoint(center1, perp2.p1, perp2.p2);

    let { slope, intercept } = calculateSlopeAndIntercept(nearPoint1, nearPoint2);
    let intersect1 = calculateCircleLineIntersection(center1, radius1, slope, intercept, nearPoint1);
    let intersect2 = calculateCircleLineIntersection(center2, radius2, slope, intercept, nearPoint2);

    if (isClusterShow) {
        draw_ellipse(center1, radius1, "#fff");
        draw_ellipse(center2, radius2, "#fff");
        draw_straight_line(pair1a, pair1b, "#fff");
        draw_straight_line(pair2a, pair2b, "#fff");
        draw_straight_line(perp1.p1, perp1.p2, "#fff");
        draw_straight_line(perp2.p1, perp2.p2, "#fff");
        draw_straight_line(nearPoint1, nearPoint2, "#ff0");
        draw_point(perp1.p1, "", "#ff0");
        draw_point(perp1.p2, "", "#ff0");
        draw_point(perp2.p1, "", "#ff0");
        draw_point(perp2.p2, "", "#ff0");
    }

    if (intersect1 && intersect2) {
        let { minXPoint, maxXPoint } = findExtremeXPoints([intersect1, intersect2, perp1.p2, perp2.p2]);
        intersect1 = maxXPoint;
        intersect2 = minXPoint;

        // 第二の交点に接する円を定義
        let center3 = calculateMidpoint(intersect1, intersect2);
        let radius3 = calculateRadius(intersect1, intersect2);

        // 垂直二等分線の交点を計算
        let perp3 = calculatePerpendicularEndpoints(center3, radius3, intersect1);

        if (isClusterShow) {
            draw_ellipse(center3, radius3, debugColor);
            draw_point(intersect1, "", debugColor);
            draw_point(intersect2, "", debugColor);
            draw_point(perp3.p1, "", debugColor);
            draw_point(perp3.p2, "", debugColor);
        }

        if (Object.values(points).every(p =>
            isPointOnRectangle(p, intersect1, perp3.p1, intersect2, perp3.p2)
        )) {
            tryDisplayRect(intersect1, perp3.p1, intersect2, perp3.p2);
        }
    }
}

/**
 * 正方形が未表示なら描画し、表示フラグを更新する
 *
 * @param {p5.Vector} p1 - 頂点1
 * @param {p5.Vector} p2 - 頂点2
 * @param {p5.Vector} p3 - 頂点3
 * @param {p5.Vector} p4 - 頂点4
 */
function tryDisplayRect(p1, p2, p3, p4) {
    if (!isDisplaying) {
        isDisplaying = true;
        if (isAutoMove) {
            isDisplayingCount++;
        }
        draw_rect(p1, p2, p3, p4, "#f00");
    }
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
function distanceSquared(p1, p2) {
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
            distances.push(distanceSquared(points[i], points[j]));
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