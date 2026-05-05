/* serious-assault page — animations, count-up, parallax, cursor, map */
(function(){
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal on scroll
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  },{rootMargin:'0px 0px -10% 0px', threshold:.1});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // Count-up numbers
  function countUp(el, target, duration=1600){
    if(reduce){ el.textContent = target; return; }
    const start = performance.now();
    function tick(t){
      const p = Math.min(1, (t-start)/duration);
      const eased = 1 - Math.pow(1-p, 3);
      el.textContent = Math.round(target*eased);
      if(p<1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const cuObs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const el = e.target;
        const target = parseInt(el.dataset.count,10);
        countUp(el, target);
        cuObs.unobserve(el);
      }
    });
  },{threshold:.5});
  document.querySelectorAll('[data-count]').forEach(el=>cuObs.observe(el));

  // Hero parallax
  const hero = document.querySelector('.hero');
  if(hero && !reduce){
    hero.addEventListener('mousemove', (e)=>{
      const r = hero.getBoundingClientRect();
      const x = ((e.clientX - r.left)/r.width - .5) * 2;
      const y = ((e.clientY - r.top)/r.height - .5) * 2;
      hero.style.setProperty('--mx', (x*8).toFixed(2)+'px');
      hero.style.setProperty('--my', (y*8).toFixed(2)+'px');
    });
  }

  // Nav shrink
  const nav = document.querySelector('nav.primary');
  let lastY = 0;
  window.addEventListener('scroll', ()=>{
    const y = window.scrollY;
    if(nav){
      if(y > 80) nav.classList.add('shrunk');
      else nav.classList.remove('shrunk');
    }
    lastY = y;
  }, {passive:true});

  // Custom cursor on dark sections
  const cursor = document.createElement('div');
  cursor.id = 'custcursor';
  document.body.appendChild(cursor);
  let cx=0, cy=0, tx=0, ty=0;
  document.addEventListener('mousemove', (e)=>{
    tx = e.clientX; ty = e.clientY;
  });
  function loop(){
    cx += (tx-cx)*0.18;
    cy += (ty-cy)*0.18;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  if(!reduce) requestAnimationFrame(loop);
  const darkSections = document.querySelectorAll('.faq, .cta-band');
  darkSections.forEach(s=>{
    s.addEventListener('mouseenter', ()=>cursor.classList.add('show'));
    s.addEventListener('mouseleave', ()=>cursor.classList.remove('show'));
  });
  // Larger cursor on links/buttons inside dark sections
  document.querySelectorAll('.faq a, .faq summary, .cta-band a').forEach(el=>{
    el.addEventListener('mouseenter', ()=>cursor.classList.add('lg'));
    el.addEventListener('mouseleave', ()=>cursor.classList.remove('lg'));
  });

  // CTA word-by-word reveal
  const ctaH = document.querySelector('.cta-band h2');
  if(ctaH){
    const words = ctaH.innerHTML.split(/(<[^>]+>|\s+)/).filter(s=>s.length);
    ctaH.innerHTML = words.map(w=>{
      if(w.startsWith('<') || /^\s+$/.test(w)) return w;
      return `<span class="word">${w}</span>`;
    }).join('');
    const ctaObs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          const ws = ctaH.querySelectorAll('.word');
          ws.forEach((wEl,i)=>setTimeout(()=>{
            ctaH.classList.add('in');
            wEl.style.transitionDelay = (i*70)+'ms';
          },10));
          ctaObs.unobserve(ctaH);
        }
      });
    },{threshold:.4});
    ctaObs.observe(ctaH);
  }

  // Process timeline — fill spine + activate milestones
  const vt = document.querySelector('.vtimeline');
  if(vt){
    const milestones = vt.querySelectorAll('.milestone');
    function update(){
      const r = vt.getBoundingClientRect();
      const wh = window.innerHeight;
      const top = r.top;
      const total = r.height;
      const visible = Math.min(total, wh*.55 - top);
      const pct = Math.max(0, Math.min(1, visible / total));
      vt.style.setProperty('--fill', (pct*100).toFixed(1)+'%');
      milestones.forEach(m=>{
        const mr = m.getBoundingClientRect();
        if(mr.top < wh*.65) m.classList.add('active');
      });
    }
    window.addEventListener('scroll', update, {passive:true});
    window.addEventListener('resize', update);
    update();
  }

  // Notepad checkbox toggle
  document.querySelectorAll('.notepad li').forEach(li=>{
    li.addEventListener('click', ()=>li.classList.toggle('checked'));
  });

  // Local map: courts around SE Queensland
  if(window.L && document.getElementById('qmap')){
    const courts = [
      {id:'brisbane', nm:'Brisbane Magistrates', sub:'Roma St · Mon–Fri', lat:-27.4669, lng:153.0212},
      {id:'southport', nm:'Southport Magistrates', sub:'Gold Coast', lat:-27.9650, lng:153.4150},
      {id:'beenleigh', nm:'Beenleigh Magistrates', sub:'Logan', lat:-27.7117, lng:153.2018},
      {id:'ipswich', nm:'Ipswich Magistrates', sub:'Mon–Fri', lat:-27.6147, lng:152.7600},
      {id:'maroochydore', nm:'Maroochydore Magistrates', sub:'Sunshine Coast', lat:-26.6580, lng:153.0930},
      {id:'caboolture', nm:'Caboolture Magistrates', sub:'North Brisbane', lat:-27.0833, lng:152.9580},
      {id:'herveybay', nm:'Hervey Bay Magistrates', sub:'Wide Bay', lat:-25.2900, lng:152.8485},
      {id:'brisbanedist', nm:'Brisbane District', sub:'George St · Indictable', lat:-27.4715, lng:153.0250},
      {id:'southportdist', nm:'Southport District', sub:'Gold Coast', lat:-27.9650, lng:153.4140}
    ];
    const map = L.map('qmap', {zoomControl:true, scrollWheelZoom:false, attributionControl:false}).setView([-27.45, 153.0], 8);
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png',{
      maxZoom:18, attribution:''
    }).addTo(map);
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png',{
      maxZoom:18, attribution:''
    }).addTo(map);

    const markers = {};
    courts.forEach(c=>{
      const ico = L.divIcon({
        className:'qm-pin',
        html:`<svg width="28" height="36" viewBox="0 0 28 36"><path d="M14 0C6.27 0 0 6.27 0 14c0 10 14 22 14 22s14-12 14-22C28 6.27 21.73 0 14 0z" fill="#E8641E"/><circle cx="14" cy="14" r="5" fill="#FCFAF5"/></svg>`,
        iconSize:[28,36], iconAnchor:[14,36], popupAnchor:[0,-30]
      });
      const m = L.marker([c.lat,c.lng], {icon:ico}).addTo(map);
      m.bindTooltip(`<div class="tip-card"><div class="nm">${c.nm}</div><div class="sub">${c.sub}</div></div>`,{
        direction:'top', offset:[0,-30], opacity:1, className:'qm-tip'
      });
      markers[c.id] = m;
    });

    // Cross-element interactivity: hovering a court name in prose pings the map
    document.querySelectorAll('.court-name[data-court]').forEach(el=>{
      el.addEventListener('mouseenter', ()=>{
        const id = el.dataset.court;
        const m = markers[id];
        if(m){
          el.classList.add('active');
          m.openTooltip();
          map.flyTo([m.getLatLng().lat, m.getLatLng().lng], 10, {duration:.6});
        }
      });
      el.addEventListener('mouseleave', ()=>{
        const id = el.dataset.court;
        const m = markers[id];
        if(m){ el.classList.remove('active'); m.closeTooltip(); }
      });
    });
  }

  // Defences card — touch reveal
  document.querySelectorAll('.def').forEach(d=>{
    d.addEventListener('touchstart', ()=>d.classList.toggle('open'),{passive:true});
  });
})();
