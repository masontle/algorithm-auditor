// Executes app handlers against a simulated document. Does not verify browser rendering.
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import * as engine from '../dist/engine.js';
import {grade} from '../staff/evaluate.mjs';
const source=(await readFile(new URL('../dist/app.js',import.meta.url),'utf8')).replace(/^import .*;\r?\n/,'');
function boot(storage=new Map()){
 const elements=new Map(),entries=[];let downloaded;
 const get=id=>{if(!elements.has(id))elements.set(id,{value:'',checked:false,hidden:false,textContent:'',innerHTML:'',focus(){},insertAdjacentHTML(_,html){this.innerHTML+=html;}});return elements.get(id);};
 const context={...engine,document:{getElementById:get,querySelectorAll:()=>{entries.length=0;const saved=JSON.parse(storage.get('auditor-v2')||'{"log":[]}');saved.log.forEach((e,i)=>entries.push({dataset:{entry:String(i)},value:e.observation}));return entries;},createElement:()=>({click(){}})},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},Blob,URL:{createObjectURL:b=>{downloaded=b;return 'blob:test';},revokeObjectURL(){}},setTimeout:fn=>fn(),console};
 vm.runInNewContext(source,context);
 return {get,storage,entries,download:()=>downloaded,input(id,value){get(id).value=value;get(id).oninput?.();},observe(value){entries.at(-1).value=value;entries.at(-1).oninput();}};
}
test('prediction gate, comparisons, undo, reload, export and staff evaluation',async()=>{
 let app=boot();assert.equal(app.get('improve').hidden,true);assert.equal(app.get('submit').hidden,true);assert.equal(app.get('hint').hidden,true);assert.match(app.get('clubReference').innerHTML,/Poetry Circle/);
 app.get('reveal').onclick();assert.equal(app.get('improve').hidden,true);
 app.input('guidedPrediction','Campus Connect because popularity dominates.');app.get('reveal').onclick();assert.equal(app.get('improve').hidden,false);assert.equal(app.get('guidedPrediction').readOnly,true);
 app.get('filter').checked=true;app.get('run').onclick();assert.match(app.get('message').textContent,/prediction/);
 for(const [key,value] of [['filter',true],['interest',80],['popularity',10]]){
  if(key==='filter')app.get(key).checked=value;else app.get(key).value=value;
  app.input('prediction','Predict subgroup improvement.');app.get('run').onclick();assert.match(app.get('message').textContent,/recorded/);app.observe('Explained using subgroup and variety evidence.');
 }
 assert.match(app.get('log').innerHTML,/Limited schedules/);assert.match(app.get('log').innerHTML,/Before:/);assert.match(app.get('log').innerHTML,/Recommendation counts/);
 app.get('interest').value=5;app.get('filter').checked=false;app.get('reset').onclick();assert.equal(+app.get('interest').value,80);assert.equal(app.get('filter').checked,true);
 app.input('diagnosis','Schedule and preference evidence.');app.input('reflection','Tradeoffs and next test.');app.input('prediction','Draft for next experiment');
 app=boot(app.storage);assert.equal(app.get('improve').hidden,false);assert.equal(app.get('prediction').value,'Draft for next experiment');assert.equal(+app.get('popularity').value,10);
 app.get('export').onclick();const submission=JSON.parse(await app.download().text());assert.equal(submission.datasetVersion,'clubs-v2');assert.equal(submission.log.length,3);assert.equal(submission.config.interest,80);
 const heldout=JSON.parse(await readFile(new URL('../staff/private/unseen-v2.json',import.meta.url),'utf8').catch(()=>JSON.stringify([{id:'ci-heldout',interests:['sports','poetry'],availability:['morning'],limited:true,uncommon:true,suitable:['poetry','sports-am']}])));
 assert.ok(grade(submission,heldout).after.overall.n>0);
});
test('two edits rejected; incomplete work cannot export',()=>{const app=boot();app.input('guidedPrediction','Prediction');app.get('reveal').onclick();app.get('interest').value=80;app.get('popularity').value=10;app.input('prediction','Prediction');app.get('run').onclick();assert.match(app.get('message').textContent,/exactly one/);app.get('export').onclick();assert.equal(app.download(),undefined);});
