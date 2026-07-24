(function(){
  "use strict";

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Nav solidify on scroll ---------- */
  var nav = document.querySelector('.site-nav');
  var hasHero = document.querySelector('.hero');
  function updateNav(){
    if(!nav) return;
    if(!hasHero){ nav.classList.add('no-hero'); return; }
    if(window.scrollY > 60){ nav.classList.add('is-solid'); }
    else{ nav.classList.remove('is-solid'); }
  }
  updateNav();
  window.addEventListener('scroll', updateNav, {passive:true});

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if(toggle && links){
    toggle.addEventListener('click', function(){
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded','false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Hero signature reveal ---------- */
  var hero = document.querySelector('.hero');
  if(hero){
    if(reduceMotion){
      hero.classList.add('is-revealed');
    } else {
      window.requestAnimationFrame(function(){
        setTimeout(function(){ hero.classList.add('is-revealed'); }, 150);
      });
    }
  }

  /* ---------- Scroll reveals ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-img');
  if('IntersectionObserver' in window && !reduceMotion){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.16, rootMargin:'0px 0px -6% 0px'});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('is-in'); });
  }

  /* ---------- ROVOCHÉ floating signature pill ---------- */
  var pill = document.querySelector('.rvc-pill');
  if(pill){
    var dismissed = false;
    try { dismissed = sessionStorage.getItem('rvc-pill-dismissed') === '1'; } catch(e){}
    var shown = false;
    function maybeShow(){
      if(dismissed || shown) return;
      var scrollFrac = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);
      if(scrollFrac > 0.15){
        pill.classList.add('is-visible');
        shown = true;
      }
    }
    window.addEventListener('scroll', maybeShow, {passive:true});
    setTimeout(maybeShow, 3200);
    maybeShow();

    var closeBtn = pill.querySelector('.close');
    if(closeBtn){
      closeBtn.addEventListener('click', function(){
        pill.classList.remove('is-visible');
        try { sessionStorage.setItem('rvc-pill-dismissed','1'); } catch(e){}
      });
    }
  }

  /* ---------- Portfolio filter (portfolio.html only) ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var galleryItems = document.querySelectorAll('[data-category]');
  if(filterBtns.length && galleryItems.length){
    filterBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        filterBtns.forEach(function(b){ b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var cat = btn.getAttribute('data-filter');
        galleryItems.forEach(function(item){
          var show = cat === 'all' || item.getAttribute('data-category') === cat;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Contact form (demo, no backend) ---------- */
  var form = document.querySelector('.inquiry-form');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var note = form.querySelector('.form-note');
      if(note){
        note.textContent = "Thank you. This is a concept demo, so nothing was sent. In production this form would reach the studio directly.";
        note.style.opacity = '1';
      }
      form.reset();
    });
  }
})();
