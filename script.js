// v1.3 – فونت دکمه‌ها، شمارنده‌ها، انیمیشن تغییر تم، ریویل اسکرول
(function(){
  const root = document.documentElement;

  // Theme persistence
  const saved = localStorage.getItem('theme');
  if (saved) root.setAttribute('data-theme', saved);
  else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    root.setAttribute('data-theme', 'dark');
  }

  // Theme toggle + spin icon
  const themeToggle = document.getElementById('themeToggle');
  const setIcon = () => {
    const isDark = (root.getAttribute('data-theme') === 'dark');
    themeToggle.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    themeToggle.setAttribute('aria-label', isDark ? 'تغییر به تم روشن' : 'تغییر به تم تاریک');
  };
  setIcon();
  themeToggle?.addEventListener('click', () => {
    const next = (root.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    themeToggle.classList.add('spin'); // انیمیشن آیکن
    setIcon();
    setTimeout(()=>themeToggle.classList.remove('spin'), 600);
  });

  // Header background on scroll
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    header.style.background = window.scrollY > 20
      ? 'linear-gradient(to bottom, rgba(11,18,32,.92), rgba(11,18,32,.75))'
      : 'linear-gradient(to bottom, rgba(11,18,32,.70), rgba(11,18,32,.25))';
    header.style.transform = window.scrollY > 10 ? 'translateY(-2px)' : 'translateY(0)';
  });

  // Mobile menu
  const hamburger = document.querySelector('.hamburger');
  let panel = null;
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      if (!panel) {
        panel = document.createElement('div');
        panel.className = 'mobile-menu';
        panel.innerHTML = `
          <a href="#destinations">مقاصد</a>
          <a href="#tours">تورهای ویژه</a>
          <a href="#blog">مجله سفر</a>
          <a href="#contact">تماس</a>
        `;
        document.body.appendChild(panel);
      }
      hamburger.classList.toggle('active');
      panel.classList.toggle('open');
    });
  }

  // Chips -> fill destination
  const chips = document.querySelectorAll('.chip');
  const qDest = document.getElementById('qDest');
  chips.forEach(ch => ch.addEventListener('click', () => { if (qDest) qDest.value = ch.textContent.trim(); }));

  // Date min=today
  const qDate = document.getElementById('qDate');
  if (qDate) { qDate.min = new Date().toISOString().split('T')[0]; }

  // Search submit
  const searchForm = document.getElementById('searchForm');
  searchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const people = document.getElementById('qPeople')?.value || '';
    alert(`جستجو: ${qDest?.value || ''} - ${qDate?.value || ''} - ${people} نفر`);
  });

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  const ioReveal = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        ioReveal.unobserve(e.target);
      }
    });
  }, {threshold:.2});
  revealEls.forEach(el => ioReveal.observe(el));

  // Animated counters (robust – هر عدد جداگانه پایش می‌شود)
  const prefersReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nums = document.querySelectorAll('.num');
  const started = new WeakSet();
  function runCounter(el){
    if (started.has(el)) return;
    started.add(el);
    const target = +el.dataset.target || 0;
    if (prefersReduce) { el.textContent = target.toLocaleString('fa-IR'); return; }
    const dur = 1200;
    const startTime = performance.now();
    function easeInOut(t){ return t<.5 ? 2*t*t : -1+(4-2*t)*t; }
    function tick(now){
      const p = Math.min((now - startTime)/dur, 1);
      const v = Math.round(target * easeInOut(p));
      el.textContent = v.toLocaleString('fa-IR');
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const ioNums = new IntersectionObserver((entries)=>{
    entries.forEach(ent=>{ if(ent.isIntersecting) runCounter(ent.target); });
  }, {threshold:.2, rootMargin:"0px 0px -10% 0px"});
  nums.forEach(n=>ioNums.observe(n));

  // If already in view on load (fallback)
  window.addEventListener('load', () => {
    nums.forEach(n => {
      const r = n.getBoundingClientRect();
      if (r.top >= 0 && r.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
        runCounter(n);
      }
    });
  });

  // Parallax hero (soft)
  const hero = document.querySelector('.hero');
  if (hero && !prefersReduce) {
    let lastY = 0, ticking = false;
    const parallax = () => { hero.style.backgroundPositionY = `calc(50% + ${lastY * 0.15}px)`; ticking = false; };
    window.addEventListener('scroll', () => {
      lastY = window.scrollY;
      if (!ticking) { requestAnimationFrame(parallax); ticking = true; }
    }, {passive:true});
  }

  // Tours carousel
  const track = document.getElementById('tourTrack');
  const prev = document.querySelector('.tours .prev');
  const next = document.querySelector('.tours .next');
  const scrollAmt = () => track.clientWidth * 0.9;
  prev?.addEventListener('click', () => track.scrollBy({left:-scrollAmt(), behavior:'smooth'}));
  next?.addEventListener('click', () => track.scrollBy({left: scrollAmt(), behavior:'smooth'}));

  // Global image fallback
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => { img.src = 'https://picsum.photos/seed/fallback/900/600'; });
  });

  // Newsletter
  const newsForm = document.getElementById('newsForm');
  newsForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsForm.querySelector('input').value;
    alert('عضویت با موفقیت انجام شد: ' + email);
    newsForm.reset();
  });
})();