# Change Request UAT training — operator enablement (artifact 3)

The operator-facing half of the same provider-change pipeline. I partnered with our systems lead to redesign the Cognito-to-SugarCRM intake, then built this self-paced, interactive UAT training tool with AI-generated voice narration to roll the new workflow out to the operations team and validate it through structured Happy Path, Negative, and Edge test cases. The narration was produced with a scripted ElevenLabs voiceover pipeline (22 cards, locked model settings, with cost and secrets-handling guardrails).

Where it fits in the application: the submissions plugin is the autonomous back-end; this is the human-operator enablement and change-management layer in front of it. Together they show the build-and-enable range Ramp's role asks for.

## Notes

- All providers, NPIs, tax IDs, practice names, and addresses shown are synthetic. The real test data was scrubbed for this public copy; the original stays in the internal project folder.
- Self-contained: open `PrincetonPO_UAT_Training_PUBLIC.html` in a browser. Narration plays from the bundled `audio/` folder (best once hosted, since some browsers block audio on local file:// pages).
