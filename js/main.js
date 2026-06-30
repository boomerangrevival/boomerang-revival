/* =============================================================
   BOOMERANG REVIVAL — Site interactions
   -------------------------------------------------------------
   - Sticky nav shadow on scroll
   - Mobile nav toggle
   - Scroll-reveal (IntersectionObserver, with stagger)
   - FAQ accordion
   - Contact form validation + submit (Formspree-ready)
   ============================================================= */
(function () {
  'use strict';

  /* ---------- 1. Sticky nav: add shadow/solid bg after scroll ---------- */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- 2. Mobile nav toggle ---------- */
  var toggle = document.querySelector('.nav__toggle');
  var links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    // Close the menu when a link is tapped
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- 3. Scroll-reveal animations ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(function (el) {
      // Cascade siblings that share a parent: delay each by its position in the group
      if (el.hasAttribute('data-stagger') && el.parentNode) {
        var group = Array.prototype.filter.call(el.parentNode.children, function (c) {
          return c.nodeType === 1 && c.hasAttribute('data-stagger');
        });
        var idx = group.indexOf(el);
        if (idx > 0) el.style.setProperty('--d', (idx * 0.12).toFixed(2) + 's');
      }
      io.observe(el);
    });
  } else {
    // Fallback: just show everything
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- 3b. Scroll parallax for decorative layers ---------- */
  // Any element with data-parallax="0.3" drifts at that fraction of scroll speed.
  // Uses transform only + rAF batching, so it stays smooth. Skipped if the user
  // prefers reduced motion.
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length && !prefersReduced) {
    var ticking = false;
    var updateParallax = function () {
      var vh = window.innerHeight;
      parallaxEls.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        // How far this element's center is from the viewport center, normalized
        var offset = (rect.top + rect.height / 2 - vh / 2) / vh;
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.2;
        el.style.transform = 'translate3d(0,' + (offset * speed * -140).toFixed(1) + 'px,0)';
      });
      ticking = false;
    };
    var requestParallax = function () {
      if (!ticking) { ticking = true; requestAnimationFrame(updateParallax); }
    };
    window.addEventListener('scroll', requestParallax, { passive: true });
    window.addEventListener('resize', requestParallax);
    updateParallax();
  }

  /* ---------- 4. FAQ accordion ---------- */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', String(!expanded));
      if (panel) {
        panel.style.maxHeight = expanded ? null : panel.scrollHeight + 'px';
      }
    });
  });

  /* ---------- 5. Contact form ---------- */
  var form = document.querySelector('#contact-form');
  if (form) {
    var status = form.querySelector('.form-status');

    var showFieldError = function (field, msg) {
      var wrap = field.closest('.field');
      wrap.classList.add('has-error');
      var err = wrap.querySelector('.error');
      if (err) err.textContent = msg;
    };
    var clearFieldError = function (field) {
      field.closest('.field').classList.remove('has-error');
    };

    var validate = function () {
      var ok = true;
      form.querySelectorAll('input, textarea').forEach(function (f) {
        if (!f.hasAttribute('required') && !f.value) return;
        clearFieldError(f);
        if (f.validity.valueMissing) {
          showFieldError(f, 'This field is required.');
          ok = false;
        } else if (f.type === 'email' && f.validity.typeMismatch) {
          showFieldError(f, 'Please enter a valid email address.');
          ok = false;
        } else if (f.type === 'tel' && f.value && !/[\d]{7,}/.test(f.value.replace(/\D/g, ''))) {
          showFieldError(f, 'Please enter a valid phone number.');
          ok = false;
        }
      });
      return ok;
    };

    // Clear an error as soon as the user fixes the field
    form.querySelectorAll('input, textarea').forEach(function (f) {
      f.addEventListener('input', function () { clearFieldError(f); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (status) status.className = 'form-status';
      if (!validate()) return;

      var btn = form.querySelector('button[type="submit"]');
      var original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Sending…';

      var action = form.getAttribute('action') || '';

      // ----------------------------------------------------------------
      // DELIVERY: If you've set a real Formspree (or other) endpoint in
      // the form's `action`, we POST to it. Otherwise we simulate success
      // so the demo works out of the box. See README → "Wire up the form".
      // ----------------------------------------------------------------
      var isPlaceholder = !action || action.indexOf('YOUR_FORM_ID') !== -1;

      var done = function (success) {
        btn.disabled = false;
        btn.innerHTML = original;
        if (success) {
          form.reset();
          if (status) {
            status.className = 'form-status is-success';
            status.textContent = "Thanks — your request is in. We'll reach out within one business day to set up your free reactivation audit.";
          }
        } else if (status) {
          status.className = 'form-status is-error';
          status.textContent = 'Something went wrong sending your message. Please email us directly at boomerangrevival@gmail.com.';
        }
      };

      if (isPlaceholder) {
        // Demo mode — no real endpoint configured yet.
        setTimeout(function () { done(true); }, 900);
        return;
      }

      fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (res) { done(res.ok); })
        .catch(function () { done(false); });
    });
  }

  /* ---------- 6. Footer year ---------- */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
