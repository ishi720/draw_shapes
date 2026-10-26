import { defineConfig } from 'vite';

export default defineConfig({
    // GitHub Pages のサブパス (/draw_shapes/) でも動くよう相対パスで出力
    base: './',
    build: {
        // p5.js 本体だけで約1MBあるため警告の閾値を引き上げる
        chunkSizeWarningLimit: 1200,
    },
});
