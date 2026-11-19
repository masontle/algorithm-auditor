# Club audit extension

Start the server with `npm start` and open [the club audit](http://127.0.0.1:4173/club-audit.html). Students can follow the [club investigation guide](club-student-guide.md). The [instructor notes](../staff/CLUB_AUDIT_REVIEW.md) include a worked demonstration and assessment rubric.

## Scoring and labels

Each club’s score is 100 times the weighted mean of interest match, schedule match and popularity. Interest match is the fraction of the student’s interests covered by the club. Schedule match is binary, and popularity ranges from 0 to 1. The optional schedule filter removes unavailable clubs before ranking. Ties use club ID. The sum of the three weights must be positive.

The dataset includes 42 profiles across 41 interest and availability combinations. Each profile has an explicit list of suitable clubs. Top-choice suitability includes every profile in the denominator, including profiles that receive no recommendation. Subgroups overlap. Variety counts how many clubs receive a top recommendation. Two students with identical scoring inputs and conflicting preferences illustrate the limits of the available features.

## Review submissions

The original activity uses the `auditor-v2` browser storage key and exports schema version 1 with dataset version `clubs-v2`. To try the offline evaluator with a public sample fixture, run:

```sh
node staff/make-sample.mjs
npm run evaluate -- path/to/submission.json staff/sample-profiles.json
```

For a held-out assessment, supply independently authored profiles from outside the public site or from the ignored `staff/private/` directory. Each profile requires `id`, `interests`, `availability`, `limited`, `uncommon` and `suitable` fields. The evaluator requires unseen IDs and interest/schedule combinations and representation of both audited groups. Publish only `dist/` when hosting.

Staff assess the decision log (40 points), diagnosis (25), and reflection (10). The offline evaluator recomputes the remaining 25-point component on held-out profiles using the published prototype bands. Browser logs and exports are editable.
