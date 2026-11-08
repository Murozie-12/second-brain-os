// Offline, extractive search engine: no generative model or network requests.
const stop=new Set('yang dan atau dengan untuk dari pada dalam adalah ini itu juga serta agar karena oleh telah akan dapat tentang sebagai kepada tersebut suatu lebih antara tidak saya kamu apa siapa kapan dimana bagaimana mengapa apakah jelaskan tolong cari catatan ringkas rangkum'.split(' '));
const words=s=>(String(s||'').toLocaleLowerCase('id-ID').match(/[\p{L}\p{N}]{3,}/gu)||[]).filter(w=>!stop.has(w));
const sentences=s=>String(s||'').replace(/\[\[([^\]]+)\]\]/g,'$1').replace(/[#*_`>|]/g,' ').split(/(?<=[.!?])\s+|\n+/u).map(x=>x.trim()).filter(x=>x.length>22).slice(0,180);
const score=(text,terms)=>{const t=words(text);const counts=new Map();for(const w of t)counts.set(w,(counts.get(w)||0)+1);return terms.reduce((sum,w)=>sum+(counts.has(w)?1+Math.log1p(counts.get(w)):0),0)};
export function analyzeKnowledge(notes,query,mode='ask'){
 const terms=[...new Set(words(query))];if(!terms.length)return {answer:'Gunakan topik atau kata kunci yang lebih spesifik.',sources:[]};
 const ranked=notes.map(n=>({n,rank:score(n.title,terms)*3+score(n.tags?.join(' '),terms)*2+score(n.content,terms)})).filter(x=>x.rank>0).sort((a,b)=>b.rank-a.rank).slice(0,6);
 if(!ranked.length)return {answer:'Belum ada catatan aktif yang cocok dengan topik tersebut. Coba kata kunci lain. Tidak ada informasi yang ditambahkan dari luar catatan.',sources:[]};
 const candidates=ranked.flatMap(({n})=>sentences(n.content).map(sentence=>({n,sentence,rank:score(sentence,terms)}))).filter(x=>x.rank>0).sort((a,b)=>b.rank-a.rank);
 const unique=[];const seen=new Set();for(const x of candidates){const k=x.sentence.toLowerCase();if(!seen.has(k)){unique.push(x);seen.add(k)}if(unique.length>=5)break}
 const sources=ranked.map(({n})=>({id:n.id,title:n.title,excerpt:(sentences(n.content)[0]||'Buka catatan untuk membaca isi lengkap.').slice(0,140)}));
 if(mode==='keywords'){const freq=new Map();for(const {n} of ranked)for(const w of words(n.title+' '+n.tags.join(' ')+' '+n.content).slice(0,1500))freq.set(w,(freq.get(w)||0)+1);const top=[...freq].sort((a,b)=>b[1]-a[1]).slice(0,14).map(x=>x[0]);return {answer:'Kata kunci dominan dari catatan yang cocok:\n'+top.join(' · '),sources}}
 if(!unique.length)return {answer:'Ditemukan '+ranked.length+' catatan yang cocok berdasarkan judul atau tag, tetapi belum ada kalimat isi yang dapat dikutip. Buka sumber untuk memeriksanya.',sources};
 const lines=unique.slice(0,mode==='summary'?5:3).map(x=>'• '+x.sentence.slice(0,420)+'\n  — '+x.n.title);
 return {answer:(mode==='summary'?'Ringkasan ekstraktif (kalimat asli dari catatan):':'Bagian catatan yang paling relevan (bukan jawaban generatif):')+'\n\n'+lines.join('\n\n')+'\n\nPeriksa sumber asli sebelum menggunakan hasil ini sebagai fakta atau sitasi.',sources};
}
