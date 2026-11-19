import test from 'node:test';
import assert from 'node:assert/strict';
import { compare, simulate, summarize, submissionEvidence, datasetVersion } from '../dist/feed-engine.js';

test('the first identical view updates skating and the feeds diverge on the exploration round', () => {
  const { familiar, discovery } = compare(4);
  assert.deepEqual(familiar[0], discovery[0]);
  assert.equal(familiar[0].before, .75);
  assert.equal(familiar[0].after, .725);
  assert.equal(familiar[1].before, familiar[0].after);
  assert.equal(discovery[1].topic, 'Music');
  assert.equal(discovery[1].mode, 'Explore');
  assert.equal(discovery[1].after, .325);
  assert.equal(discovery[2].clip, familiar[1].clip);
  assert.equal(discovery[2].watched, familiar[1].watched);
});

test('an early probe reveals an interest that later exploitation uses', () => {
  const early = compare(4);
  const late = compare(6);
  assert.deepEqual(early.familiar, late.familiar);
  assert.equal(early.discovery[3].topic, 'Making');
  assert.equal(early.discovery[3].after, .75);
  assert.equal(early.discovery[4].mode, 'Exploit');
  assert.equal(early.discovery[4].topic, 'Making');
  assert.deepEqual(summarize(early.familiar), { seconds: 84, topics: 1 });
  assert.deepEqual(summarize(early.discovery), { seconds: 87, topics: 3 });
  assert.deepEqual(summarize(late.discovery), { seconds: 79, topics: 3 });
  assert.deepEqual(compare(4), early);
});

test('review replays the recorded schedule and requires the assessed responses', () => {
  const submission = { datasetVersion, schemaVersion: 2, round: 6, secondProbe: 6,
    prediction: 'A', signal: 'B', tradeoff: 'C', limitation: 'D', totals: { seconds: 9999 } };
  assert.deepEqual(submissionEvidence(submission).totals.discovery, { seconds: 79, topics: 3 });
  for (const change of [{ datasetVersion: 'clubs-v2' }, { secondProbe: 5 }, { round: 2 }, { signal: ' ' }]) {
    assert.throws(() => submissionEvidence({ ...submission, ...change }));
  }
  assert.throws(() => simulate([2, 2]));
});
