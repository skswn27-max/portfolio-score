const viewer=document.querySelector('#lightbox');
let lastTrigger;
function openImage(src,caption,trigger){
  lastTrigger=trigger;
  viewer.querySelector('img').src=src;
  viewer.querySelector('img').alt=caption;
  viewer.querySelector('p').textContent=caption;
  viewer.showModal();
}
document.addEventListener('click',event=>{
  const button=event.target.closest('[data-zoom]');
  if(button)openImage(button.dataset.zoom,button.dataset.caption||'',button);
});
viewer.querySelector('.close').addEventListener('click',()=>viewer.close());
viewer.addEventListener('click',event=>{if(event.target===viewer)viewer.close();});
viewer.addEventListener('close',()=>lastTrigger?.focus());

for(const stage of document.querySelectorAll('[data-media-id]')){
  const config=window.PORTFOLIO_MEDIA?.[stage.dataset.mediaId];
  if(!config)continue;
  const images=config.type==='carousel'?config.images||[]:[];
  if(!config.src&&!images.length)continue;
  const error=()=>{stage.replaceChildren();const message=document.createElement('p');message.className='media-error';message.textContent='미디어를 불러오지 못했습니다.';stage.append(message);};
  const status=stage.closest('.device-screen').querySelector('.asset-status');
  const label=config.statusLabel||(config.status==='actual'?(config.type==='video'?'발행 영상 · 목업 재구성':'발행 이미지 · 목업 재구성'):'구성 예시');
  if(status)status.textContent=label;
  const outerStatus=stage.closest('.phone-card').querySelector('.media-label');
  if(outerStatus)outerStatus.textContent=label;
  stage.replaceChildren();
  if(config.type==='video'){
    stage.closest('.device-screen').classList.add('has-video');
    const video=document.createElement('video');
    video.src=config.src;video.controls=true;video.playsInline=true;video.preload='metadata';
    video.setAttribute('aria-label',config.alt||'캠페인 영상');
    if(config.poster)video.poster=config.poster;
    video.addEventListener('error',error,{once:true});stage.append(video);
  }else{
    const button=document.createElement('button');button.type='button';button.className='media-image';
    const img=document.createElement('img');img.loading='lazy';img.decoding='async';img.alt=config.alt||'매체 콘텐츠';
    let index=0;
    function show(){img.src=images.length?images[index]:config.src;button.dataset.zoom=img.src;button.dataset.caption=img.alt;button.setAttribute('aria-label',img.alt+' 확대');}
    img.addEventListener('error',error,{once:true});button.append(img);stage.append(button);show();
    if(images.length>1){
      const controls=document.createElement('div');controls.className='carousel-controls';
      const prev=document.createElement('button');prev.type='button';prev.textContent='‹';prev.setAttribute('aria-label','이전 이미지');
      const count=document.createElement('span');count.setAttribute('aria-live','polite');count.textContent='1 / '+images.length;
      const next=document.createElement('button');next.type='button';next.textContent='›';next.setAttribute('aria-label','다음 이미지');
      function step(direction){index=(index+direction+images.length)%images.length;show();count.textContent=(index+1)+' / '+images.length;}
      prev.addEventListener('click',()=>step(-1));next.addEventListener('click',()=>step(1));
      controls.append(prev,count,next);stage.append(controls);
    }
  }
}

const progress=document.querySelector('.reading-progress');let ticking=false;
function updateProgress(){const range=document.documentElement.scrollHeight-innerHeight;progress.style.width=(range>0?Math.min(100,Math.max(0,scrollY/range*100)):0)+'%';ticking=false;}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(updateProgress);}},{passive:true});
addEventListener('resize',updateProgress);updateProgress();
const navLinks=[...document.querySelectorAll('nav a')];
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries)if(entry.isIntersecting){
      for(const link of navLinks){const active=link.hash==='#'+entry.target.id;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');}
    }
  },{rootMargin:'-10% 0px -55% 0px',threshold:0});
  for(const link of navLinks){const section=document.querySelector(link.hash);if(section)observer.observe(section);}
}
