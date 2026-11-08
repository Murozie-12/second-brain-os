/* SECOND BRAIN OS V2.6 — additive mobile usability; no database or Firebase access. */
const bottom=document.querySelector('nav.bottom');
const sidebar=document.querySelector('.sidebar nav');
const search=document.getElementById('search');
const more=document.getElementById('moreDialog');
const isMobile=()=>matchMedia('(max-width:800px)').matches;
function updateActive(){
  if(!bottom)return;
  const active=sidebar?.querySelector('[data-view].active')?.dataset.view;
  for(const button of bottom.querySelectorAll('[data-view]')){
    if(button.dataset.view===active)button.setAttribute('aria-current','page');
    else button.removeAttribute('aria-current');
  }
  const moreButton=document.getElementById('moreNav');
  if(moreButton){
    if(active&&!bottom.querySelector(`[data-view="${CSS.escape(active)}"]`))moreButton.setAttribute('aria-current','page');
    else moreButton.removeAttribute('aria-current');
  }
}
if(bottom){
  updateActive();
  if(sidebar)new MutationObserver(updateActive).observe(sidebar,{subtree:true,attributes:true,attributeFilter:['class']});
  document.querySelectorAll('[data-view],[data-more-view]').forEach(button=>button.addEventListener('click',()=>{
    queueMicrotask(updateActive);
    if(isMobile()&&button.dataset.view!=='notes'){
      // Do not disturb the editor or a still-open dialog.
      requestAnimationFrame(()=>{if(!document.querySelector('dialog[open]'))window.scrollTo({top:0,behavior:'auto'});});
    }
  }));
}
// Escape closes the extended menu via the browser's native dialog behavior.
// A keyboard shortcut makes search accessible on laptops without overriding editing shortcuts.
document.addEventListener('keydown',event=>{
  if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'&&search){
    event.preventDefault();
    if(more?.open)more.close();
    search.focus();search.select();
  }
});
// Avoid covering the content with the mobile keyboard while the user searches.
search?.addEventListener('focus',()=>{
  if(isMobile())setTimeout(()=>search.scrollIntoView({block:'nearest',behavior:'auto'}),100);
});
