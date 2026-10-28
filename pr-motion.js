(() => {
  const gallery = document.querySelector('.pr-motion');
  if (!gallery) return;
  const rows = [...gallery.querySelectorAll('.pr-motion-row')];
  const toggle = gallery.querySelector('.pr-motion-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches;
  let visible = true;
  let previous = 0;
  const states = rows.map((row, index) => ({ row, direction: index ? -1 : 1, hover: false, held: false, holdUntil: 0, position: null, applied: null }));
  const sync = () => { toggle.textContent = paused ? '자동 흐름 시작하기' : '자동 흐름 멈추기'; toggle.setAttribute('aria-pressed', String(paused)); };
  toggle.addEventListener('click', () => { paused = !paused; sync(); });
  reduced.addEventListener('change', () => { paused = reduced.matches; sync(); });
  states.forEach(state => {
    const { row } = state;
    if (state.direction < 0) row.scrollLeft = row.scrollWidth - row.clientWidth;
    row.addEventListener('mouseenter', () => state.hover = true);
    row.addEventListener('mouseleave', () => state.hover = false);
    row.addEventListener('pointerdown', () => state.held = true);
    row.addEventListener('wheel', () => state.holdUntil = performance.now() + 5000, { passive: true });
    row.addEventListener('touchstart', () => state.holdUntil = performance.now() + 8000, { passive: true });
    row.addEventListener('keydown', () => state.holdUntil = performance.now() + 8000);
  });
  window.addEventListener('pointerup', () => states.forEach(state => state.held = false));
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }, { rootMargin: '100px' }).observe(gallery);
  function tick(now) {
    const elapsed = previous ? Math.min(now - previous, 50) : 0;
    previous = now;
    if (!paused && visible && !document.hidden) for (const state of states) {
      const { row } = state;
      if (state.hover || state.held || row.contains(document.activeElement) || now < state.holdUntil) continue;
      const max = row.scrollWidth - row.clientWidth;
      if (max <= 0) continue;
      if (state.position === null || Math.abs(row.scrollLeft - state.applied) > 2) state.position = row.scrollLeft;
      state.position += state.direction * elapsed * 0.022;
      if (state.position > max) state.position = 0;
      else if (state.position < 0) state.position = max;
      row.scrollLeft = state.position;
      state.applied = row.scrollLeft;
    }
    requestAnimationFrame(tick);
  }
  sync(); requestAnimationFrame(tick);
})();
