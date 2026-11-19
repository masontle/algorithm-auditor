# Instructor and supervisor review guide

## Changes addressing the review

1. Prediction: results and tuning are hidden until a nonempty prediction is saved; the club reference supplies the necessary inputs without ranking them. The saved guided prediction is locked. A first-case hint unlocks afterward.
2. Data: 42 validation profiles contain 41 distinct interest/schedule combinations, multiple interests, missing suitable opportunities, and a pair with opposing club-size preferences. Context and labels are visible for diagnosis. This is deliberately constructed teaching data, not a representative campus sample.
3. Tradeoffs: Students 41 and 42 have identical algorithm inputs but disjoint labels. No weight configuration can satisfy both. Preferences are explicit rather than arbitrary labels. No-club cases also distinguish catalog limitations from ranking errors. Students must discuss which inputs or opportunities would need changing.
4. Evidence: each experiment retains and displays before/after rules, overall and subgroup rates, variety, recommendation counts, and no-result counts. Undo untested edits restores the last run, so it never violates the one-change rule. Predictions in progress survive reload.
5. Assessment: the offline evaluator checks dataset version and rejects visible profile combinations. Twelve separately authored held-out cases are stored locally in ignored `staff/private/unseen-v2.json`; they are not in the student website or GitHub repository. Instructors cloning the repository must author their own. Genuine classroom validity still needs a pilot.

## Instructor demonstration (do not distribute as student guidance)

Baseline suitability is 13/42 (31.0%); limited schedules 5/20; uncommon interests 5/26. Filtering alone yields 28/42, and weights 80/10/10 with filtering yield 35/42. Neither is a perfect answer. The balanced validation set now emphasizes diagnosis rather than a realistic high overall average; discuss how different population proportions could make an average look reassuring. The student view also shows a clearly labeled population-mix demonstration: adding 100 flexible social-interest copies gives a 79.6% baseline average while subgroup rates stay low. These are weighting copies, not independent new cases. A representative real-world cohort would require separate design.

## Prose grading rubric (75 points)

Decision log, 40: predictions tied to factors (10); at least three one-setting comparisons (10); correct interpretation of overall, subgroup and variety evidence (10); explanations including an unsuccessful or surprising result (10). Per criterion award full credit for specific correct evidence, half for incomplete or partly supported reasoning, zero for absent or unsupported work.

Diagnosis, 25: documented schedule failure with score evidence (10); documented preference conflict or catalog limitation (10); distinction between label assumptions and actual student welfare (5). Full/half/zero anchors follow the rule above.

Reflection, 10: defensible benefits/harms tradeoff (4); limitations of labels and omitted inputs (3); concrete next test (3). Full/half/zero anchors follow the rule above. Staff review prose manually; editable exports are not authenticated assessment records.

Hidden evaluation, 25: use the published prototype bands in the student UI and evaluator. Approve these bands before graded use; zero-opportunity cases impose an attainable ceiling. Do not disclose held-out scores during tuning. Do not rank students against each other.

## Verification status

All 10 automated checks pass, including application-handler simulation through reload, JSON export and offline evaluation. The in-app browser preview timed out again during this revision, so visual layout, actual downloads and keyboard/mobile behavior remain unverified. This is the remaining release check, along with the student pilot.

## Browser acceptance checklist (must pass before student release)

- Fresh storage: reference visible; answer, tuning and results hidden; blank prediction cannot unlock.
- Save prediction: answer and investigation unlock; recorded prediction remains fixed.
- Change one setting, predict and run; inspect every before/after metric. Two changes or blank predictions are rejected.
- Explain the run; undo untested edits; make two further experiments.
- Reload: prediction, diagnosis, reflection, log and last tested controls are restored.
- Export: download opens as JSON with datasetVersion clubs-v2 and three explained experiments. Evaluate that exact file offline.
- Keyboard-only navigation, 200% zoom, narrow/mobile layout, labels and focus indicators are usable.
- Confirm `/staff/private/unseen-v2.json` and `/../staff/evaluate.mjs` cannot be served.

## Pilot before release

Run with 3-5 students unfamiliar with the implementation. Record completion times, places requiring hints, interpretation of subgroup denominators and normalized weights, export success, and ability to explain the conflicting-preference pair. Have two staff independently score the same responses and resolve rubric disagreements. Adjust pacing using observed times; do not claim the two-hour target is validated until then.
