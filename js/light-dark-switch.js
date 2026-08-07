// 亮/暗模式切换 (Vivia 原版) + Giscus 评论主题同步
function syncGiscusTheme() {
    let root = document.documentElement;
    let theme = root.getAttribute('theme') || 'dark';
    // 必须用完整 URL: giscus 在自身 iframe 内加载主题, 相对路径会解析到 giscus.app 域导致 404
    let base = location.origin;
    let giscusTheme = theme === 'dark'
        ? base + '/giscus/giscus-dark.css'
        : base + '/giscus/giscus-light.css';
    let frame = document.querySelector('iframe.giscus-frame');
    if (frame && frame.contentWindow) {
        frame.contentWindow.postMessage(
            { giscus: { setConfig: { theme: giscusTheme } } },
            'https://giscus.app'
        );
    }
}

let themeFunc = async function() {
    let btn = document.getElementById("daynight-btn");
    let root = document.documentElement;
    if (!btn) return;
    btn.addEventListener('click', e => {
        if (root.getAttribute('theme') == 'dark') {
            root.setAttribute('theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            root.setAttribute('theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
        syncGiscusTheme();
    });
};
themeFunc();

// 页面加载后轮询等待 Giscus iframe 出现, 同步主题 (最多 30 秒)
let tries = 0;
let giscusTimer = setInterval(function() {
    syncGiscusTheme();
    if (++tries > 15) clearInterval(giscusTimer);
}, 2000);
