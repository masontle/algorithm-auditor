import test from 'node:test';
import assert from 'node:assert/strict';
import {baseline,profiles,rank,evaluate,validate} from '../dist/engine.js';
import {grade} from '../staff/evaluate.mjs';
test('guided counterexample exposes popularity bias with exact contributions',()=>{
 const rows=rank(profiles[8],baseline);assert.equal(rows[0].club.id,'social');assert.equal(rows[0].score,60);assert.equal(rows.find(r=>r.club.id==='poetry').score,44.8);assert.equal(profiles[8].suitable.includes(rows[0].club.id),false);
});
test('aggregate conceals subgroup failures',()=>{const r=evaluate(profiles,baseline);assert.equal(r.overall.rate,.7);assert.equal(r.groups['Limited schedules'].rate,0);assert.equal(r.groups['Uncommon interests'].rate,0);assert.equal(r.groups['Limited schedules'].n,8);});
test('a controlled filter change improves overall while preserving remaining failure',()=>{const r=evaluate(profiles,{...baseline,filter:true});assert.equal(r.overall.rate,.9);assert.equal(r.groups['Limited schedules'].rate,1);assert.equal(r.groups['Uncommon interests'].rate,.5);});
test('interest emphasis and filter improve all groups and variety',()=>{const r=evaluate(profiles,{interest:80,schedule:10,popularity:10,filter:true});assert.equal(r.overall.rate,1);assert.equal(r.groups['Limited schedules'].rate,1);assert.equal(r.groups['Uncommon interests'].rate,1);assert.ok(r.coverage>evaluate(profiles,baseline).coverage);});
test('normalization leaves rankings and totals unchanged under scaled weights',()=>{const a=rank(profiles[0],{interest:3,schedule:1,popularity:6,filter:false}),b=rank(profiles[0],baseline);assert.deepEqual(a.map(r=>r.club.id),b.map(r=>r.club.id));a.forEach((r,i)=>assert.ok(Math.abs(r.score-b[i].score)<1e-9));});
test('filter can produce no result and it counts as a failure',()=>{const p={...profiles[0],availability:[],suitable:[]};assert.equal(rank(p,{...baseline,filter:true}).length,0);assert.equal(evaluate([p],{...baseline,filter:true}).overall.rate,0);});
test('invalid inputs rejected and empty subgroup is N/A',()=>{for(const c of [{...baseline,interest:-1},{...baseline,interest:NaN},{interest:0,schedule:0,popularity:0,filter:false},{...baseline,filter:'true'}])assert.throws(()=>validate(c));assert.equal(evaluate([],baseline).overall.rate,null);});
test('staff evaluator recomputes metrics and applies published band',()=>{const r=grade({schemaVersion:1,datasetVersion:'clubs-v1',config:{interest:80,schedule:10,popularity:10,filter:true},claimedScore:999},profiles);assert.equal(r.hiddenEvaluationPoints,25);assert.equal(r.after.overall.rate,1);assert.equal(grade({schemaVersion:1,datasetVersion:'clubs-v1',config:baseline},profiles).hiddenEvaluationPoints,10);});
test('staff rejects unsupported submissions and incomplete group data',()=>{assert.throws(()=>grade({schemaVersion:2},profiles));assert.throws(()=>grade({schemaVersion:1,datasetVersion:'clubs-v1',config:baseline},[profiles[0]]));});

