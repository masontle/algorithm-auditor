# Algorithm Auditor

A no-code experiment about how a short-video feed learns what to show next. Students predict what two policies will do, watch them recommend clips to the same fictional viewer, and defend an exploration schedule using evidence. The activity runs locally with synthetic viewing behavior.

## Run the lab

Use Node.js 22 or newer. No package installation is required.

```sh
npm start
```

Open [the feed experiment](http://127.0.0.1:4173/). Run `npm test` to verify the recommendation engines and assessment workflows. For static hosting, publish the contents of `dist/`.

## What students learn

| Learning goal | Evidence students submit |
| --- | --- |
| Explain how an implicit signal changes a later recommendation | Trace a clip, its watch fraction, its updated topic estimate and a subsequent choice. |
| Distinguish exploitation from exploration and reason about their tradeoff | Predict the result, identify a probe, compare both feeds’ total watch seconds and topic coverage, and defend a schedule. |
| Interpret watch time as an imperfect measure of interest | Give another explanation for a viewing event and propose evidence that would distinguish the two. |

Both feeds start with identical topic estimates and draw from the same per-topic clip queues. Each clip has a fixed fictional response. Feed A always chooses the highest estimate. Feed B probes the least-shown topic on round 2 and again on the learner’s choice of round 4 or 6. Both policies update estimates from observed watch fractions. This small deterministic example lets a class reproduce a result and inspect every decision.

Read the [student guide](STUDENT_GUIDE.md) for the activity and the [instructor guide](staff/REVIEW_GUIDE.md) for the rubric and worked results. The exported JSON includes the original prediction, schedule, round histories, totals and written answers. Browser progress stays on that device.

## Club audit extension

The [original club audit](http://127.0.0.1:4173/club-audit.html) covers weighted ranking, subgroup suitability and held-out evaluation. Its existing browser progress and submissions still work. See the [club activity documentation](docs/club-audit.md).
