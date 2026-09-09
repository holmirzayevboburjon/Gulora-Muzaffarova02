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
const dialog = document.querySelector('#registration');
if (dialog) {
  document.querySelectorAll('.register').forEach(button => button.addEventListener('click', () => dialog.showModal()));
  dialog.querySelector('.close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  const form = document.querySelector('#lead-form');
  let requestId = '';
  let submittedValues = '';
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const error = document.querySelector('#form-error');
    const submit = form.querySelector('[type=submit]');
    if (submit.disabled) return;
    error.textContent = '';
    const name = form.elements.name.value.trim();
    const phone = form.elements.phone.value.replace(/[\s()-]/g, '');
    if (name.length < 2 || !/^\+?\d{9,15}$/.test(phone)) {
      error.textContent = 'Ismingiz va telefon raqamingizni to‘liq kiriting.';
      return;
    }
    submit.disabled = true;
    submit.textContent = 'Yuborilmoqda…';
    try {
      const values = JSON.stringify({name, phone});
      if (!requestId || values !== submittedValues) {
        requestId = crypto.randomUUID();
        submittedValues = values;
      }
      const response = await fetch(settings.registrationEndpoint || '/api/register', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, phone, variant: '02', requestId}), signal: AbortSignal.timeout(15000)
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error('Registration failed');
      window.location.assign('thank-you.html');
    } catch {
      error.textContent = 'Ma’lumot yuborilmadi. Iltimos, keyinroq qayta urinib ko‘ring.';
      submit.disabled = false;
      submit.textContent = 'Ro‘yxatdan o‘tish';
    }
  });
}
const telegram = document.querySelector('#telegram');
if (telegram) {
  let valid = false;
  try {
    const url = new URL(settings.telegramUrl);
    valid = url.protocol === 'https:' && ['t.me', 'telegram.me'].includes(url.hostname) && url.pathname.length > 1;
    if (valid) telegram.href = url.href;
  } catch {}
  if (!valid) telegram.addEventListener('click', event => {
    event.preventDefault(); document.querySelector('.telegram-error').hidden = false;
  });
}
