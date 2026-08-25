(function(){
  "use strict";
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ===================== LOADER ===================== */
  const loader = document.getElementById('loader');
  const loaderBar = document.getElementById('loaderBar');
  const loaderPct = document.getElementById('loaderPct');
  let pct = 0;
  function tickLoader(){
    pct += Math.floor(Math.random()*9)+4;
    if(pct >= 100){
      pct = 100;
      loaderBar.style.width = '100%';
      loaderPct.textContent = '100';
      finishLoad();
      return;
    }
    loaderBar.style.width = pct + '%';
    loaderPct.textContent = String(pct).padStart(2,'0');
    setTimeout(tickLoader, reduced ? 10 : 90);
  }
  function finishLoad(){
    setTimeout(()=>{
      if(window.gsap){
        gsap.to(loader, {yPercent:-100, duration:.9, ease:'power4.inOut', onComplete:()=>{loader.style.display='none'; runIntro();}});
      } else {
        loader.style.display='none'; runIntro();
      }
    }, 250);
  }
  setTimeout(tickLoader, 200);

  /* ===================== CUSTOM CURSOR ===================== */
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  const ringLabel = document.getElementById('cursorLabel');
  let mx=innerWidth/2,my=innerHeight/2, rx=mx, ry=my;
  window.addEventListener('mousemove', e=>{ mx=e.clientX; my=e.clientY; });
  function raf(){
    rx += (mx-rx)*0.18; ry += (my-ry)*0.18;
    cursor.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(raf);
  }
  if(!reduced) raf();

  function bindCursor(selector, label){
    document.querySelectorAll(selector).forEach(el=>{
      el.addEventListener('mouseenter', ()=>{
        ring.classList.add('grow');
        ringLabel.textContent = label || el.dataset.view || 'VIEW';
        cursor.classList.add('hide');
      });
      el.addEventListener('mouseleave', ()=>{
        ring.classList.remove('grow');
        cursor.classList.remove('hide');
      });
    });
  }
  bindCursor('.work-card', 'VIEW');
  bindCursor('.photo-item', 'VIEW');
  bindCursor('.btn-solid', "LET'S GO →");
  bindCursor('.btn-outline', "LET'S GO →");
  bindCursor('.contact-links a', 'OPEN');
  bindCursor('.contact-email', 'EMAIL');
  bindCursor('.skill-row', 'INFO');
  bindCursor('.code-card', 'CODE');

  /* ===================== NAV ===================== */
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  window.addEventListener('scroll', ()=>{
    nav.classList.toggle('scrolled', window.scrollY > 40);
    updateProgress();
  }, {passive:true});
  burger.addEventListener('click', ()=> navLinks.classList.toggle('open'));
  document.querySelectorAll('.nav-link').forEach(a=>a.addEventListener('click', ()=> navLinks.classList.remove('open')));

  const progressEl = document.getElementById('progress');
  function updateProgress(){
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
    progressEl.style.width = scrolled + '%';
  }

  /* ===================== SMOOTH ANCHOR SCROLL ===================== */
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const id = a.getAttribute('href');
      const target = document.querySelector(id);
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior: reduced ? 'auto' : 'smooth', block:'start'});
      }
    });
  });

  /* ===================== MARQUEE DUPLICATE ===================== */
  const m1 = document.getElementById('marquee1');
  if(m1) m1.innerHTML += m1.innerHTML;

  /* ===================== INTRO (hero) ===================== */
  function runIntro(){
    if(!window.gsap || reduced){
      document.querySelectorAll('.reveal').forEach(el=>el.style.opacity=1);
      return;
    }
    // split hero name into letters
    const nameEl = document.querySelector('.reveal-name');
    if(nameEl){
      const text = nameEl.textContent;
      nameEl.innerHTML = '';
      text.split('').forEach(ch=>{
        const s = document.createElement('span');
        s.style.display='inline-block';
        s.style.transform = 'translateY(115%)';
        s.textContent = ch === ' ' ? '\u00A0' : ch;
        nameEl.appendChild(s);
      });
      gsap.to(nameEl.children, {y:0, duration:1.1, ease:'power4.out', stagger:0.02, delay:.1});
    }
    gsap.timeline({delay:.3})
      .to('.hero .reveal', {opacity:1, y:0, duration:1, ease:'power3.out', stagger:.12})
      .fromTo('.hero-top', {opacity:0}, {opacity:1, duration:1}, '<0.2');

    initScrollAnimations();
  }

  /* ===================== SCROLL-TRIGGERED REVEALS ===================== */
  function initScrollAnimations(){
    if(!window.gsap) return;

    document.querySelectorAll('.reveal:not(.hero .reveal)').forEach(el=>{
      gsap.to(el, {
        opacity:1, y:0, duration:.9, ease:'power3.out',
        scrollTrigger:{trigger:el, start:'top 88%'}
      });
    });

    // parallax featured bg
    gsap.to('#featuredBg', {
      yPercent:15, ease:'none',
      scrollTrigger:{trigger:'.featured', start:'top bottom', end:'bottom top', scrub:true}
    });

    // hero bg subtle parallax
    gsap.to('.hero-bg, .hero-bg-grid', {
      yPercent:18, ease:'none',
      scrollTrigger:{trigger:'.hero', start:'top top', end:'bottom top', scrub:true}
    });

    // skill bar inview
    document.querySelectorAll('.skill-row').forEach(row=>{
      ScrollTrigger.create({
        trigger: row, start:'top 90%',
        onEnter: ()=> row.classList.add('inview')
      });
    });

    // motion shapes parallax
    gsap.to('.ms1', {y:-60, x:20, ease:'none', scrollTrigger:{trigger:'.motion', start:'top bottom', end:'bottom top', scrub:1}});
    gsap.to('.ms2', {y:50, x:-30, ease:'none', scrollTrigger:{trigger:'.motion', start:'top bottom', end:'bottom top', scrub:1}});
    gsap.to('.ms3', {y:-90, rotate:40, ease:'none', scrollTrigger:{trigger:'.motion', start:'top bottom', end:'bottom top', scrub:1}});

    // photo grid subtle stagger already handled by .reveal; add slight scale-in
    gsap.utils.toArray('.photo-item').forEach((item, i)=>{
      gsap.fromTo(item, {scale:1.08}, {
        scale:1, duration:1.1, ease:'power3.out',
        scrollTrigger:{trigger:item, start:'top 90%'}
      });
    });

    // stats counters
    document.querySelectorAll('.stat-num').forEach(el=>{
      ScrollTrigger.create({
        trigger: el, start:'top 85%', once:true,
        onEnter: ()=> animateCount(el)
      });
    });

    // work card reveal with slight x offset already via .reveal
  }

  function animateCount(el){
    if(el.dataset.infinity){ el.textContent = '∞'; return; }
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || '';
    const obj = {v:0};
    gsap.to(obj, {
      v: target, duration:1.6, ease:'power2.out',
      onUpdate: ()=>{ el.textContent = Math.floor(obj.v) + suffix; }
    });
  }

  /* fallback: reveal progress on load in case GSAP CDN fails */
  window.addEventListener('load', ()=>{ setTimeout(updateProgress, 300); });
})();