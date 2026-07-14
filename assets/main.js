// Improved interactive behavior for ranjith-portfolio
// - Batched cursor updates using requestAnimationFrame and transform (GPU-accelerated)
// - Hover state toggles via CSS class instead of inline style writes
// - Replaced scroll nav-highlighting with IntersectionObserver
// - Replaced JS interval blink with CSS animation injected at runtime

(function(){
  // Elements
  const dot = document.getElementById('dot');
  const ring = document.getElementById('ring');

  // Guard: if cursor elements missing, abort cursor logic
  let mx = 0, my = 0, dx = 0, dy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  // RAF loop: batch writes and use transform for smoother updates
  function loop(){
    dx += (mx - dx) * 0.12;
    dy += (my - dy) * 0.12;
    if (dot) dot.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    if (ring) ring.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // Hover effects: toggle a class so the browser can handle composited transforms
  document.querySelectorAll('a,button').forEach(el=>{
    el.addEventListener('mouseenter',()=>{ if (ring) ring.classList.add('hover'); });
    el.addEventListener('mouseleave',()=>{ if (ring) ring.classList.remove('hover'); });
  });

  // IntersectionObserver for active nav highlighting (replaces scroll handler)
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#'+id));
        }
      });
    }, { threshold: 0.55 });
    sections.forEach(s => navObserver.observe(s));
  }

  // Inject small CSS for animations optimization, reduced-motion, blink replacement, and cursor will-change
  const injected = document.createElement('style');
  injected.id = 'copilot-performance-fixes';
  injected.textContent = `
  /* Performance-oriented tweaks injected by script */
  .cursor{ will-change: transform; pointer-events:none }
  .cursor-ring.hover{ transform: translate(-50%,-50%) scale(1.6) !important; opacity:0.3 !important; transition:transform 120ms, opacity 120ms }
  .nav-links a.active{ color: var(--accent) !important }
  @keyframes copilot-blink { 0%,90%{ transform: scaleY(1) } 95%{ transform: scaleY(0.12) } 100%{ transform: scaleY(1) } }
  .eyes ellipse{ transform-origin:center; animation: copilot-blink 3.5s infinite }
  @media (prefers-reduced-motion: reduce){
    .avatar-ring, .avatar-ring2, .floating-badge, .badge-top, .badge-bottom, .proj-card, .about-card { animation: none !important; transition: none !important }
    .eyes ellipse{ animation: none !important }
  }
  `;
  document.head.appendChild(injected);

})();
