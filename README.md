# draw_shapes

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/ffd5d53388fd46dbb2786b085d622f09)](https://app.codacy.com/gh/ishi720/draw_shapes/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

## 概要

4つの任意の点を通る正方形を見つけて描画するインタラクティブなWebアプリケーションです。計算幾何学のアルゴリズムを使用し、キャンバス上の4点すべてを辺上に持つ正方形をリアルタイムで探索・可視化します。

|Before|After|
|-|-|
|![draw_shapes_sample_before](https://github.com/user-attachments/assets/edafe708-094d-48bb-9e2e-d5aa9c63528f)|![draw_shapes_sample](https://github.com/user-attachments/assets/3ae4c59a-432b-47dc-8914-179fc9cf4927)|

## 機能

- **正方形の自動探索** - 3つの異なるアルゴリズム（点の組み合わせ AB-CD / AC-BD / AD-BC）で正方形を探索
- **アニメーション** - 再生/停止ボタンで4つの点を自動的に移動させ、リアルタイムで正方形を計算
- **構築過程の可視化** - チェックボックスで幾何学的な計算過程（円、直線、中間点）を表示
- **生成率メーター** - 正方形が見つかったフレームの割合をプログレスバーで表示

## 技術スタック

- [p5.js](https://p5js.org/) v1.6.0
- HTML / CSS / JavaScript

## 使い方

### ブラウザで開く

`index.html` をブラウザで直接開くか、ローカルサーバーを使用します。

```bash
# Python
python -m http.server 8000

# Node.js
npx http-server
```

### 操作方法

1. **再生/停止ボタン** - 点の自動移動を切り替え
2. **チェックボックス** - 各点の組み合わせによる計算過程の表示/非表示を切り替え
3. **生成率メーター** - 正方形が見つかった割合を確認

## プロジェクト構成

```
draw_shapes/
├── index.html              # メインHTML（UI・コントロール）
├── square_drawing.js       # アプリケーションロジック（幾何学計算・描画）
├── style.css               # スタイルシート
└── README.md
```

## アルゴリズム

4点を通る正方形を見つけるために、以下の手順を3つの点の組み合わせに対して実行します。

1. 2点を直径とする円を作成
2. 垂直二等分線を計算
3. 円と直線の交点を求める
4. 得られた矩形の辺上に4点すべてが乗るかを検証
