(() => {
 const nav=document.querySelector('.quick-nav');if(!nav)return;
 const toggle=nav.querySelector('.quick-nav-toggle');
 const links=[...nav.querySelectorAll('a[href^="#"]')];
 const items=links.map(a=>({a,target:document.getElementById(a.hash.slice(1))})).filter(x=>x.target);
 const mobile=()=>matchMedia('(max-width:1100px)').matches;
 const close=()=>{nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');};
 toggle.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(open));});
 const mark=a=>{links.forEach(link=>{link.classList.toggle('is-active',link===a);if(link===a)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});};
 links.forEach(a=>a.addEventListener('click',e=>{const target=document.getElementById(a.hash.slice(1));if(!target)return;e.preventDefault();target.scrollIntoView({behavior:'instant',block:'start'});history.replaceState(null,'',a.hash);mark(a);if(mobile())close();}));
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
 document.addEventListener('click',e=>{if(mobile()&&!nav.contains(e.target))close();});
 let scheduled=false;
 const update=()=>{scheduled=false;let candidate=items[0];for(const item of items){if(item.target.getBoundingClientRect().top<=250)candidate=item;}
 const current=items.find(x=>x.a.classList.contains('is-active'));
 if(current&&candidate&&Math.abs(current.target.getBoundingClientRect().top-candidate.target.getBoundingClientRect().top)<3)return;
 if(candidate)mark(candidate.a);
 };
 addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update);}},{passive:true});addEventListener('resize',update);update();
})();
