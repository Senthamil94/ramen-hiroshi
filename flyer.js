/* Weekend special flyer popup. Set ENABLED to false to hide it. */
(function () {
  var ENABLED = true;
  var STORAGE_KEY = 'hiroshi-flyer-summer10-v2';
  var EXPIRES = '2026-08-23';

  var root = document.getElementById('promoFlyer');
  if (!root || !ENABLED || dismissed() || expired()) {
    if (root) root.classList.remove('is-open');
    return;
  }

  var closeBtn = root.querySelector('.promo-close');
  var flyerLink = root.querySelector('.promo-link');

  function open() {
    document.body.classList.add('flyer-open');
    root.classList.add('is-open');
    if (closeBtn) closeBtn.focus();
  }
  function close() {
    try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
    root.classList.remove('is-open');
    document.body.classList.remove('flyer-open');
  }

  if (closeBtn) closeBtn.addEventListener('click', function (e) { e.preventDefault(); close(); });
  if (flyerLink) flyerLink.addEventListener('click', close);
  root.addEventListener('click', function (e) { if (e.target === root) close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && root.classList.contains('is-open')) close();
  });

  open();

  function dismissed() {
    try { return sessionStorage.getItem(STORAGE_KEY) === '1'; } catch (e) { return false; }
  }
  function expired() {
    try {
      var parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Los_Angeles',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).formatToParts(new Date());
      var get = function (t) {
        var p = parts.find(function (x) { return x.type === t; });
        return p ? p.value : '00';
      };
      return (get('year') + '-' + get('month') + '-' + get('day')) > EXPIRES;
    } catch (e) {
      return false;
    }
  }
})();
