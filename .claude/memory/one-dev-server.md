---
name: one-dev-server
description: "Keep exactly one local preview server running; don't leave a second static server behind"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 11054f5b-7683-4a13-a9a4-71d9b5bfb06a
  modified: 2026-08-26T16:59:42.106Z
---

Run one local preview server at a time — the project's own `make serve` (`hugo server --bind ::1`, port 1313). Don't leave a second server (e.g. `python3 -m http.server` over a build directory) running alongside it.

**Why:** I had spun up a static server on 8899 to take screenshots while `hugo server` was already on 1313. The user was testing against 1313, hit a stale result, and had to work out which of two servers I meant. His words: "ти знов запустив 2 сервера… тримй один".

**How to apply:** Point screenshots at the existing 1313 server instead of building to a temp dir and serving it separately. If a second one is genuinely unavoidable, kill it as soon as the screenshots are taken and say which port is which. Also remember `hugo server` misses `sed -i ''`-style whole-file replacements — restart it rather than assuming the watcher caught the change. See [[stay-close-to-ananke]].
