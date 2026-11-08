// V2.1: Offline deterministic study cards, no remote API.
export function initStudy(getNotes){
 const $=id=>document.getElementById(id);let cards=[],index=0,currentId='';
 const storageKey=id=>'sbo-study-v2.1:'+id;
 function clean(s){return String(s||'').replace(/\[\[([^\]]+)\]\]/g,'$1').replace(/[`*_>#]/g,'').trim()}
 function makeCards(note){const lines=String(note.content||'').split(/\n+/).map(clean).filter(x=>x.length>18);const result=[];const seen=new Set();
 for(let i=0;i<lines.length&&result.length<24;i++){let line=lines[i];if(line.length>360)line=line.slice(0,360)+'…';const split=line.match(/^(.{5,65}?)[：:]\s*(.{12,})$/);let q,a;if(split){q='Jelaskan: '+split[1];a=split[2]}else if(i>0&&lines[i-1].length<85){q='Apa yang kamu ingat tentang: '+lines[i-1]+'?';a=line}else{q='Jelaskan isi bagian berikut dari catatan “'+note.title+'” (kartu '+(result.length+1)+').';a=line}if(seen.has(a))continue;seen.add(a);result.push({q,a})}return result}
 function refreshSelect(){const select=$('studyNote'),old=select.value;const ns=getNotes();select.replaceChildren();for(const n of ns){const opt=document.createElement('option');opt.value=n.id;opt.textContent=n.title;select.append(opt)}if(ns.some(n=>n.id===old))select.value=old;}
 function display(){const card=$('studyCard');if(!cards.length){card.hidden=true;$('studyStatus').textContent='Belum ada kartu. Pilih catatan yang berisi materi, lalu buat kartu belajar.';return}card.hidden=false;const done=JSON.parse(localStorage.getItem(storageKey(currentId))||'{}');$('studyStatus').textContent='Dikuasai: '+Object.keys(done).filter(k=>done[k]).length+' / '+cards.length+' kartu (disimpan di perangkat ini)';$('studyCounter').textContent='Kartu '+(index+1)+' dari '+cards.length;$('studyQuestion').textContent=cards[index].q;$('studyAnswer').textContent=cards[index].a;$('studyAnswer').hidden=true;$('studyReveal').hidden=false;$('studyAgain').hidden=true;$('studyKnow').hidden=true;}
 $('studyGenerate').onclick=()=>{refreshSelect();const n=getNotes().find(x=>x.id===$('studyNote').value);if(!n){$('studyStatus').textContent='Belum ada catatan aktif.';return}currentId=n.id;cards=makeCards(n);index=0;display()};
 $('studyReveal').onclick=()=>{$('studyAnswer').hidden=false;$('studyReveal').hidden=true;$('studyAgain').hidden=false;$('studyKnow').hidden=false};
 function next(known){const progress=JSON.parse(localStorage.getItem(storageKey(currentId))||'{}');progress[index]=known;localStorage.setItem(storageKey(currentId),JSON.stringify(progress));if(known){const nextIndex=cards.findIndex((_,i)=>!progress[i]);if(nextIndex===-1){$('studyCard').hidden=true;$('studyStatus').textContent='Selesai! Semua '+cards.length+' kartu sudah ditandai paham. Tekan “Ulangi progres” untuk mengulang.';return}index=nextIndex}else{index=(index+1)%cards.length}display()}
 $('studyKnow').onclick=()=>next(true);$('studyAgain').onclick=()=>next(false);
 $('studyReset').onclick=()=>{if(!currentId)return;localStorage.removeItem(storageKey(currentId));index=0;display()};
 document.querySelectorAll('[data-view="study"]').forEach(b=>b.addEventListener('click',refreshSelect));refreshSelect();
}
