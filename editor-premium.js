/* SECOND BRAIN OS V2.5 — Premium Editor; additive, no database changes. */
const editor = document.getElementById('editor');
const area = document.getElementById('noteContent');
const form = document.getElementById('noteForm');
const formatbar = editor?.querySelector('.formatbar');
if (editor && area && form && formatbar && !document.getElementById('premiumEditorTools')) {
  const tools = document.createElement('div');
  tools.id = 'premiumEditorTools';
  tools.className = 'editor-premium-tools';
  tools.setAttribute('aria-label', 'Alat editor tambahan');
  const actions = [
    ['heading', 'H3', 'Sisipkan heading tingkat 3'],
    ['quote', '❝ Kutipan', 'Sisipkan kutipan'],
    ['code', '{ } Kode', 'Sisipkan blok kode'],
    ['rule', '— Garis', 'Sisipkan pemisah'],
    ['undo', '↶ Undo', 'Batalkan perubahan'],
    ['redo', '↷ Redo', 'Ulangi perubahan'],
    ['focus', '⛶ Fokus', 'Alihkan mode fokus'],
    ['export', '↓ .md', 'Ekspor catatan sebagai Markdown']
  ];
  for (const [id,label,title] of actions) {
    const b=document.createElement('button'); b.type='button'; b.dataset.premiumAction=id;
    b.textContent=label;b.title=title;tools.append(b);
  }
  const counter=document.createElement('span');counter.className='editor-premium-count';
  counter.id='premiumEditorCount';counter.setAttribute('aria-live','off');tools.append(counter);
  formatbar.insertAdjacentElement('afterend',tools);
  const updateCount=()=>{
    const text=area.value.trim();
    const words=text?(text.match(/\S+/g)||[]).length:0;
    counter.textContent=`${words.toLocaleString('id-ID')} kata · ${area.value.length.toLocaleString('id-ID')} karakter`;
  };
  const insert=(before,after='',placeholder='teks',line=false)=>{
    const a=area.selectionStart,b=area.selectionEnd;
    const selected=area.value.slice(a,b)||placeholder;
    const prefix=line && a>0 && area.value[a-1]!=='\n'?'\n':'';
    const replacement=prefix+before+selected+after;
    area.focus();area.setRangeText(replacement,a,b,'select');
    area.dispatchEvent(new Event('input',{bubbles:true}));
  };
  const safeName=()=>{
    const title=document.getElementById('noteTitle')?.value||'catatan';
    return (title.normalize('NFKD').replace(/[^a-zA-Z0-9\-_ ]/g,'').trim().replace(/\s+/g,'-').slice(0,75)||'catatan')+'.md';
  };
  tools.addEventListener('click',event=>{
    const action=event.target.closest('button')?.dataset.premiumAction;
    if(!action)return;
    if(action==='heading')insert('### ','','Judul',true);
    if(action==='quote')insert('> ','','Kutipan',true);
    if(action==='code')insert('```\n','\n```','kode',true);
    if(action==='rule')insert('\n---\n','','',true);
    if(action==='undo'||action==='redo'){
      // Native editing history is browser-dependent; no destructive custom history.
      area.focus();document.execCommand?.(action==='undo'?'undo':'redo');
      area.dispatchEvent(new Event('input',{bubbles:true}));
    }
    if(action==='focus'){
      editor.classList.toggle('editor-focus');
      const on=editor.classList.contains('editor-focus');
      event.target.textContent=on?'⛶ Normal':'⛶ Fokus';
      area.focus();
    }
    if(action==='export'){
      const blob=new Blob([area.value],{type:'text/markdown;charset=utf-8'});
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a');a.href=url;a.download=safeName();
      document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
    }
  });
  area.addEventListener('input',updateCount);
  editor.addEventListener('close',()=>{editor.classList.remove('editor-focus');const b=tools.querySelector('[data-premium-action="focus"]');if(b)b.textContent='⛶ Fokus';});
  // Opening the editor is handled by app.js; refresh counts after showModal.
  const originalShow=editor.showModal.bind(editor);
  editor.showModal=function(...args){const result=originalShow(...args);updateCount();return result;};
  form.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){
      e.preventDefault();form.requestSubmit();
    }
    if(e.key==='Tab'&&e.target===area&&!e.shiftKey&&!e.ctrlKey&&!e.metaKey){
      e.preventDefault();insert('  ','','');
    }
  });
  updateCount();
}
