import {baseline,clubs,profiles,rank,evaluate,validate} from './engine.js';
const $=id=>document.getElementById(id),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state={config:{...baseline},log:[],guidedPrediction:'',diagnosis:'',reflection:'',revealed:false};
try{const saved=JSON.parse(localStorage.getItem('auditor-v1'));if(saved){validate(saved.config);if(!Array.isArray(saved.log))throw Error();state={...state,...saved};}}catch{}
function save(){try{localStorage.setItem('auditor-v1',JSON.stringify(state));}catch{$('message').textContent='Browser storage unavailable. Export to keep your work.';}}
for(const k of ['interest','schedule','popularity'])$('controls').insertAdjacentHTML('beforeend',`<label for="${k}">${k[0].toUpperCase()+k.slice(1)} <output id="${k}Value"></output></label><input id="${k}" type="range" min="0" max="100" step="5">`);
function controls(c){for(const k of ['interest','schedule','popularity']){$(k).value=c[k];$(k+'Value').textContent=c[k];}$('filter').checked=c.filter;}
controls(state.config);for(const k of ['interest','schedule','popularity'])$(k).oninput=()=>$(k+'Value').textContent=$(k).value;
for(const k of ['guidedPrediction','diagnosis','reflection']){$(k).value=state[k];$(k).oninput=()=>{state[k]=$(k).value;save();};}
$('profile').innerHTML=profiles.map(p=>`<option value="${p.id}">${p.name} · ${p.interests.join(', ')}${p.limited?' · limited schedule':''}</option>`).join('');$('profile').value='v-9';
const pct=n=>n===null?'N/A':`${(n*100).toFixed(1)}%`;
function render(){
 const b=evaluate(profiles,baseline),r=evaluate(profiles,state.config),items=[['Overall',b.overall,r.overall],...Object.keys(b.groups).map(k=>[k,b.groups[k],r.groups[k]])];
 $('metrics').innerHTML='<table><tr><th>Group (n)</th><th>Baseline</th><th>Last run</th><th>Change</th></tr>'+items.map(([k,x,y])=>`<tr><td>${k} (${y.n})</td><td>${pct(x.rate)}</td><td>${pct(y.rate)}</td><td>${((y.rate-x.rate)*100).toFixed(1)} pp</td></tr>`).join('')+'</table>';
 $('variety').innerHTML=`<p>${r.coverage} of ${clubs.length} clubs recommended (baseline ${b.coverage}); ${r.abstentions} no-result profiles.</p>`+clubs.map(c=>`<div class="bar"><span>${c.name}</span><div class="track"><div class="fill" style="width:${100*r.counts[c.id]/profiles.length}%"></div></div><span>${r.counts[c.id]}</span></div>`).join('');
 const p=profiles.find(p=>p.id===$('profile').value);$('profileInfo').textContent=`Interests: ${p.interests.join(', ')}. Available: ${p.availability.join(', ')}. Known suitable clubs: ${p.suitable.join(', ')}.`;
 $('ranking').innerHTML=rank(p,state.config).map(r=>`<tr><td>${r.club.name}<small>${r.club.slot}</small></td><td>${r.parts.interest.toFixed(1)}</td><td>${r.parts.schedule.toFixed(1)}</td><td>${r.parts.popularity.toFixed(1)}</td><td><strong>${r.score.toFixed(1)}</strong></td><td>${p.suitable.includes(r.club.id)?'Yes':'No'}</td></tr>`).join('')||'<tr><td colspan="6">No available clubs. This counts as unsuitable.</td></tr>';
 $('log').innerHTML=state.log.map((e,i)=>`<div class="entry"><strong>Experiment ${i+1} · ${esc(e.changed)}</strong><p>Prediction: ${esc(e.prediction)}</p><p>Overall: ${pct(e.before.overall.rate)} → ${pct(e.after.overall.rate)}</p><label>What happened? Explain the evidence and tradeoff.<textarea data-entry="${i}">${esc(e.observation||'')}</textarea></label></div>`).join('')||'<p class="muted">Your first experiment starts with a prediction.</p>';
 document.querySelectorAll('[data-entry]').forEach(el=>el.oninput=()=>{state.log[Number(el.dataset.entry)].observation=el.value;save();});
 if(state.revealed){$('guided').hidden=false;$('guided').textContent='Baseline winner: '+rank(profiles[8],baseline)[0].club.name+'. The top choice is unsuitable. Trace the contributions below to explain why.';}
}
$('profile').onchange=render;
$('reveal').onclick=()=>{if(!$('guidedPrediction').value.trim()){$('guidedPrediction').focus();return;}state.revealed=true;save();render();};
$('reset').onclick=()=>{controls(baseline);$('message').textContent='Controls restored. The results still show your last tested settings. Change just one setting from the last run.';};
$('run').onclick=()=>{
 try{
  const c=validate({interest:+$('interest').value,schedule:+$('schedule').value,popularity:+$('popularity').value,filter:$('filter').checked});
  const changed=Object.keys(baseline).filter(k=>c[k]!==state.config[k]);
  if(changed.length!==1)throw Error('Change exactly one setting from your last tested configuration.');
  if(!$('prediction').value.trim())throw Error('Record your prediction before running.');
  if(state.log.length&&!state.log.at(-1).observation?.trim())throw Error('Explain your last experiment before starting another.');
  state.log.push({at:new Date().toISOString(),changed:changed[0],from:{...state.config},to:c,prediction:$('prediction').value.trim(),before:evaluate(profiles,state.config),after:evaluate(profiles,c),observation:''});state.config=c;save();render();$('prediction').value='';$('message').textContent='Comparison recorded. Explain what happened in your decision log.';
 }catch(e){$('message').textContent=e.message;}
};
$('export').onclick=()=>{
 if(!state.revealed||!state.diagnosis.trim()||!state.reflection.trim()||!state.log.length||state.log.some(e=>!e.observation?.trim())){$('exportMessage').textContent='Complete the guided prediction, diagnosis, at least one explained experiment, and reflection before export.';return;}
 const data={schemaVersion:1,datasetVersion:'clubs-v1',exportedAt:new Date().toISOString(),...state};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='algorithm-auditor-submission.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('exportMessage').textContent='Submission exported. Staff will evaluate your last tested configuration.';
};render();
