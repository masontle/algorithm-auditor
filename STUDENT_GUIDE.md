# Investigate a recommendation feed

Your task is to explain how a feed learns from what Alex watches and decide when it is worth trying an unfamiliar topic. Open the feed experiment using the README. You can do the activity without writing code.

1. **Predict.** Read the three starting estimates. Feed A picks the topic with the highest estimate every round. Feed B uses two rounds to sample the least-shown topic. Choose the timing of the second probe and predict which feed will show more topics and which will accumulate more watch time. Give your reasoning before revealing either feed.
2. **Follow the evidence.** Reveal one round at a time. Compare the clips, the seconds watched out of 20, and the estimates before and after. Find a case where a viewing event helps explain a later pick. To check an estimate by hand, add the imagined starting watch fraction to the observed fractions for that topic, then divide by the number of fractions you added.
3. **Defend a policy.** Use the round history to cite a specific exploration decision. Compare total seconds watched and distinct topics shown in both feeds. Explain which timing you would choose for another six-round session and why. If an outcome surprised you, explain how it differed from your prediction.
4. **Question the signal.** Describe a reason Alex might watch a clip besides liking it. Name another observation that could help you distinguish those explanations.
5. **Submit.** Export the JSON after all six rounds and submit it through your instructor’s course channel. Your progress resumes in the same browser. Keep the exported file if you change devices.

The club audit linked in the header is an optional, separate exercise. Its [walkthrough](docs/club-student-guide.md) covers weighted ranking.
