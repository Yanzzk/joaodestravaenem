(() => {
  const c = window.LP_CONFIG;
  const dialog = document.getElementById('config-message');
  document.getElementById('close-message').addEventListener('click', () => dialog.close());
  function bind(link, value) {
    try { const u = new URL(value); if (u.protocol === 'https:') { link.href=u.href; link.rel='noreferrer noopener'; return; } } catch {}
    link.addEventListener('click', event => { event.preventDefault(); dialog.showModal(); });
  }
  document.querySelectorAll('[data-checkout]').forEach(link => bind(link, c.checkoutUrl));
  document.querySelectorAll('[data-legal]').forEach((link,i) => bind(link,i===0?c.termsUrl:c.privacyUrl));
})();
