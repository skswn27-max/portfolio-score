(() => {
  const frame = document.querySelector('.hero-pap-viewport');
  if (!frame) return;
  const fit = () => frame.style.setProperty('--pap-scale', String(frame.clientWidth / 400));
  fit();
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(frame);
  else window.addEventListener('resize', fit);
})();
