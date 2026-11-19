import { clipLength, roundCount, startingEstimates, compare, summarize,
  datasetVersion, responseFields, submissionEvidence } from './feed-engine.js';

const byId = id => document.getElementById(id);
const percent = value => (value * 100).toLocaleString('en', { maximumFractionDigits: 1 }) + '%';
const storageKey = 'algorithm-auditor-feed-v1';
const initial = { secondProbe: 4, started: false, round: 0, prediction: '', signal: '', tradeoff: '', limitation: '' };
let state = { ...initial };
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (saved && [4, 6].includes(saved.secondProbe) && typeof saved.started === 'boolean' &&
      Number.isInteger(saved.round) && saved.round >= 0 && saved.round <= roundCount &&
      responseFields.every(key => typeof saved[key] === 'string') &&
      (saved.started ? saved.prediction.trim() : saved.round === 0)) state = saved;
} catch { /* A fresh session can run without storage. */ }

function save() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    byId('storage-status').textContent = 'Browser storage is unavailable. Keep this tab open until you export.';
  }
}

for (const key of responseFields) {
  byId(key).value = state[key];
  byId(key).addEventListener('input', event => {
    state[key] = event.target.value;
    event.target.setCustomValidity('');
    save();
  });
}
byId('secondProbe').value = String(state.secondProbe);
byId('secondProbe').addEventListener('change', event => {
  state.secondProbe = Number(event.target.value);
  save();
});

byId('priors').innerHTML = startingEstimates.map(({ topic, estimate }) =>
  `<div><strong>${topic}</strong> ${percent(estimate)}</div>`).join('');

function card(trace) {
  const e = trace.at(-1);
  if (!e) return '<p>Ready for the first clip.</p>';
  const totals = summarize(trace);
  const why = e.mode === 'Explore'
    ? `Among the least-shown topics (${e.previousViews} earlier views).`
    : 'Highest estimated watch time before this pick.';
  return `<p class="rule">${e.mode} · ${e.topic}</p><h4>${e.clip}</h4>
    <p>${why}</p><dl><dt>Alex watched</dt><dd>${e.watched} of ${clipLength} s</dd>
    <dt>${e.topic} estimate</dt><dd>${percent(e.before)} → ${percent(e.after)}</dd>
    <dt>Total watch time</dt><dd>${totals.seconds} s</dd>
    <dt>Topics shown</dt><dd>${totals.topics} of ${startingEstimates.length}</dd></dl>`;
}

function render() {
  byId('secondProbe').disabled = state.started;
  byId('prediction').readOnly = state.started;
  byId('start').hidden = state.started;
  byId('experiment').hidden = !state.started;
  byId('assessment').hidden = state.round !== roundCount;
  if (!state.started) return;

  const feeds = compare(state.secondProbe);
  for (const key of Object.keys(feeds)) byId(key).innerHTML = card(feeds[key].slice(0, state.round));
  const rows = [];
  for (let i = 0; i < state.round; i++) {
    for (const [label, event] of [['A', feeds.familiar[i]], ['B', feeds.discovery[i]]]) {
      rows.push(`<tr><td>${event.round}</td><td>${label}</td><td>${event.mode}</td>
        <td>${event.topic} / ${event.clip}</td><td>${event.watched} s</td>
        <td>${percent(event.before)} → ${percent(event.after)}</td></tr>`);
    }
  }
  byId('rows').innerHTML = rows.join('');
  byId('history').hidden = !state.round;
  byId('progress').textContent = `Round ${state.round} of ${roundCount}`;
  byId('advance').hidden = state.round === roundCount;
  byId('advance').textContent = `Show round ${Math.min(state.round + 1, roundCount)}`;
}

function ensureAnswer(key) {
  if (state[key].trim()) return true;
  byId(key).setCustomValidity('Enter your reasoning to continue.');
  byId(key).reportValidity();
  return false;
}

byId('start-form').addEventListener('submit', event => {
  event.preventDefault();
  if (state.started || !ensureAnswer('prediction')) return;
  state.started = true;
  save();
  render();
  byId('run-title').focus();
});

byId('advance').addEventListener('click', () => {
  if (!state.started || state.round === roundCount) return;
  state.round++;
  save();
  render();
  if (state.round === roundCount) {
    byId('history').open = true;
    byId('assessment-title').focus();
  }
});

byId('export-form').addEventListener('submit', event => {
  event.preventDefault();
  if (state.round !== roundCount || !responseFields.every(ensureAnswer)) return;
  const data = { ...state, schemaVersion: 2, datasetVersion };
  Object.assign(data, submissionEvidence(data));
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'algorithm-auditor-feed.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  byId('export-status').textContent = 'Submission exported with your prediction, both feed histories and your explanations.';
});
render();
