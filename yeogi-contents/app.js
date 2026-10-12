'use strict';
const dialog = document.querySelector('.lightbox');
const modalImage = document.querySelector('.lightbox-image');
const caption = document.querySelector('#lightbox-caption');
let lastTrigger;
document.querySelectorAll('.image-button').forEach(button => {
  button.addEventListener('click', () => {
    const img = button.querySelector('img');
    lastTrigger = button;
    modalImage.src = img.currentSrc || img.src;
    modalImage.alt = img.alt;
    caption.textContent = button.dataset.caption || img.alt;
    dialog.showModal();
    document.body.classList.add('modal-open');
  });
});
document.querySelector('.close-lightbox').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  lastTrigger?.focus({preventScroll:true});
});
const progress = document.querySelector('.progress');
let ticking = false;
function updateProgress(){
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${max > 0 ? Math.min(100, Math.max(0, scrollY / max * 100)) : 0}%`;
  ticking = false;
}
addEventListener('scroll', () => {if(!ticking){ticking=true;requestAnimationFrame(updateProgress);}},{passive:true});
addEventListener('resize', updateProgress);
updateProgress();
const navLinks = [...document.querySelectorAll('nav a')];
if('IntersectionObserver' in window){
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  },{rootMargin:'-15% 0px -60% 0px',threshold:0});
  ['work','process','profile','contact'].forEach(id => observer.observe(document.getElementById(id)));
}
let closedForPrint = [];
addEventListener('beforeprint', () => {
  closedForPrint = [...document.querySelectorAll('details:not([open])')];
  closedForPrint.forEach(details => {details.open=true;});
});
addEventListener('afterprint', () => {
  closedForPrint.forEach(details => {details.open=false;});
  closedForPrint=[];
});
document.querySelector('.print-button').addEventListener('click', () => window.print());
