# BCBSIL Homepage Migration Plan

Migrate `https://www.bcbsil.com/` to AEM Edge Delivery Services with **content + design** scope (import content and match the original site's visual styling).

## Overview

| Item | Value |
|------|-------|
| Source URL | `https://www.bcbsil.com/` |
| Target | AEM Edge Delivery Services (this project) |
| Scope | Content + design (visual styling matched to original) |
| Project type | Detected during setup (doc / da / xwalk) |

## Approach

This is a single-page migration of the homepage. The workflow analyzes the page structure, maps content sequences to EDS blocks, builds the import infrastructure (parsers + transformers), imports the content, then applies design/styling and visually validates against the original.

## Checklist

- [ ] **Confirm project properties** — identify project type (doc/da/xwalk) and the Block Library endpoint so the correct block palette is used
- [ ] **Scrape the source page** — capture `bcbsil.com` DOM, screenshots, metadata, and download images
- [ ] **Analyze page structure** — identify section boundaries, content sequences, and authoring decisions (default content vs. blocks)
- [ ] **Survey available blocks** — inventory project + Block Collection blocks to map each content sequence to a block
- [ ] **Map blocks & create variants** — record DOM selectors and create any new block variants needed for the homepage
- [ ] **Generate import infrastructure** — build block parsers and page transformers for the identified variants
- [ ] **Build & run the import script** — bundle the parsers/transformers and run the import to generate content HTML
- [ ] **Preview & verify content** — render the imported page locally and compare structure against the original
- [ ] **Migrate design** — extract design tokens (colors, typography, spacing) and write EDS-ready CSS for each block to match the original
- [ ] **Visual critique & iterate** — compare migrated page to the original, fix styling gaps (up to a few iterations)
- [ ] **Final review** — confirm content fidelity and visual match, report results

## Open Questions

- **Navigation & footer**: Scope was set to "content + design" (not full nav/footer). The homepage includes a header/nav and footer — confirm whether these should be instrumented too, or left for a later pass.

## Notes

- Execution requires **Execute mode** — this plan is read-only until you approve it.
- `bcbsil.com` may present a region/consent interstitial or bot protection; if the scrape is blocked I'll flag it and we may need an alternate capture.
