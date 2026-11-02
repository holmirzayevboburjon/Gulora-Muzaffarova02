'use strict';
const settings = window.SITE_CONFIG || {};
const timer = document.querySelector('.timer');
if (timer) {
  const deadline = Date.now() + 50000;
  const render = () => {
    const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    timer.textContent = `00:${String(seconds).padStart(2, '0')}`;
    if (!seconds) clearInterval(interval);
  };
  const interval = setInterval(render, 200);
  render();
}
// Main buttons open Telegram directly; no registration form or API request.
document.querySelectorAll('.register').forEach(button => {
  button.addEventListener('click', () => {
    let destination;
    try {
      destination = new URL(settings.telegramUrl);
      if (destination.protocol !== 'https:' || !['t.me', 'telegram.me'].includes(destination.hostname) || destination.pathname.length < 2) return;
    } catch { return; }
    try {
      if (typeof window.fbq === 'function') window.fbq('trackCustom', 'Lead_02', {
        action: 'telegram_click', position: button.classList.contains('bottom') ? 'bottom' : 'top'
      });
    } catch {}
    window.location.assign(destination.href);
  });
});
const telegram = document.querySelector('#telegram');
if (telegram) {
  let valid = false;
  try {
    const url = new URL(settings.telegramUrl);
    valid = url.protocol === 'https:' && ['t.me', 'telegram.me'].includes(url.hostname) && url.pathname.length > 1;
    if (valid) {
      telegram.href = url.href;
      // Keep the confirmation page and lead tracking before opening Telegram.
      setTimeout(() => window.location.assign(url.href), 1000);
    }
  } catch {}
  if (!valid) telegram.addEventListener('click', event => {
    event.preventDefault(); document.querySelector('.telegram-error').hidden = false;
  });
}
