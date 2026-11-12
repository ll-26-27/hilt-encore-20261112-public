# Example pages

Implemented routes:

- `/examples/phet-diagrams`: four GENED 1104 HTML simulations, selected inside a titled iframe.
- `/examples/german-reading-room`: the saved reading-room HTML and its three scans.
- `/examples/course-reflection`: the slide calendar expanded into a week/day explorer, with planned and observed layers and reflection notes.

`npm run examples:sync` copies only the approved simulation HTML and reading-room scan assets from `workshop-folder/` into `public/example-assets/`. It runs before dev and build. The source artifacts remain canonical; the deployed reading room’s home-navigation target is adapted and its link to the unbundled consensus explorer is removed. Review events use the page’s existing browser storage and Export log behavior; no logging backend is deployed.

The reflection explorer uses a portable subset of `_context/claude-trainings/layouts/sessions.json`: date, week/day, coverage status, activity titles/descriptions, tool labels, evidence kinds/locators and change summaries. Absolute source paths and raw transcripts are excluded. The snapshot was prepared from main’s slide data on 2026-11-12. Observed blocks have no measured duration; June 11 is explicitly unverified.

Cooking and the current live spectrogram use actual interface captures; the German reading room uses a source scan. Example descriptions follow the existing `content/examples/` contract and ExampleFrame layout.

## Public integration

The public site keeps its Examples / Utilities / Ideas navigation. The workshop lives at the repository root; the private app’s hidden `/workshop` route reads a different `_context` tree and is not part of this port. No private slides, planning routes, CLI branch, or raw podcast recordings are included.

All 24 example descriptions, route components, and their local assets are included. The live spectrogram is a self-contained static export with its rebuild source in `vendor/spectrogram-next/`. Studio circuits adds `three`; the host keeps its existing Next.js version and other dependencies.
