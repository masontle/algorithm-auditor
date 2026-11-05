import {writeFile} from 'node:fs/promises';
const p={id:'sample-1',interests:['sports','poetry'],availability:['morning'],limited:true,uncommon:true,suitable:['sports-am','poetry'],context:'Either interest is acceptable.'};
await writeFile(new URL('./sample-profiles.json',import.meta.url),JSON.stringify([p],null,2));
console.log('Public smoke-test sample only; do not use for grading.');
