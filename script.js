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

  /* ---------- Gallery main + color-swap helper ---------- */
  /* Thumbnail click-to-switch is already handled by the inline <script> at
     the bottom of index.html — deliberately not duplicating that listener
     here. This helper is only used by the color-swatch handler below. */
  var galleryMain = document.getElementById('galleryMain');
  var galleryThumbs = document.getElementById('galleryThumbs');

  function showMedia(src, type, alt) {
    if (!galleryMain) return;
    if (type === 'video') {
      galleryMain.innerHTML = '<video id="mainMedia" src="' + src + '" controls playsinline style="width:100%;height:auto;border-radius:10px;box-shadow:0 10px 30px rgba(20,20,15,0.12);"></video>';
    } else {
      galleryMain.innerHTML = '<img id="mainMedia" src="' + src + '" alt="' + (alt || 'Brigade product') + '" style="width:100%;height:auto;object-fit:contain;border-radius:10px;box-shadow:0 10px 30px rgba(20,20,15,0.12);">';
    }
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

        // Swap the main gallery image and matching thumb to this color
        var image = btn.getAttribute('data-image');
        if (image && galleryThumbs && galleryMain) {
          showMedia(image, 'image', 'Brigade Classic, ' + selectedColor);
          galleryThumbs.querySelectorAll('button').forEach(function (t) {
            t.classList.toggle('active', t.getAttribute('data-src') === image);
          });
        }
      });
    });
  }

  /* ---------- Quantity control ---------- */
  var qtyInput = document.getElementById('qtyInput');
  var qtyMinus = document.getElementById('qtyMinus');
  var qtyPlus = document.getElementById('qtyPlus');
  function clampQty(val) {
    var n = parseInt(val, 10);
    if (isNaN(n) || n < 1) n = 1;
    if (n > 10) n = 10;
    return n;
  }
  if (qtyMinus && qtyPlus && qtyInput) {
    qtyMinus.addEventListener('click', function () {
      qtyInput.value = clampQty(parseInt(qtyInput.value, 10) - 1);
    });
    qtyPlus.addEventListener('click', function () {
      qtyInput.value = clampQty(parseInt(qtyInput.value, 10) + 1);
    });
    qtyInput.addEventListener('change', function () {
      qtyInput.value = clampQty(qtyInput.value);
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
