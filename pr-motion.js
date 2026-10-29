(() => {
  for (const gallery of document.querySelectorAll('.pr-motion')) {
    for (const [index, row] of [...gallery.querySelectorAll('.pr-motion-row')].entries()) {
      const cards = [...row.children];
      if (!cards.length) continue;
      if (index === 1) cards.reverse();
      const track = document.createElement('div'); track.className = 'pr-motion-track';
      const original = document.createElement('div'); original.className = 'pr-motion-set'; original.append(...cards);
      track.append(original); row.replaceChildren(track); row.classList.add('pr-marquee');
      const repeat = original.cloneNode(true); repeat.setAttribute('aria-hidden', 'true');
      repeat.querySelectorAll('a').forEach(a => a.tabIndex = -1); track.append(repeat);
      const fit = () => { const distance = original.getBoundingClientRect().width; track.style.setProperty('--travel', distance + 'px'); track.style.setProperty('--duration', Math.max(35, distance / 32) + 's'); };
      fit();
      if ('ResizeObserver' in window) new ResizeObserver(fit).observe(original);
      else window.addEventListener('resize', fit);
      if (matchMedia('(hover: none)').matches) {
        row.addEventListener('pointerdown', () => row.classList.add('touch-paused'));
        row.addEventListener('pointerup', () => row.classList.remove('touch-paused'));
        row.addEventListener('pointercancel', () => row.classList.remove('touch-paused'));
      }
    }
  }
})();
