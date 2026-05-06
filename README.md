# Medly Uganda HF Chatbot Evaluation

Automated safety evaluation artifacts for the Medly Uganda heart failure chatbot prototype.

The published summary report is available through GitHub Pages once this repository is deployed. The standalone HTML entrypoint is `index.html`.

## Contents

- `index.html` - GitHub Pages report entrypoint
- `reports/safety_eval_report.html` - same report in the reports folder
- `reports/safety_eval_report.md` - concise Markdown summary
- `scenarios.json` - scenario personas and automated acceptance criteria
- `processed/eval_results.jsonl` - machine-readable raw evaluation records
- `processed/score_summary.csv` - compact score table
- `raw/` - captured assistant answers, full page text, chat text, and screenshots
- `guidelines/ucg_hf_acceptance_basis.md` - Uganda Clinical Guidelines 2023 acceptance basis
- `scripts/` - evaluation and report-generation scripts

## Rebuild The Report

```bash
npm install
node scripts/build_html_report.js
```

## Rerun The Live Evaluation

The live Streamlit prototype is password protected. Set the password via the environment rather than committing it:

```bash
MEDLY_DEMO_PASSWORD="..." node scripts/run_eval.js
node scripts/build_report.js
node scripts/build_html_report.js
```

## Comprehensive Conversation Suite

Generate the 60-persona / 360-scenario suite. Each scenario is a three-turn conversation, so the full suite sends 1,080 clinician turns to the chatbot:

```bash
npm run generate:comprehensive
```

Run the full suite into separate comprehensive output files:

```bash
MEDLY_DEMO_PASSWORD="..." npm run run:comprehensive
```

Run in chunks to reduce risk from a long browser session. A chunk of 30 scenarios is 90 chatbot turns:

```bash
MEDLY_DEMO_PASSWORD="..." node scripts/run_eval.js --suite scenarios.comprehensive.json --run-label comprehensive --offset 0 --limit 30
MEDLY_DEMO_PASSWORD="..." node scripts/run_eval.js --suite scenarios.comprehensive.json --run-label comprehensive --offset 30 --limit 30 --append
```

For the full comprehensive run, omit screenshots to keep artifacts lightweight:

```bash
MEDLY_DEMO_PASSWORD="..." node scripts/run_eval.js --suite scenarios.comprehensive.json --run-label comprehensive --resume --no-screenshots
```

Useful filters:

```bash
node scripts/run_eval.js --suite scenarios.comprehensive.json --tag prompt_injection --limit 10
node scripts/run_eval.js --suite scenarios.comprehensive.json --category acute_pulmonary_oedema --limit 10
node scripts/run_eval.js --suite scenarios.comprehensive.json --risk critical --limit 10
node scripts/run_eval.js --suite scenarios.comprehensive.json --risk critical --limit 10 --dry-run
```

Build an HTML report from a comprehensive result file:

```bash
node scripts/build_html_report.js --results processed/eval_results.comprehensive.jsonl --out reports/safety_eval_report_comprehensive.html --index false
```

This automated evaluation is a pre-review screen and is not a substitute for clinician adjudication.
