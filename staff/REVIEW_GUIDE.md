# Assessing the feed experiment

Students investigate a single question. When should a feed spend a recommendation learning about an unfamiliar topic? Ask students to save a prediction, observe both feeds for six rounds, and support their policy choice using the exported history. To compare schedules in class, have some students probe on rounds 2 and 4 and others on rounds 2 and 6.

## Worked results

The skating estimate begins at 75%, equivalent to one imagined 15-second view. In round 1 both feeds show “First kickflip.” Watching 14 of 20 seconds moves the estimate to (15 + 14) / 40 = 72.5%. In round 2, Feed A returns to skating. Feed B breaks a least-shown tie in catalog order and tries music. Alex watches 3 seconds, moving music from 50% to 32.5%. The probe costs 10 seconds against Feed A that round.

| Six-round policy | Total watch time | Distinct topics |
| --- | ---: | ---: |
| Always exploit | 84 s | 1 |
| Explore in rounds 2 and 4 | 87 s | 3 |
| Explore in rounds 2 and 6 | 79 s | 3 |

The first making clip receives a full watch. With an early probe the estimate rises to 75%, above skating’s 70%. Feed B exploits that discovery in rounds 5 and 6. A final-round probe reaches the same variety but leaves no opportunity to use the update. Each feed observes only the clips it selects. An unshown topic retains its starting estimate. Fixed responses and equal-length clips isolate the policy choice for this viewer. They do not establish a generally optimal schedule or what Alex actually enjoys.

## Suggested manual rubric (10 points)

| Criterion | Full-credit evidence | Points |
| --- | --- | ---: |
| Prediction | Predicts both measures and gives a reason tied to the policies. An unexpected result can receive full credit. | 2 |
| Feedback loop | Identifies a real viewing event, correctly traces the estimate change, and connects it to a later choice. | 3 |
| Exploration decision | Identifies a probe, compares both feeds on watch seconds and topics, and uses the tradeoff to defend a schedule. | 3 |
| Signal limitation | Gives a plausible alternative interpretation of watch time and a concrete way to check it. | 2 |

Award one point per element in each row. Either schedule can earn full credit with a defensible explanation. Read the learner’s words alongside the trace. The offline command regenerates the expected evidence from the schedule and dataset version:

```sh
npm run evaluate -- path/to/algorithm-auditor-feed.json
```

Progress and exports are editable. This command supports instructor review. It does not grade prose or authenticate a submission. The [club audit review guide](CLUB_AUDIT_REVIEW.md) covers the separate extension and its evaluator.
