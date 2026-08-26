---
name: stay-close-to-ananke
description: Prefer theme config over forking ananke templates; the theme submodule gets updated
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 11054f5b-7683-4a13-a9a4-71d9b5bfb06a
  modified: 2026-08-26T16:59:51.607Z
---

Solve things with ananke's own config parameters before forking one of its templates. The user updates the theme submodule and does not want the site drifting away from it: "сильно від теми базової відходу не хочеться… вони ж будуть оновлювати її".

**Why:** every forked partial stops receiving upstream fixes and has to be re-merged by hand. This already bit the project once — a pre-2.11 copy of `layouts/home.html` sat in the repo silently shadowing the theme's current one and hardcoding centred body text; the fix was to delete it and set `[params.ananke.home] content_alignment` instead.

**How to apply:** check `themes/ananke/` for an existing parameter or hook first. If a fork really is unavoidable (ananke ships no mobile menu at all, for instance), keep the addition additive, and record what diverges in the Theme overrides section of `CLAUDE.md` so the next theme bump knows what to carry over. Related: [[one-dev-server]].
