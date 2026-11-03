export const baseline={interest:30,schedule:10,popularity:60,filter:false};
export const clubs=[
 {id:'social',name:'Campus Connect',tags:['social'],slot:'evening',popularity:1},
 {id:'sports',name:'Recreation League',tags:['sports'],slot:'evening',popularity:.9},
 {id:'code',name:'Creative Computing',tags:['technology'],slot:'afternoon',popularity:.55},
 {id:'garden',name:'Community Garden',tags:['nature'],slot:'morning',popularity:.12},
 {id:'poetry',name:'Poetry Circle',tags:['poetry'],slot:'morning',popularity:.08},
 {id:'social-am',name:'Coffee & Conversation',tags:['social'],slot:'morning',popularity:.15},
 {id:'sports-am',name:'Morning Runners',tags:['sports'],slot:'morning',popularity:.2}
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
// Evaluation labels are explicit data, independent of weights and ranking.
export function makeProfiles(prefix='v',count=40){
 return Array.from({length:count},(_,i)=>{
  const type=i%10;const limited=type===7||type===8;const uncommon=type>=8;
  const interest=type===9?'nature':type===8?'poetry':type===6?'sports':'social';
  const availability=limited?['morning']:['morning','afternoon','evening'];
  const suitable=clubs.filter(c=>c.tags.includes(interest)&&availability.includes(c.slot)).map(c=>c.id);
  return {id:`${prefix}-${i+1}`,name:`Student ${i+1}`,interests:[interest],availability,limited,uncommon,suitable};
 });
}
export const profiles=makeProfiles();
export function evaluate(data,c){
 validate(c);const counts=Object.fromEntries(clubs.map(c=>[c.id,0]));
 const rows=data.map(p=>{const top=rank(p,c)[0];if(top)counts[top.club.id]++;return {p,top,ok:!!top&&p.suitable.includes(top.club.id)};});
 const summarize=rs=>({n:rs.length,good:rs.filter(r=>r.ok).length,rate:rs.length?rs.filter(r=>r.ok).length/rs.length:null});
 return {overall:summarize(rows),groups:{'Limited schedules':summarize(rows.filter(r=>r.p.limited)),'Uncommon interests':summarize(rows.filter(r=>r.p.uncommon))},counts,coverage:Object.values(counts).filter(Boolean).length,abstentions:rows.filter(r=>!r.top).length};
}
