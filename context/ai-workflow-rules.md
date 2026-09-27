# AI Workflow Rules — topagents.lol

## 1. Operating Rules for AI Coding Assistants
1. **Context First**: Always consult [`AGENTS.md`](file:///d:/topagents/AGENTS.md) and [`context/`](file:///d:/topagents/context) before generating code or modifying architectural boundaries.
2. **Self-Improving Verification**: Never mark a unit complete without verifying that the code compiles cleanly (`npm run build`) and runs without runtime errors.
3. **No Placeholders**: Never leave `// TODO: implement later` or placeholder data when creating the 100 agent entries. All data must be populated with verified, real-world agent specifications.
4. **Token & Performance Discipline**: Minimize unnecessary re-renders. Keep client bundles lightweight.

---

## 2. Quality Gates Checklist
Before declaring any phase complete, verify:
- [ ] TypeScript compiles cleanly with zero errors (`npm run build`).
- [ ] All 100 agents are present in the dataset and accessible via `/agents/[slug]`.
- [ ] Every agent page renders >= 2,000 words of authentic technical analysis.
- [ ] Zero presence of banned AI clichés (*"delve into"*, *"testament to"*, etc.).
- [ ] Sitemaps (`/sitemap.xml`) and Schema.org JSON-LD are valid and complete.
- [ ] Product Hunt styled upvote buttons increment optimistically and persist in local storage.
- [ ] Free submission form validates and handles submissions cleanly.
