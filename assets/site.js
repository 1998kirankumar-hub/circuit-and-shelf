(()=>{'use strict';
 const root=document.documentElement;
 const saved=(()=>{try{return localStorage.getItem('cs-theme')}catch{return null}
 // Public, source-attributed headlines are separate from editorial articles.
 const newsList=document.getElementById('newswire-list'),newsStatus=document.getElementById('newswire-status');
 if(newsList){
   const newsUrl='https://raw.githubusercontent.com/1998kirankumar-hub/circuit-and-shelf/main/content/headlines.json';
   let hasItems=false;
   const loadHeadlines=async()=>{
     try{
       const controller=new AbortController();
       const timeout=setTimeout(()=>controller.abort(),10000);
       let response;
       try{response=await fetch(`${newsUrl}?edition=${Math.floor(Date.now()/1800000)}`,{signal:controller.signal,cache:'no-store'});}
       finally{clearTimeout(timeout);}
       if(!response.ok)throw new Error('News feed unavailable');
       const data=await response.json();
       if(!Array.isArray(data.items)||!data.items.length)throw new Error('No headlines yet');
       const fragment=document.createDocumentFragment();
       let count=0;
       for(const story of data.items.slice(0,12)){
         if(typeof story.title!=='string'||typeof story.source!=='string'||typeof story.url!=='string')continue;
         let href;
         try{href=new URL(story.url);if(href.protocol!=='https:')continue;}catch{continue;}
         const item=document.createElement('article');item.className='newswire-card';
         const meta=document.createElement('div');meta.className='newswire-meta';
         const source=document.createElement('span');source.textContent=story.source;
         const category=document.createElement('span');category.textContent=typeof story.category==='string'?story.category:'Technology';
         meta.append(source,category);
         const link=document.createElement('a');link.href=href.href;link.target='_blank';link.rel='noopener noreferrer';link.textContent=story.title;link.setAttribute('aria-label',`${story.title} (opens ${story.source} in a new tab)`);
         const title=document.createElement('h3');title.append(link);
         const time=document.createElement('time');if(story.publishedAt && !Number.isNaN(Date.parse(story.publishedAt))){time.dateTime=story.publishedAt;time.textContent=new Date(story.publishedAt).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'});}else time.textContent='Source article';
         item.append(meta,title,time);fragment.append(item);count++;
       }
       if(!count)throw new Error('No valid headlines');
       newsList.replaceChildren(fragment);hasItems=true;
       if(newsStatus){const updated=new Date(data.updatedAt);newsStatus.textContent=!Number.isNaN(updated.getTime())?`Headline list updated ${updated.toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'})}`:'Publisher headlines';}
     }catch(error){
       if(!hasItems){const note=document.createElement('p');note.className='newswire-loading';note.textContent='Recent headlines are temporarily unavailable. Our original buying guides are still here to read.';newsList.replaceChildren(note);}
       if(newsStatus && !hasItems)newsStatus.textContent='External feed unavailable';
     }
   };
   loadHeadlines();setInterval(loadHeadlines,30*60*1000);
 }
})();
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

 // Public, source-attributed headlines are separate from editorial articles.
 const newsList=document.getElementById('newswire-list'),newsStatus=document.getElementById('newswire-status');
 if(newsList){
   const newsUrl='https://raw.githubusercontent.com/1998kirankumar-hub/circuit-and-shelf/main/content/headlines.json';
   let hasItems=false;
   const loadHeadlines=async()=>{
     try{
       const controller=new AbortController();
       const timeout=setTimeout(()=>controller.abort(),10000);
       let response;
       try{response=await fetch(`${newsUrl}?edition=${Math.floor(Date.now()/1800000)}`,{signal:controller.signal,cache:'no-store'});}
       finally{clearTimeout(timeout);}
       if(!response.ok)throw new Error('News feed unavailable');
       const data=await response.json();
       if(!Array.isArray(data.items)||!data.items.length)throw new Error('No headlines yet');
       const fragment=document.createDocumentFragment();
       let count=0;
       for(const story of data.items.slice(0,12)){
         if(typeof story.title!=='string'||typeof story.source!=='string'||typeof story.url!=='string')continue;
         let href;
         try{href=new URL(story.url);if(href.protocol!=='https:')continue;}catch{continue;}
         const item=document.createElement('article');item.className='newswire-card';
         const meta=document.createElement('div');meta.className='newswire-meta';
         const source=document.createElement('span');source.textContent=story.source;
         const category=document.createElement('span');category.textContent=typeof story.category==='string'?story.category:'Technology';
         meta.append(source,category);
         const link=document.createElement('a');link.href=href.href;link.target='_blank';link.rel='noopener noreferrer';link.textContent=story.title;link.setAttribute('aria-label',`${story.title} (opens ${story.source} in a new tab)`);
         const title=document.createElement('h3');title.append(link);
         const time=document.createElement('time');if(story.publishedAt && !Number.isNaN(Date.parse(story.publishedAt))){time.dateTime=story.publishedAt;time.textContent=new Date(story.publishedAt).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'});}else time.textContent='Source article';
         item.append(meta,title,time);fragment.append(item);count++;
       }
       if(!count)throw new Error('No valid headlines');
       newsList.replaceChildren(fragment);hasItems=true;
       if(newsStatus){const updated=new Date(data.updatedAt);newsStatus.textContent=!Number.isNaN(updated.getTime())?`Headline list updated ${updated.toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'})}`:'Publisher headlines';}
     }catch(error){
       if(!hasItems){const note=document.createElement('p');note.className='newswire-loading';note.textContent='Recent headlines are temporarily unavailable. Our original buying guides are still here to read.';newsList.replaceChildren(note);}
       if(newsStatus && !hasItems)newsStatus.textContent='External feed unavailable';
     }
   };
   loadHeadlines();setInterval(loadHeadlines,30*60*1000);
 }
})();
