/* Shared client logic for Clarity Law pages — review marquee + QLD offices map */
(function(){
  const REVIEWS_A = [
    {nm:"Emma R.", dt:"2 weeks ago", t:"Charged with common assault after a night out I couldn't remember clearly. Steven walked me through every option. Section 12 accepted, no conviction. I can't thank them enough."},
    {nm:"Marcus T.", dt:"1 month ago", t:"AOBH charge downgraded to common assault after they reviewed the medical reports line by line. Fixed fee, no surprises, outcome better than I dared hope for."},
    {nm:"Jayden P.", dt:"3 weeks ago", t:"Self-defence. They backed me when no-one else would even consider it. Jury returned not guilty in under an hour. I have my life back."},
    {nm:"Hannah W.", dt:"5 days ago", t:"My son was charged with serious assault. Belinda took the call on a Sunday. By Tuesday we had a plan, by Friday he had a lawyer in court who already knew the magistrate."},
    {nm:"David K.", dt:"2 months ago", t:"Alleged pub fight. They subpoenaed the CCTV the police hadn't bothered to look at. Charge withdrawn at the second mention. Professional the whole way."},
    {nm:"Sam O.", dt:"6 weeks ago", t:"Drove from Bundaberg for an AOBH matter. Worth every kilometre. They knew the prosecutor by name and had a clear plan before I'd even sat down."},
    {nm:"Tegan F.", dt:"1 week ago", t:"Jack took my bail application at 9pm on a Sunday. Got bail next morning on a serious assault charge. Can't thank him enough."},
    {nm:"Michael B.", dt:"3 weeks ago", t:"Very impressed with how quickly they responded. Got a no-conviction result on a common assault charge I thought was hopeless."},
    {nm:"Priya N.", dt:"3 months ago", t:"Straightforward, no-fuss, fixed price. They told me exactly what to worry about and what not to — turned out most of it was the second category."},
    {nm:"Ben L.", dt:"2 weeks ago", t:"Will was prepared. So prepared the other side folded half their AOBH case before lunch. Outstanding representation."}
  ];
  const REVIEWS_B = [
    {nm:"Rob H.", dt:"4 weeks ago", t:"Second-time client for an unrelated matter. Glad they were still here. Same plain English, same result — no conviction recorded."},
    {nm:"Courtney M.", dt:"10 days ago", t:"I was terrified walking into District Court for my GBH charge. Steven met me outside, walked me through what would happen. It went exactly as he said."},
    {nm:"James D.", dt:"5 weeks ago", t:"Russell handled my Gold Coast assault matter. He knew the magistrate, knew the prosecutor, got me a no-conviction outcome. Fixed fee, no surprises."},
    {nm:"Alicia T.", dt:"2 months ago", t:"Called Thursday, in court Monday, AOBH charge dismissed Wednesday. Belinda kept me updated the whole time. Incredible service from a genuinely nice team."},
    {nm:"Nathan G.", dt:"3 weeks ago", t:"Convinced I'd lose my job over a serious assault charge. Jacob got it dealt with quietly, no conviction recorded. Still can't believe it. Thank you."},
    {nm:"Sarah-Jane K.", dt:"6 days ago", t:"As a nurse a conviction for AOBH would have ended my career. They understood the stakes and fought accordingly. No conviction. I will never forget what they did."},
    {nm:"Chris P.", dt:"7 weeks ago", t:"Called after midnight in a panic after being charged with assault police. They answered. Calm, capable, on my side the whole way through."},
    {nm:"Melissa O.", dt:"1 month ago", t:"Every single thing they said would happen, happened. No drama, no confusion. Great result on a common assault, and a fair fixed price."},
    {nm:"Dylan F.", dt:"2 weeks ago", t:"Braden represented me at Sunshine Coast for a wounding charge. Young guy but absolutely sharp — knew the case inside out, made strong submissions."},
    {nm:"Karen W.", dt:"5 weeks ago", t:"Steven is the lawyer you hope you never need but are grateful for when you do. Assault charge, no conviction, zero lecture. Just a plan and a result."}
  ];
  const HUES = ["#2563C9","#132B5E","#E8641E","#1748A0","#C44E0F"];
  const initials = n => n.split(' ').map(s=>s[0]).join('').slice(0,2);
  const cardHTML = (r,i) => `<div class="card"><div class="top"><div class="who"><div class="av" style="background:${HUES[i%HUES.length]}">${initials(r.nm)}</div><div><div class="nm">${r.nm}</div><div class="dt">${r.dt}</div></div></div><div class="stars">★★★★★</div></div><blockquote>"${r.t}"</blockquote><div class="g">G · Google review</div></div>`;
  function fillTrack(id, items){
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = items.concat(items).map(cardHTML).join('');
  }
  window.ClarityReviews = { fill: function(id1, id2){ fillTrack(id1, REVIEWS_A); fillTrack(id2, REVIEWS_B); } };

  const OFFICES = [
    {n:'Hervey Bay', c:[-25.2882,152.8644], a:'b-r'},
    {n:'Toowoomba', c:[-27.5598,151.9507], a:'b-l'},
    {n:'Sunshine Coast', c:[-26.6600,153.0900], a:'b-r'},
    {n:'North Brisbane', c:[-27.3280,152.9730], a:'b-r'},
    {n:'Ipswich', c:[-27.6162,152.7609], a:'b-l'},
    {n:'Brisbane', c:[-27.4700,153.0050], a:'b-c'},
    {n:'Logan', c:[-27.7100,153.1500], a:'b-r'},
    {n:'Gold Coast', c:[-28.0000,153.4200], a:'b-r'}
  ];
  function makeIcon(n,a){
    let ls = 'left:50%;transform:translateX(-50%)';
    if (a==='b-l') ls = 'right:10px;left:auto';
    if (a==='b-r') ls = 'left:10px;right:auto';
    return L.divIcon({className:'',iconSize:[1,1],iconAnchor:[0,0],
      html:`<div style="position:relative;transform:translate(-50%,-100%);pointer-events:none"><div style="position:absolute;bottom:18px;${ls};background:#132B5E;color:#fff;font-family:'Inter Tight',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.06em;padding:3px 9px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,.25)">${n}</div><div style="width:14px;height:14px;background:#E8641E;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,.3);position:relative;z-index:2"></div></div>`});
  }
  function initQldMap(elId, opts){
    if (!window.L) return;
    const c = document.getElementById(elId);
    if (!c) return;
    const map = L.map(c, {zoomControl:false, attributionControl:false, dragging:false, scrollWheelZoom:false, doubleClickZoom:false, touchZoom:false, boxZoom:false, keyboard:false, zoomSnap:0.25});
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {maxZoom:8}).addTo(map);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {maxZoom:13, opacity:0.6}).addTo(map);
    OFFICES.forEach(o => L.marker(o.c, {icon: makeIcon(o.n,o.a), interactive:false}).addTo(map));
    map.fitBounds(L.latLngBounds(OFFICES.map(o=>o.c)), {padding:[50,50]});
  }
  // Single-pin helper for court / single-office maps
  function initPinMap(elId, lat, lng, label, zoom){
    if (!window.L) return;
    const c = document.getElementById(elId);
    if (!c) return;
    const map = L.map(c, {zoomControl:false, attributionControl:false, dragging:false, scrollWheelZoom:false, doubleClickZoom:false, touchZoom:false, boxZoom:false, keyboard:false}).setView([lat,lng], zoom||14);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {maxZoom:18}).addTo(map);
    L.marker([lat,lng], {icon: makeIcon(label,'b-c'), interactive:false}).addTo(map);
  }
  window.ClarityMaps = { qld: initQldMap, pin: initPinMap, offices: OFFICES };
})();
