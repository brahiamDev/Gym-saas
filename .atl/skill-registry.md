# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| Create Gentle AI pull requests with issue-first checks | branch-pr | C:/Users/Brahiam/.config/opencode/skills/branch-pr/SKILL.md |
| PRs over 400 lines, stacked PRs, review slices | chained-pr | C:/Users/Brahiam/.config/opencode/skills/chained-pr/SKILL.md |
| Design docs that reduce cognitive load | cognitive-doc-design | C:/Users/Brahiam/.config/opencode/skills/cognitive-doc-design/SKILL.md |
| Write warm, direct collaboration comments | comment-writer | C:/Users/Brahiam/.config/opencode/skills/comment-writer/SKILL.md |
| Go tests, go test coverage, Bubbletea teatest, golden files | go-testing | C:/Users/Brahiam/.config/opencode/skills/go-testing/SKILL.md |
| Create Gentle AI issues with issue-first checks | issue-creation | C:/Users/Brahiam/.config/opencode/skills/issue-creation/SKILL.md |
| judgment day, dual review, adversarial review, juzgar | judgment-day | C:/Users/Brahiam/.config/opencode/skills/judgment-day/SKILL.md |
| new skills, agent instructions, documenting AI usage patterns | skill-creator | C:/Users/Brahiam/.config/opencode/skills/skill-creator/SKILL.md |
| implementation, commit splitting, chained PRs, or keeping tests and docs with code | work-unit-commits | C:/Users/Brahiam/.config/opencode/skills/work-unit-commits/SKILL.md |

## Compact Rules

### branch-pr
- Every PR MUST link an approved issue — no exceptions
- Every PR MUST have exactly one `type:*` label
- Automated checks must pass before merge is possible
- Branch names: `^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert)/[a-z0-9._-]+$`
- Conventional commits: `^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\([a-z0-9\._-]+\))?!?: .+`

### chained-pr
- Split PRs over 400 changed lines unless maintainer accepts `size:exception`
- Keep each PR reviewable in ≤60 minutes
- Use one deliverable work unit per PR; keep tests/docs with the unit they verify
- State start, end, prior dependencies, follow-up work, and out-of-scope in every chained PR
- Every child PR must include a dependency diagram marking current PR with `📍`

### cognitive-doc-design
- Lead with the answer — put decision, action, or outcome first
- Progressive disclosure — happy path first, then details/edge cases
- Chunking — group related info into small sections
- Signposting — use headings, labels, callouts, summaries
- Recognition over recall — prefer tables, checklists, examples over prose

### comment-writer
- Start with the actionable point, keep it short (1-3 paragraphs)
- Match thread language (Spanish: use voseo: podés, tenés, dale)
- No em dashes — use commas, periods, or parentheses
- Formula: `<observation> \n\n <why if needed> \n\n <next action>`

### go-testing
- Prefer table-driven tests with `t.Run(tt.name, ...)`
- Test behavior and state transitions, not implementation trivia
- Use `t.TempDir()` for filesystem tests
- Golden files: deterministic, update only through `-update` path

### issue-creation
- Blank issues disabled — MUST use bug report or feature request template
- Every issue gets `status:needs-review` automatically
- A maintainer MUST add `status:approved` before PRs can open
- Questions go to Discussions, not issues

### judgment-day
- Launch two blind judges in parallel with identical criteria
- Wait for both judges before synthesis
- Classify warnings as `WARNING (real)` only if normal intended use can trigger
- After any fix agent runs, re-launch both judges before commit/push/done
- Terminal states: `JUDGMENT: APPROVED` or `JUDGMENT: ESCALATED`

### skill-creator
- Required structure: frontmatter, Activation Contract, Hard Rules, Decision Gates, Execution Steps, Output Contract, References
- `description` must be one physical line, quoted, <=250 chars, trigger-first
- Body target 180-450 tokens, max 700, hard max 1000
- References must point to local files

### work-unit-commits
- Commit by work unit — one clear purpose per commit
- Do not commit by file type (avoid models/services/tests split)
- Keep tests with code, docs with user-visible changes
- SDD workload guard: if >400-line change, group into chained PR slices

## Project Conventions

No project convention files found (greenfield project).

## Next Steps
The orchestrator reads this registry once per session and passes pre-resolved skill paths to sub-agents via their launch prompts.
To update after installing/removing skills, run the skill-registry skill again.
