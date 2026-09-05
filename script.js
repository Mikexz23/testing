(() => {
  const screens = [...document.querySelectorAll('.screen')];
  const caption = document.querySelector('.screen-caption');
  const labels = {
    splash: '01 · 开机',
    home: '02 · 首页',
    login: '03 · 登录',
    overview: '04 · 账户总览',
    deposits: '05 · 我的存单'
  };

  let current = 'splash';
  let splashTimer;

  function showScreen(name, addHistory = true) {
    const next = screens.find((screen) => screen.dataset.screen === name);
    if (!next) return;

    current = name;
    screens.forEach((screen) => {
      const active = screen === next;
      screen.classList.toggle('is-active', active);
      screen.setAttribute('aria-hidden', String(!active));
    });
    caption.textContent = labels[name];

    if (addHistory) {
      history.pushState({ screen: name }, '', `#${name}`);
    }
  }

  function goHomeAfterSplash() {
    if (current === 'splash') showScreen('home');
  }

  document.querySelectorAll('[data-go]').forEach((button) => {
    button.addEventListener('click', () => {
      window.clearTimeout(splashTimer);
      showScreen(button.dataset.go);
    });
  });

  window.addEventListener('popstate', (event) => {
    showScreen(event.state?.screen || 'home', false);
  });

  const hashScreen = window.location.hash.slice(1);
  if (labels[hashScreen]) {
    showScreen(hashScreen, false);
  } else {
    splashTimer = window.setTimeout(goHomeAfterSplash, 1600);
  }
})();
