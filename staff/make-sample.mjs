import {writeFile} from 'node:fs/promises';
import {makeProfiles} from '../dist/engine.js';
// Smoke-test fixture ONLY. Real unseen profiles must be authored independently.
await writeFile(new URL('./sample-profiles.json',import.meta.url),JSON.stringify(makeProfiles('sample',20).map((p,i)=>({...p,name:`Sample ${i+1}`})),null,2));
console.log('Wrote staff/sample-profiles.json (public sample, not a hidden test).');
