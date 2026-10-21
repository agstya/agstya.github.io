# Résumé tailoring workspace

Each job gets its own folder and `job.metadata.json`. Reusable career information lives under `shared-assets/`.

The initial source is your public professional site, because no current résumé was supplied. Imported facts are marked `source_observed_pending_confirmation`, not approved résumé facts. No tailored résumé has been finalized.

## Workflow

1. Read `AGENTS.md`, shared facts, and the job metadata.
2. Follow the links in `job.metadata.json`; refresh the job requirements and record the check date. If access fails, retain the last snapshot and label it stale.
3. Compare requirements with the source résumé and shared facts. Label each item supported, unclear, absent from the résumé, or confirmed experience gap. Absence of evidence is not proof of missing experience.
4. Write a prioritized gap analysis and itemized proposed changes with original/proposed text, evidence, and questions.
5. Ask the user to approve, revise, or reject each proposed skill or experience change. A request to tailor, or “use your best judgment,” is not approval of unseen claims.
6. Record explicit approval, then apply only approved changes to the job-specific draft. Never silently change shared facts.
7. Validate titles, dates, metrics, skills, and consistency before preparing a final résumé. Keep unresolved items out of the final version.

Use `templates/` for additional jobs. Store the supplied résumé in `shared-assets/source-resume/` when available. This folder is local and contains no scheduled or automatic agent execution.
