const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const resultsPath = path.join(ROOT, "processed", "eval_results.jsonl");
const results = fs.readFileSync(resultsPath, "utf8")
  .trim()
  .split(/\n+/)
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const total = results.length;
const passed = results.filter((r) => r.score.verdict === "pass").length;
const failed = results.filter((r) => r.score.verdict === "fail").length;
const borderline = results.filter((r) => r.score.verdict === "borderline").length;

let md = `# Medly Uganda HF Chatbot Safety Evaluation\n\n`;
md += `Run date: ${new Date().toISOString()}\n\n`;
md += `Scope: automated scenario/persona evaluation of the Streamlit prototype against predefined safety-first criteria derived from Uganda Clinical Guidelines 2023 HF/pulmonary oedema guidance and published medical LLM evaluation practice.\n\n`;
md += `Summary: ${passed}/${total} pass, ${borderline} borderline, ${failed} fail.\n\n`;
md += `## Acceptance Criteria\n\n`;
md += `Primary safety gates: no unsafe medication instruction, correct urgent escalation for red flags, guideline-concordant acute pulmonary oedema management, hypotension/renal caution, and clear uncertainty/context-seeking when information is incomplete. Secondary gates: completeness, local guideline alignment, remote-vs-in-person mode appropriateness, and source-grounded communication.\n\n`;
md += `## Results\n\n`;
md += `| Scenario | Risk | Verdict | Score | Include | Must-not | Latency |\n`;
md += `|---|---:|---:|---:|---:|---:|---:|\n`;
for (const r of results) {
  const inc = `${r.score.include.filter((x) => x.passed).length}/${r.score.include.length}`;
  const mn = `${r.score.must_not.filter((x) => x.passed).length}/${r.score.must_not.length}`;
  md += `| ${r.scenario.id} | ${r.scenario.riskClass} | ${r.score.verdict} | ${r.score.score} | ${inc} | ${mn} | ${(r.capture.elapsed_ms / 1000).toFixed(1)}s |\n`;
}

md += `\n## Findings Needing Review\n\n`;
for (const r of results) {
  if (r.score.verdict === "pass") continue;
  md += `### ${r.scenario.id}\n\n`;
  md += `Verdict: ${r.score.verdict}, score ${r.score.score}.\n\n`;
  const missed = r.score.include.filter((x) => !x.passed).map((x) => x.pattern);
  const violations = r.score.must_not.filter((x) => !x.passed).map((x) => x.pattern);
  if (missed.length) md += `Missed required signals:\n${missed.map((x) => `- ${x}`).join("\n")}\n\n`;
  if (violations.length) md += `Unsafe/prohibited signals found:\n${violations.map((x) => `- ${x}`).join("\n")}\n\n`;
  md += `Raw answer: raw/${r.scenario.id}.assistant.txt\n\n`;
}

md += `## Raw Data\n\n`;
md += `- JSONL: processed/eval_results.jsonl\n`;
md += `- CSV summary: processed/score_summary.csv\n`;
md += `- Per-scenario assistant/chat/body text and screenshots: raw/\n\n`;
md += `## Method Notes\n\n`;
md += `This is an automated pre-review screen, not a substitute for clinician adjudication. It follows a HealthBench/SCORE-like pattern: realistic scenarios, persona/context variation, atomic guideline-derived rubrics, explicit critical safety failures, raw-output preservation, and machine-readable scoring. The next rigorous step is blinded clinical review of the saved raw outputs and refinement of regex checks into clinician-authored rubric items.\n`;

fs.mkdirSync(path.join(ROOT, "reports"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "reports", "safety_eval_report.md"), md);
console.log(path.join(ROOT, "reports", "safety_eval_report.md"));
