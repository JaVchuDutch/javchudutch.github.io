# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Hugo static site for **javchudutch.com** — a Dutch-language-learning site for Ukrainian speakers.
Deployed to GitHub Pages by `.github/workflows/hugo.yml` on every push to `main` (custom domain via `CNAME`).

## Commands

```sh
make serve        # hugo server --bind ::1  (local preview at http://[::1]:1313)
make develop      # brew install hugo
make update-deps  # pull latest ananke theme into the submodule
hugo --minify     # production build into ./public
```

The theme is a **git submodule** (`themes/ananke`). Fresh clones need `git submodule update --init --recursive`
or the build fails. Never edit files under `themes/ananke/` — override them instead (see below).

CI pins Hugo **extended** 0.165.0 + dart-sass, matching what the site is developed against. Hugo refuses raw HTML
content files by default, which would kill the whole `speech` section, so `hugo.toml` sets `[security] allowContent = ['.']`.
The build is warning-free — if a Hugo or theme bump reintroduces deprecation warnings, fix them rather than let them
accumulate. `public/` and `resources/` are gitignored.

Project templates use Hugo's current layout structure (`layouts/_partials/`, `layouts/_shortcodes/`, `layouts/baseof.html`),
matching ananke v2.19. The pre-0.146 spellings (`partials/`, `shortcodes/`, `index.html`) still resolve, but don't
reintroduce them.

## Multilingual structure

Two languages configured in `hugo.toml`: `uk` (default, served at the site root) and `nl` (served under `/nl/`).

- Translations are linked by **filename suffix**: `about.uk.md` ↔ `about.nl.md`, `resources/index.uk.md` ↔ `resources/index.nl.md`.
  Adding a page normally means adding both files.
- Navigation menus are declared **per language** in `hugo.toml` under `[[languages.uk.menus.main]]` / `[[languages.nl.menus.main]]` —
  there is no shared menu definition, so a new top-level page must be added twice.
- `i18n/uk.toml` and `i18n/nl.toml` only override the handful of strings this site adds (translation switcher, consent banner);
  everything else falls through to the theme's own i18n files.
- Content files **without** a language suffix (the whole `content/speech/*.html` tree) belong to the default language only,
  so they render under `/speech/` and not `/nl/speech/`.

## The `speech` section

`content/speech/` holds pronunciation-practice pages: standalone HTML documents with their own `<head>`, CSS, scripts,
and **base64-inlined MP3 audio** — individual files run to several megabytes. They carry no front matter; Hugo derives
titles from the filenames.

`layouts/speech/single.html` renders these by stashing `.Content` in a `<template>` and injecting it into a
`<custom-content>` web component's **shadow DOM**, so the embedded document's CSS cannot collide with the theme's.
Inline `<script>` blocks inside the content are not executed by shadow-DOM insertion, so the layout re-evaluates each one
manually with the shadow root passed in as `document`, then dispatches a synthetic `DOMContentLoaded`. Any generator that
produces these HTML files must therefore keep its scripts self-contained and scope DOM lookups to the injected `document` argument.

`layouts/speech/list.html` + `link.html` render the section as a folder browser (📁 subsections, 📄 pages). Because the
exercise files have no language suffix, the section has children only in the default language; the template falls back
to `.CurrentSection.AllTranslations` to find the translation that owns them, so every language lists the same tree.

## The `reviews` section

Testimonials live entirely in front matter: `content/reviews/_index.uk.md` / `_index.nl.md` carry a `[[reviews]]`
array (`name`, `context`, `text`), and `layouts/reviews/list.html` ranges over `.Params.reviews` to render cards,
running `text` through `markdownify`. One file per language, no page-per-quote.

The section ships `draft = true` and its menu entries in `hugo.toml` are commented out, so it is invisible until
real testimonials exist. Publishing means: add entries, drop `draft = true`, uncomment both menu blocks.
Never invent testimonial text.

## Theme overrides

Local `layouts/` and `assets/` mirror the theme's paths and win over `themes/ananke/`:

- `layouts/_partials/head-additions.html` is ananke's designated hook; here it carries the stylesheet,
  the pre-paint theme script and the delegated click handlers for the theme and menu toggles.
- `assets/ananke/socials/buymeacoffee.svg` supplies an icon ananke does not ship, paired with a
  `[params.ananke.social.networks.buymeacoffee]` entry in `hugo.toml`.

**`layouts/_partials/site-navigation.html` is a fork and has to be re-merged by hand on every theme bump.**
Upstream changes to it will not reach the site by themselves. What we add on top of ananke's version:

1. the logo goes through `resources.Get` + `Process "resize 264x"` and carries `.site-logo`, instead of the
   theme's raw `<img class="w100 mw5-ns">`;
2. an ancestor trail (`where .Ancestors "Section" .Section`), with `.IsHome` skipped;
3. menu entries whose `pageRef` is an empty section are hidden unless that section sets `show_when_empty`;
4. the theme toggle button;
5. the `.nav-bar` wrapper and `.nav-toggle` hamburger, plus `.nav-panel` on the block the theme leaves
   unclassed — ananke ships no mobile menu of any kind, so below 60em its header simply stacks.

Same applies to `layouts/_partials/site-footer.html`: it inlines the consent-settings button and the
`menus.footer` links on the copyright line, and drops the theme's `dn dib-ns`, which hid that whole block —
and with it the only route to withdrawing cookie consent — below 30em.

Do **not** re-add `layouts/home.html`. A stale pre-2.11 copy of it lived here and silently shadowed the
theme's current one, hardcoding centred body text; `[params.ananke.home] content_alignment` covers what it
was there for.

Ananke keys `social.networks` **by slug** (a map), not as an array of tables, and ships definitions for most networks
itself — so only genuine deviations belong in `hugo.toml`: the `buymeacoffee` network, and an `email` override because
the theme ships `profile = false`. `social.share.networks` must list only networks with a real share endpoint;
Instagram and Buy me a coffee have none and render broken `%!s(<nil>)` URLs if listed.

## Cookie consent + analytics

`layouts/_partials/consent.html` is a hand-rolled consent gate. Scripts listed in `params.consent.items` with
`is_functional = false` are **not** loaded until the visitor accepts; choices are stored in a `consent-settings`
cookie whose value is a bit-per-item string, in item order. Each item's `script_file` resolves to `/js/<file>`
(`static/js/ga.js` for GA4, which additionally honours Do Not Track).

Consent items are declared per language (`[[languages.uk.params.consent.items]]`, `[[languages.nl.params.consent.items]]`)
with a top-level `[[params.consent.items]]` fallback — keep all three in sync or the bit-string ordering diverges between languages.

## Markdown notes

`markup.goldmark.renderer.unsafe = true`, so content freely mixes raw HTML into Markdown (the resources pages use raw
`<a target="_blank">` links). New content should follow `archetypes/default.md`; dates fall back to `:filename` then `:default`.
