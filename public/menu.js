'use strict';
(()=>{
 const toggle=document.querySelector('#site-menu-toggle'),nav=document.querySelector('#site-navigation');if(!toggle||!nav)return;
 const groups=[...nav.querySelectorAll('.nav-group')];
 window.closeSiteMenu=()=>{toggle.setAttribute('aria-expanded','false');nav.classList.remove('mobile-open');groups.forEach(group=>group.open=false);};
 toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('mobile-open',open);});
 groups.forEach(group=>group.addEventListener('toggle',()=>{if(group.open)groups.forEach(other=>{if(other!==group)other.open=false;});}));
 document.addEventListener('click',event=>{if(!event.target.closest('header'))window.closeSiteMenu();});
 document.addEventListener('keydown',event=>{if(event.key!=='Escape')return;const active=groups.find(group=>group.open);if(active){active.open=false;active.querySelector('summary').focus();}else if(toggle.getAttribute('aria-expanded')==='true'){window.closeSiteMenu();toggle.focus();}});
 document.querySelector('.program-nav-link')?.addEventListener('click',()=>window.closeSiteMenu());
 window.updateNavigation=p=>{groups.forEach(group=>{const active=[...group.querySelectorAll('[data-page]')].some(button=>button.dataset.page===p);group.querySelector('summary').classList.toggle('active',active);group.querySelectorAll('[data-catalog-target]').forEach(button=>button.classList.toggle('active',p==='biblioteca'&&button.dataset.catalogTarget===catalogTab));});document.querySelector('.program-nav-link')?.classList.toggle('active',p==='downloads');};
 window.addEventListener('resize',()=>{if(window.innerWidth>1050)window.closeSiteMenu();});
})();
