import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
    // GitHub Pages のサブパス (/draw_shapes/) でも動くよう相対パスで出力
    base: './',
    // 本番ビルドでは p5.js の Friendly Error System の翻訳読み込みを無効化する
    // (無効化しないと翻訳データを CDN から取得し終えるまで p5 が起動しない)
    define: command === 'build' ? { IS_MINIFIED: 'true' } : {},
    build: {
        // p5.js 本体だけで約1MBあるため警告の閾値を引き上げる
        chunkSizeWarningLimit: 1200,
    },
}));
