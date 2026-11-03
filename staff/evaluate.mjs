import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {baseline,evaluate,validate,clubs} from '../dist/engine.js';
export function grade(submission,hidden){
 if(submission.schemaVersion!==1||submission.datasetVersion!=='clubs-v1')throw Error('Unsupported submission version');
 validate(submission.config);
 if(!Array.isArray(hidden)||!hidden.length)throw Error('Expected nonempty profile array');
 const ids=new Set();
 for(const p of hidden){
  if(!p.id||ids.has(p.id)||!Array.isArray(p.interests)||!p.interests.length||!Array.isArray(p.availability)||!Array.isArray(p.suitable)||typeof p.limited!=='boolean'||typeof p.uncommon!=='boolean'||p.suitable.some(id=>!clubs.some(c=>c.id===id)))throw Error('Invalid profile or duplicate ID');ids.add(p.id);
 }
 const before=evaluate(hidden,baseline),after=evaluate(hidden,submission.config);
 if(Object.values(before.groups).some(g=>!g.n))throw Error('Dataset must include both audited subgroups');
 const delta=after.overall.rate-before.overall.rate;
 const groupDeltas=Object.keys(before.groups).map(k=>after.groups[k].rate-before.groups[k].rate);
 const safe=groupDeltas.every(d=>d>=-1e-9);
 const points=safe&&delta>=.1-1e-9?25:safe&&delta>1e-9?20:safe&&Math.abs(delta)<1e-9&&groupDeltas.some(d=>d>1e-9)?15:safe&&Math.abs(delta)<1e-9?10:5;
 return {before,after,hiddenEvaluationPoints:points,outOf:25,note:'Prototype published bands. Staff must grade log (40), diagnosis (25), and reflection (10) separately. Recomputed metrics ignore student-supplied scores.'};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 try{const [, ,submissionPath,dataPath]=process.argv;if(!submissionPath||!dataPath)throw Error('Usage: npm run evaluate -- submission.json path/to/private-profiles.json');console.log(JSON.stringify(grade(JSON.parse(await readFile(submissionPath,'utf8')),JSON.parse(await readFile(dataPath,'utf8'))),null,2));}catch(e){console.error(e.message);process.exitCode=1;}
}
