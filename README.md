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

This automated evaluation is a pre-review screen and is not a substitute for clinician adjudication.
