# Mechanical Sketcher

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/d846f638dabb4be38b2ca0a05ab78eaf)](https://app.codacy.com/gh/ishi720/mechanical-sketcher/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 概要

リンク機構の軌道を描画・シミュレーションするWebアプリケーションです。
2つの回転アームと複数のリンクで構成された機構が動作し、ペン先が描く軌跡（スピログラフのようなパターン）をリアルタイムで可視化できます。

## デモ

[GitHub Pages で試す](https://ishi720.github.io/mechanical-sketcher/)

## 画面イメージ

![image](https://github.com/user-attachments/assets/8a1bbf38-3480-455b-adc2-5a0c08b2800d)

## 機能

- **リンク機構のアニメーション**: 2つの回転アームとリンクで構成された機構をリアルタイムで描画
- **軌跡の可視化**: ペン先が描く軌道を自動的に記録・表示
- **メカニズム表示切替**: 機構の表示/非表示を切り替えて軌道のみを確認可能
- **軌道の色変更**: カラーピッカーで軌道の色をカスタマイズ
- **回転方向の制御**: 左右それぞれのアームの回転方向を反転可能
- **速度調整**: 左右アームの回転速度を個別に調整（0〜10）
- **回転中心のドラッグ移動**: 回転軸の位置をドラッグで変更可能
- **可達範囲の表示**: ドラッグ中に機構が成立する範囲を視覚的に表示

## 使い方

1. デモページを開く（ローカルの場合は `npm run dev`）
2. アニメーションが自動的に開始され、軌跡が描画されます
3. 左側のコントロールパネルで各種設定を調整：
   - **メカニズム表示**: チェックボックスで機構の表示/非表示を切替
   - **軌道の色**: カラーピッカーで軌跡の色を変更
   - **回転制御**: ボタンで左右アームの回転方向を反転
   - **速度調整**: スライダーで回転速度を調整
4. キャンバス上の回転中心（ねじマーク）をドラッグすると、機構の配置を変更できます

## 技術スタック

| 技術 | 用途 |
|------|------|
| HTML5 | ページ構造 |
| CSS3 | スタイリング |
| JavaScript (ES6+) | アプリケーションロジック |
| [p5.js](https://p5js.org/) | キャンバス描画・アニメーション |
| [Vite](https://vite.dev/) | 開発サーバー・ビルド |

## ファイル構成

```
mechanical-sketcher/
├── .github/workflows/deploy.yml  # GitHub Pages デプロイ
├── public/favicon.ico            # ファビコン
├── index.html                    # メインHTMLファイル
├── sketch.js                     # p5.jsによる描画・機構ロジック
├── operation.js                  # UIコントロールのイベント処理
├── styles.css                    # スタイルシート
├── vite.config.js                # Vite設定
├── package.json
├── LICENSE                       # MITライセンス
└── README.md                     # このファイル
```

## ローカルでの実行

```bash
git clone https://github.com/ishi720/mechanical-sketcher.git
cd mechanical-sketcher
npm install
npm run dev      # 開発サーバー起動
npm run build    # dist/ にビルド
npm run preview  # ビルド結果の確認
```

## ライセンス

[MIT License](LICENSE)
