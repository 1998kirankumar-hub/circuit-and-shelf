(()=>{'use strict';
 const root=document.documentElement;
 const saved=(()=>{try{return localStorage.getItem('cs-theme')}catch{return null}})();
 if(saved==='dark')root.dataset.theme='dark';
 const toggle=document.getElementById('theme-toggle');
 toggle?.addEventListener('click',()=>{const next=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=next;try{localStorage.setItem('cs-theme',next)}catch{}});
 const menu=document.getElementById('menu-toggle'),nav=document.getElementById('primary-nav');
 menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav?.classList.toggle('is-open',open)});
 nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('is-open');menu?.setAttribute('aria-expanded','false')}));
 const items=[...document.querySelectorAll('[data-story]')],filters=[...document.querySelectorAll('[data-filter]')],search=document.getElementById('story-search'),empty=document.getElementById('no-results');
 let current='All';
 function apply(){if(!items.length)return;let shown=0;const q=(search?.value||'').trim().toLowerCase();items.forEach(el=>{const matchCategory=current==='All'||el.dataset.category===current;const matchSearch=!q||(el.dataset.search||'').includes(q);const visible=matchCategory&&matchSearch;el.hidden=!visible;if(visible)shown++});if(empty)empty.hidden=shown>0;}
 filters.forEach(btn=>btn.addEventListener('click',()=>{current=btn.dataset.filter;filters.forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn))});apply()}));
 search?.addEventListener('input',apply);
 document.getElementById('clear-filters')?.addEventListener('click',()=>{current='All';if(search)search.value='';filters.forEach(b=>{const active=b.dataset.filter==='All';b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});apply()});
})();
