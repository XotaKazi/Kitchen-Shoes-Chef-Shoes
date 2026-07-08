(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Toast ---------- */
  var toastEl = document.getElementById('toast');
  var toastTimer = null;
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('show');
    }, 2600);
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Shift timeline fill animation ---------- */
  var shiftFill = document.getElementById('shiftFill');
  var shiftLine = document.querySelector('.shift-line');
  if (shiftFill && shiftLine && 'IntersectionObserver' in window) {
    var shiftIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          shiftFill.style.width = '100%';
          shiftIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    shiftIO.observe(shiftLine);
  } else if (shiftFill) {
    shiftFill.style.width = '100%';
  }

  /* ---------- Gallery thumbs ---------- */
  var galleryMain = document.getElementById('galleryMain');
  var galleryThumbs = document.getElementById('galleryThumbs');
  var galleryViews = {
    0: galleryMain ? galleryMain.querySelector('svg').outerHTML : null
  };

  var viewMarkup = {
    0: '<svg viewBox="0 0 520 320" aria-label="Stride chef shoe, side view" role="img"><path d="M40 210 C40 150 95 95 175 80 C215 72 250 78 275 95 C300 78 340 72 380 90 C430 112 470 150 480 195 C486 220 480 240 455 248 L90 248 C60 248 40 232 40 210 Z" fill="#14140F"/><path d="M175 80 C215 72 250 78 275 95 C300 78 340 72 380 90 C400 99 418 112 432 128 L230 128 C210 108 190 92 175 80 Z" fill="#232320"/><path d="M90 248 L455 248 C468 248 478 256 480 268 C482 282 472 292 456 292 L74 292 C58 292 46 282 48 268 C50 256 60 248 74 248 Z" fill="#FF5A1F"/><g stroke="#F7F6F2" stroke-opacity="0.5" stroke-width="2"><line x1="90" y1="264" x2="456" y2="264"/><line x1="90" y1="278" x2="456" y2="278"/></g></svg>',
    1: '<svg viewBox="0 0 520 320" aria-label="Stride chef shoe, top view" role="img"><ellipse cx="260" cy="170" rx="200" ry="110" fill="#14140F"/><ellipse cx="260" cy="170" rx="120" ry="62" fill="#232320"/><circle cx="220" cy="140" r="6" fill="#F7F6F2"/><circle cx="260" cy="128" r="6" fill="#F7F6F2"/><circle cx="300" cy="140" r="6" fill="#F7F6F2"/><path d="M220 140 L300 140" stroke="#F7F6F2" stroke-width="3" fill="none"/><ellipse cx="260" cy="170" rx="200" ry="110" fill="none" stroke="#FF5A1F" stroke-width="3" stroke-dasharray="2 10" opacity="0.5"/></svg>',
    2: '<svg viewBox="0 0 520 320" aria-label="Stride chef shoe, sole tread view" role="img"><rect x="70" y="30" width="380" height="260" rx="110" fill="#FF5A1F"/><g stroke="#14140F" stroke-width="6" stroke-linecap="round"><path d="M110 80 L160 130"/><path d="M140 60 L200 120"/><path d="M110 240 L160 190"/><path d="M140 260 L200 200"/><path d="M320 70 L380 130"/><path d="M320 250 L380 190"/><path d="M230 90 L230 230"/><path d="M270 90 L270 230"/></g></svg>',
    3: '<svg viewBox="0 0 520 320" aria-label="Stride chef shoe, heel detail view" role="img"><rect x="60" y="40" width="400" height="240" rx="24" fill="#232320"/><circle cx="220" cy="160" r="60" fill="none" stroke="#FF5A1F" stroke-width="10"/><circle cx="220" cy="160" r="16" fill="#F7F6F2"/><path d="M320 100 L400 100 M320 140 L400 140 M320 180 L400 180 M320 220 L400 220" stroke="#8B8B85" stroke-width="4"/></svg>'
  };

  if (galleryThumbs && galleryMain) {
    galleryThumbs.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        galleryThumbs.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var view = btn.getAttribute('data-view');
        if (viewMarkup[view]) {
          galleryMain.innerHTML = viewMarkup[view];
        }
      });
    });
  }

  /* ---------- Size selection ---------- */
  var sizeGrid = document.getElementById('sizeGrid');
  var selectedSize = '8';
  if (sizeGrid) {
    sizeGrid.querySelectorAll('button:not([disabled])').forEach(function (btn) {
      btn.addEventListener('click', function () {
        sizeGrid.querySelectorAll('button').forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        selectedSize = btn.getAttribute('data-size');
      });
    });
  }

  /* ---------- Color selection ---------- */
  var colorGrid = document.getElementById('colorGrid');
  var selectedColor = 'Kitchen Black';
  if (colorGrid) {
    colorGrid.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        colorGrid.querySelectorAll('button').forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        selectedColor = btn.getAttribute('data-color');
      });
    });
  }

  /* ---------- Quantity control ---------- */
  var qtyInput = document.getElementById('qtyInput');
  var qtyMinus = document.getElementById('qtyMinus');
  var qtyPlus = document.getElementById('qtyPlus');
  var paypalQty = document.getElementById('paypalQty');

  function clampQty(val) {
    var n = parseInt(val, 10);
    if (isNaN(n) || n < 1) n = 1;
    if (n > 10) n = 10;
    return n;
  }
  function syncQty() {
    if (paypalQty && qtyInput) paypalQty.value = qtyInput.value;
  }
  if (qtyMinus && qtyPlus && qtyInput) {
    qtyMinus.addEventListener('click', function () {
      qtyInput.value = clampQty(parseInt(qtyInput.value, 10) - 1);
      syncQty();
    });
    qtyPlus.addEventListener('click', function () {
      qtyInput.value = clampQty(parseInt(qtyInput.value, 10) + 1);
      syncQty();
    });
    qtyInput.addEventListener('change', function () {
      qtyInput.value = clampQty(qtyInput.value);
      syncQty();
    });
  }

  /* ---------- PayPal form: attach chosen size/color as item name ---------- */
  var paypalForm = document.getElementById('paypalForm');
  if (paypalForm) {
    paypalForm.addEventListener('submit', function () {
      var itemNameInput = paypalForm.querySelector('input[name="item_name"]');
      if (itemNameInput) {
        itemNameInput.value = 'Stride Classic Chef Shoe — Size ' + selectedSize + ', ' + selectedColor;
      }
    });
  }

  /* ---------- Add to cart (static site placeholder) ---------- */
  var addCartBtn = document.getElementById('addCartBtn');
  if (addCartBtn) {
    addCartBtn.addEventListener('click', function () {
      showToast('Added to cart — Size ' + selectedSize + ', ' + selectedColor);
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
          openItem.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove('open');
        q.setAttribute('aria-expanded', 'false');
        a.style.maxHeight = null;
      } else {
        item.classList.add('open');
        q.setAttribute('aria-expanded', 'true');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

})();
