/* Weekend special flyer popup. Set ENABLED to false to hide it. */
(function () {
  var ENABLED = true;
  var IMAGE = 'assets/weekend-special-flyer.jpg';
  var STORAGE_KEY = 'hiroshi-flyer-summer10';
  var EXPIRES = '2026-08-23'; /* valid through this date, America/Los_Angeles */

  if (!ENABLED || dismissed() || expired()) return;

  var orderHref = /menu\.html/i.test(location.pathname) ? 'index.html#locations' : '#locations';
  var style = document.createElement('style');
  style.textContent =
    '#promoFlyer{position:fixed;inset:0;z-index:8000;display:grid;place-items:center;padding:1.2rem;background:rgba(10,16,28,.72);backdrop-filter:blur(6px);opacity:0;visibility:hidden;transition:opacity .35s ease,visibility .35s}' +
    '#promoFlyer.is-open{opacity:1;visibility:visible}' +
    '#promoFlyer .promo-card{position:relative;width:min(420px,92vw);max-height:min(88vh,760px);transform:translateY(18px) scale(.97);transition:transform .4s cubic-bezier(.22,1,.36,1)}' +
    '#promoFlyer.is-open .promo-card{transform:none}' +
    '#promoFlyer .promo-card a{display:block;border-radius:6px;overflow:hidden;box-shadow:0 28px 70px -20px rgba(0,0,0,.65),0 0 0 1px #c5a059}' +
    '#promoFlyer img{width:100%;height:auto;max-height:min(82vh,720px);object-fit:contain;background:#0a1a35;vertical-align:middle}' +
    '#promoFlyer .promo-close{position:absolute;top:-14px;right:-14px;width:40px;height:40px;border-radius:50%;border:1px solid #c5a059;background:#0a1a35;color:#c5a059;font-size:1.35rem;line-height:1;cursor:pointer;display:grid;place-items:center;box-shadow:0 8px 20px rgba(0,0,0,.4);z-index:2}' +
    '#promoFlyer .promo-close:hover,#promoFlyer .promo-close:focus-visible{background:#c5a059;color:#0a1a35;outline:none}' +
    'body.flyer-open{overflow:hidden}' +
    '@media(max-width:480px){#promoFlyer .promo-close{top:-10px;right:-6px}}' +
    '@media(prefers-reduced-motion:reduce){#promoFlyer,#promoFlyer .promo-card{transition:none}}';
  document.head.appendChild(style);

  var root = document.createElement('div');
  root.id = 'promoFlyer';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Weekend special: 10% off online orders with code SUMMER10');
  root.innerHTML =
    '<div class="promo-card">' +
      '<button type="button" class="promo-close" aria-label="Close flyer">&times;</button>' +
      '<a href="' + orderHref + '">' +
        '<img src="' + IMAGE + '" alt="Weekend special: get 10% off your online food order. Use code SUMMER10. Valid till 23 August 2026.">' +
      '</a>' +
    '</div>';
  document.body.appendChild(root);

  var closeBtn = root.querySelector('.promo-close');
  var flyerLink = root.querySelector('a');

  function open() {
    document.body.classList.add('flyer-open');
    root.classList.add('is-open');
    closeBtn.focus();
  }
  function close() {
    try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
    root.classList.remove('is-open');
    document.body.classList.remove('flyer-open');
  }

  closeBtn.addEventListener('click', function (e) { e.preventDefault(); close(); });
  flyerLink.addEventListener('click', close);
  root.addEventListener('click', function (e) { if (e.target === root) close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && root.classList.contains('is-open')) close();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(open, 400); });
  } else {
    setTimeout(open, 400);
  }

  function dismissed() {
    try { return sessionStorage.getItem(STORAGE_KEY) === '1'; } catch (e) { return false; }
  }
  function expired() {
    var parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Los_Angeles',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(new Date());
    var get = function (t) { return parts.find(function (p) { return p.type === t; }).value; };
    return (get('year') + '-' + get('month') + '-' + get('day')) > EXPIRES;
  }
})();
