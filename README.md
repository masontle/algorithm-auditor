# Algorithm Auditor — Club Lab

A working prototype of Mason Le's **Algorithm Auditor: Investigating a Club Recommendation System** proposal. Students audit fictional club recommendations without writing code. No dependencies, accounts, model training, or real student data.

## Run

Install Node.js 22 or newer, then:

```sh
npm start
```

Open http://127.0.0.1:4173. Stop with Ctrl+C. Run `npm test` to verify the algorithm and evaluator. No install step is needed.

## Student walkthrough

1. Predict the winner for the poetry student before revealing the baseline result.
2. Inspect individual scores and compare overall suitability with limited-schedule and uncommon-interest groups. Record a diagnosis using evidence.
3. Change one weight or the schedule filter, write a prediction, and run a controlled comparison. Explain the result in the log before the next experiment.
4. Compare recommendation frequency and the number of distinct clubs recommended. Consider what the labels leave out.
5. Write a final reflection and export the JSON submission. It contains the last tested configuration and the full decision log. Progress persists locally when browser storage is available.

Suggested pacing: investigate 40 minutes, experiment 60 minutes, reflect/export 15 minutes. Actual timing requires a student pilot, with a target range of 1–3 hours.

## Scoring and labels

For each club, the score is `100 * (wInterest * interestMatch + wSchedule * scheduleMatch + wPopularity * popularity) / sum(weights)`. Interest match is the fraction of the student's interests covered by the club. Schedule match is binary for one meeting slot; popularity is in [0,1]. The optional filter removes unavailable clubs before ranking. Ties use club ID. A zero weight sum is rejected.

Each profile has an explicit `suitable` list used for evaluation, independent of scoring weights. In this deliberately simple sample, suitability means matching an interest and an available meeting. Top-1 suitability divides suitable first choices by all profiles, including no-result profiles as failures. Subgroup memberships overlap and denominators are displayed. Empty subgroups are N/A. Variety is distinct top-1 clubs plus frequency counts, not a claim of fairness.

Baseline weights are 30/10/60 with filtering off. Overall suitability is 70%, while both highlighted subgroups score 0%. Turning the filter on alone raises overall suitability to 90%; uncommon-interest suitability reaches 50%. An instructor demonstration using 80/10/10 and filtering reaches 100% on visible profiles. This is a designed teaching example, not evidence of real-world fairness or generalization.

## Staff evaluation and data boundary

The web server serves **only `dist/`**. Publish only that directory if hosting a student version. Never publish the repository root as the student website.

Create a local public sample fixture and smoke-test exported submissions:

```sh
node staff/make-sample.mjs
npm run evaluate -- path/to/submission.json staff/sample-profiles.json
```

The sample fixture repeats visible scenario patterns: it is **not a genuine hidden test**. For an actual assignment, staff must independently author unseen profiles, include both audited groups, use IDs disjoint from visible profiles, and keep them in `staff/private/` (ignored by Git) or outside this repository. The evaluator accepts a JSON array of profiles with `id`, `interests`, `availability`, `limited`, `uncommon`, and `suitable`; see `dist/engine.js` for the schema. Do not put private data in `dist/`, commits, screenshots, or CI artifacts. Students get no hidden-score endpoint.

```sh
npm run evaluate -- path/to/submission.json staff/private/unseen.json
```

The evaluator recomputes baseline and submitted results, ignoring student-claimed metrics. It awards only the hidden-evaluation component (25 points): ≥10 percentage-point overall gain with no subgroup decline: 25; positive gain with no subgroup decline: 20; unchanged overall with a subgroup gain and no subgroup decline: 15; unchanged overall and subgroups: 10; otherwise: 5. These prototype bands are published in the student UI and need course-staff approval/piloting.

Staff assess the remaining 75 points: decision log (40: predictions, controlled comparisons, evidence and explanation); diagnosis (25: supported failure cases and subgroup analysis); reflection (10: tradeoffs, label limitations, next test). This prototype does not automatically grade prose or authenticate exported logs. Browser logs are editable; this is a learning tool rather than a tamper-proof assessment platform.

## Scope and limitations

Implements the proposal's single scenario, three weights, schedule filter, ranked factor contributions, guided prediction, visible validation data, subgroup results, frequency view, decision log, JSON export, and offline staff evaluator. The proposal does not specify numeric weights, datasets, exact formula, or grading bands; those are explicit prototype design choices here.

Synthetic labels omit nuanced preferences, accessibility, cost, transport, meeting duration, and multi-session schedules. There is no one uniquely correct configuration. A perfect visible score is easy by design and must not be treated as proof on new data. No classroom timing or rubric reliability study has been performed. Browser storage is device-specific; export before switching devices. Fonts fall back to local sans-serif if offline.

## Layout

- `dist/`: student website and shared pure scoring engine
- `staff/`: offline evaluator and public fixture generator
- `tests/`: built-in Node tests
- `docs/github-actions-test.yml.example`: optional GitHub Actions template (copy into `.github/workflows/test.yml` after granting workflow permission)

Based on the supplied two-page proposal; the original PDF is not redistributed in this repository.


