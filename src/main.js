(function () {
  if (typeof window === 'undefined') return;

  const href = window.location.href;        // 当前完整 URL
  const ref  = document.referrer || '';     // 上一个页面来源
  const host = window.location.hostname;    // 当前域名，比如 user.xx.com

  // 对应你 Cloudflare 里的逻辑：
  // starts_with(http.request.full_uri, "https://user.")
  // and not http.referer contains "https://www.")
  if (href.indexOf('https://user.') === 0 && ref.indexOf('https://www.') === -1) {

    // 干掉 user. 前缀，拿 root 域名
    let rootHost = host;
    if (host.indexOf('user.') === 0) {
      rootHost = host.substring('user.'.length); // user.a.com -> a.com
    }

    // 拼 www.root 域名
    // 如果你想跳裸域，就把下面这一行改成：const targetHost = rootHost;
    const targetHost = 'www.' + rootHost;

    const target =
      window.location.protocol + '//' + targetHost +
      window.location.pathname +
      window.location.search +
      window.location.hash;

    window.location.replace(target);
  }
})();




import disableDevtool from "disable-devtool";

const isProd = process.env.NODE_ENV === "production";
const enableConfigJS = process.env.VUE_APP_CONFIGJS == "true";
const enableAntiDebugging = process.env.VUE_APP_DEBUGGING == "true";

(async () => {
  try {
    if (!isProd || !enableConfigJS) {
      const res = await import('./config/index.js');
      if (typeof window !== 'undefined') {
        window.EZ_CONFIG = res.config || res.default || res;
      }
    }
    
    // 反调试逻辑
    if (isProd && enableAntiDebugging) {
      disableDevtool()
    }
    
    // ⚠️ 确保在 config 加载后再初始化应用
    await import('./appInit.js');
  } catch (error) {
    console.error(error);
  }
})();

