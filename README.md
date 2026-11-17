# Rosewill Loving Arms Covenant House — site recovery

This repository is a self-contained archival recreation of the public `rosewill.org` site as observed on 2026-11-17. It is intentionally separate from the modern Rosewill project and never changes the production site.

## Recovered pages

- Home, About, Our Founder, Services, Contact, Resources, Events
- Privacy Policy and Legal Notice

All recovered public photographs, logo variants, favicon files, backgrounds, service imagery, and resource screenshots are stored locally in `assets/` (52 files). The original fetched HTML is retained in `source-snapshots/` for provenance. `ASSET_SOURCES.md` records the asset-origin URL pattern and source site.

## Run locally

This is dependency-free static HTML. From the repository root, run a static server, for example `npx serve .`, then open the displayed URL.

## GitHub Pages

The included workflow deploys the repository root to GitHub Pages on every push to `main`. In the repository’s **Settings → Pages**, set the source to **GitHub Actions** once if it is not already selected. The production URL is expected to be `https://source0999.github.io/oldRosewill/`; all paths are relative so it works under that subdirectory.

## Deliberate limitations

The original hosted contact form depended on the former site builder and is displayed as an explicitly non-submitting notice; it does not collect or transmit messages. The externally hosted Cash App QR destination was observed as `https://cash.app/qr/$Rosewill2009`, but should be verified by the organization before a public donation campaign. Events has no public event content on the source website. No CAPTCHA, private administration, analytics, or authentication has been copied.
