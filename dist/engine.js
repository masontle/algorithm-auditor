export const baseline={interest:30,schedule:10,popularity:60,filter:false};
export const clubs=[
 {id:'social',name:'Campus Connect',tags:['social'],slot:'evening',popularity:1},
 {id:'sports',name:'Recreation League',tags:['sports'],slot:'evening',popularity:.9},
 {id:'code',name:'Creative Computing',tags:['technology'],slot:'afternoon',popularity:.55},
 {id:'garden',name:'Community Garden',tags:['nature'],slot:'morning',popularity:.12},
 {id:'poetry',name:'Poetry Circle',tags:['poetry'],slot:'morning',popularity:.08},
 {id:'social-am',name:'Coffee & Conversation',tags:['social'],slot:'morning',popularity:.15},
 {id:'sports-am',name:'Morning Runners',tags:['sports'],slot:'morning',popularity:.2},
 {id:'salon',name:'Small-group Story Salon',tags:['social','poetry'],slot:'morning',popularity:.1}
];
export function validate(c){
 if(!c||typeof c.filter!=='boolean'||!['interest','schedule','popularity'].every(k=>Number.isFinite(c[k])&&c[k]>=0&&c[k]<=100)||c.interest+c.schedule+c.popularity===0) throw Error('Use weights from 0 to 100, with at least one positive weight, and a boolean filter.');
 return c;
}
export function rank(p,c){
 validate(c);const total=c.interest+c.schedule+c.popularity;
 return clubs.map(club=>{
  const interest=club.tags.filter(t=>p.interests.includes(t)).length/p.interests.length;
  const schedule=Number(p.availability.includes(club.slot));
  const parts={interest:100*c.interest*interest/total,schedule:100*c.schedule*schedule/total,popularity:100*c.popularity*club.popularity/total};
  return {club,interest,schedule,parts,score:Object.values(parts).reduce((a,b)=>a+b,0)};
 }).filter(r=>!c.filter||r.schedule).sort((a,b)=>b.score-a.score||a.club.id.localeCompare(b.club.id));
}
// Labels include stated preferences that the three-factor algorithm cannot see.
export const datasetVersion='clubs-v2';
export const guidedProfile={id:'guided',name:'Guided student',interests:['poetry'],availability:['morning'],limited:true,uncommon:true,suitable:['poetry'],context:'Wants a poetry discussion they can attend.'};
const interestSets=[['social'],['sports'],['technology'],['poetry'],['nature'],['social','sports'],['social','poetry'],['technology','nature'],['sports','nature'],['poetry','nature']];
const schedules=[['morning'],['evening'],['morning','afternoon'],['morning','afternoon','evening']];
export const profiles=interestSets.flatMap((interests,i)=>schedules.map((availability,j)=>({
 id:`v-${i*4+j+1}`,name:`Student ${i*4+j+1}`,interests,availability,limited:availability.length===1,uncommon:interests.some(t=>['poetry','nature'].includes(t)),
 suitable:clubs.filter(c=>c.tags.some(t=>interests.includes(t))&&availability.includes(c.slot)).map(c=>c.id),
 context:'Any club matching at least one stated interest and an available meeting is suitable.'
})));
// Same observable features, opposing explicit labels: no global weights can satisfy both.
profiles.push(
 {id:'v-41',name:'Student 41',interests:['social','poetry'],availability:['morning','evening'],limited:false,uncommon:true,suitable:['social'],context:'Likes social activities and poetry but prioritizes a large social network; only Campus Connect meets that preference.'},
 {id:'v-42',name:'Student 42',interests:['social','poetry'],availability:['morning','evening'],limited:false,uncommon:true,suitable:['salon'],context:'Likes social activities and poetry but needs a small conversation group; only Small-group Story Salon meets that preference.'}
);
export function evaluate(data,c){
 validate(c);const counts=Object.fromEntries(clubs.map(c=>[c.id,0]));
 const rows=data.map(p=>{const top=rank(p,c)[0];if(top)counts[top.club.id]++;return {p,top,ok:!!top&&p.suitable.includes(top.club.id)};});
 const summarize=rs=>({n:rs.length,good:rs.filter(r=>r.ok).length,rate:rs.length?rs.filter(r=>r.ok).length/rs.length:null});
 return {overall:summarize(rows),groups:{'Limited schedules':summarize(rows.filter(r=>r.p.limited)),'Uncommon interests':summarize(rows.filter(r=>r.p.uncommon))},counts,coverage:Object.values(counts).filter(Boolean).length,abstentions:rows.filter(r=>!r.top).length};
}

// Explicit population-mix demonstration: repeated profiles are weighting, not new cases.
export const illustrativeCohort=[...profiles,...Array.from({length:100},(_,i)=>({id:`mix-${i}`,interests:['social'],availability:['morning','afternoon','evening'],limited:false,uncommon:false,suitable:['social','social-am']}))];
