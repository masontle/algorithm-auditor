export const roundCount = 6;
export const clipLength = 20;
export const datasetVersion = 'club-feed-v1';

// Each topic has its own queue. Both feeds see the same response to the same clip.
const topics = [
  { name: 'Skating', prior: 15, clips: [
    ['First kickflip', 14], ['Ramp practice', 13], ['Board setup', 15],
    ['Bank turns', 14], ['Street lines', 13], ['Wheel swap', 15],
  ] },
  { name: 'Music', prior: 10, clips: [
    ['Sound check', 3], ['Drum break', 6], ['Mic placement', 5],
    ['Bass loop', 7], ['Band practice', 9], ['First gig', 8],
  ] },
  { name: 'Making', prior: 10, clips: [
    ['Clay on the wheel', 20], ['Carving a stamp', 19], ['Glazing a mug', 18],
    ['Paper marbling', 20], ['Casting a tile', 17], ['Cutting a stencil', 19],
  ] },
];

export const startingEstimates = topics.map(({ name, prior }) => ({
  topic: name, estimate: prior / clipLength,
}));

export function simulate(probeRounds = []) {
  if (!Array.isArray(probeRounds) || new Set(probeRounds).size !== probeRounds.length ||
      probeRounds.some(r => !Number.isInteger(r) || r < 1 || r > roundCount)) {
    throw new Error('Invalid exploration rounds');
  }

  const history = topics.map(({ prior }) => ({ views: 0, seconds: prior }));
  const estimate = h => h.seconds / ((1 + h.views) * clipLength);
  const trace = [];
  for (let round = 1; round <= roundCount; round++) {
    const exploring = probeRounds.includes(round);
    // Strict comparisons preserve catalog order on ties.
    let pick = 0;
    for (let i = 1; i < topics.length; i++) {
      const better = exploring ? history[i].views < history[pick].views
                               : estimate(history[i]) > estimate(history[pick]);
      if (better) pick = i;
    }

    const item = history[pick];
    const [clip, watched] = topics[pick].clips[item.views];
    const before = estimate(item);
    const previousViews = item.views;
    item.views++;
    item.seconds += watched;
    trace.push({ round, mode: exploring ? 'Explore' : 'Exploit', topic: topics[pick].name,
      clip, watched, previousViews, before, after: estimate(item) });
  }
  return trace;
}

export function summarize(trace) {
  const seconds = trace.reduce((sum, event) => sum + event.watched, 0);
  return { seconds, topics: new Set(trace.map(event => event.topic)).size };
}

export function compare(secondProbe) {
  if (![4, 6].includes(secondProbe)) throw new Error('Choose round 4 or 6 for the second probe.');
  return { familiar: simulate(), discovery: simulate([2, secondProbe]) };
}

export const responseFields = ['prediction', 'signal', 'tradeoff', 'limitation'];

export function submissionEvidence(submission) {
  if (submission.schemaVersion !== 2 || submission.datasetVersion !== datasetVersion)
    throw new Error('Unsupported feed submission');
  if (submission.round !== roundCount || responseFields.some(key =>
    typeof submission[key] !== 'string' || !submission[key].trim())) {
    throw new Error('Finish all six rounds and answer each question before exporting.');
  }
  const feeds = compare(submission.secondProbe);
  return { feeds, totals: { familiar: summarize(feeds.familiar), discovery: summarize(feeds.discovery) } };
}
