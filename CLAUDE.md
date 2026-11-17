# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Planning documents for two laneway window grilles (left- and right-hand, mirror images). Not software: the only code is the figure generator. Two alternative builds of the same grille, sharing one geometry so either drops into the same reveal:

| File | What it is |
|------|-----------|
| `laneway-grilles_rfq.docx` / `.pdf` | Request for quotation, 5 pages: a summary table, then six numbered drawings (bar sizes, in the window, dimensions, from above, 3D corner, side views). Welded mild steel, matte black powder coat or primed, outside size +0/−2. Built by `rfq/make_rfq.cjs`. The 19 Oct 4-page text spec, with the stainless option and finish questions, is in git history |
| `diagrams/make_rfq_diagrams.mjs` | Generates the RFQ's `diagrams/rfq-*.svg` figures. The 50 × 5 free stile is orange in every one |
| `laneway-grilles_diy-build_plan.md` | Self-build alternative (thin white-painted timber frame, 12 mm black rod, roll-pinned crossings), written when no fabricator seemed to reply (the emails had in fact never left the Outbox). Its section 8 holds the open questions, including corrections still owed to the RFQ |
| `diagrams/make_diagrams.mjs` | Generates the five SVG figures embedded in the DIY plan |
| `README.md` | Landing page for a fabricator: what is quoted, links to both spec files, contact line |

## The repo is public

`origin` is `github.com/dewoller/laneway-window-grilles`, and fabricators are pointed at it. Every push publishes, so confirm before pushing (see `~/.claude/rules/git.md`, "It is public").

## RFQ is generated

```bash
node diagrams/make_rfq_diagrams.mjs                 # rewrites diagrams/rfq-*.svg
(cd rfq && npmi ci && node make_rfq.cjs)            # rewrites laneway-grilles_rfq.docx
soffice --headless --convert-to pdf laneway-grilles_rfq.docx   # then the PDF
```

- Never hand-edit the `.docx` or `.pdf`; change the table text in `rfq/make_rfq.cjs` or a figure's geometry in `make_rfq_diagrams.mjs`, and rebuild both.
- `diagrams/rfq-3_elevation.png` (the dimensioned elevation) has no source; it was lifted from the 19 Oct docx with the "1 px = 2 mm" note cut out. Change it only as a raster edit.
- The figures are numbered in page order, and the table refers to them by number. Renumber both together.
- One reader on 18 Nov could not tell which bar was the 50: keep the orange-means-50 convention in any new figure.

## Figures are generated

```bash
node diagrams/make_diagrams.mjs   # rewrites all five diagrams/*.svg
```

- Never hand-edit the SVGs. Change the millimetre constants near the top of `make_diagrams.mjs` (the "Geometry shared by the figures" block) and re-run.
- The constants must match the plan's numbers. When a dimension changes in `laneway-grilles_diy-build_plan.md`, change it in the script too, and the reverse.
- The figures draw the left-hand grille only (465 × 1171 outside); the right-hand one is its mirror at 1178 high.
- No dependencies: plain Node, `node:fs` / `node:path` / `node:url` only.
- The `diagrams/*.png` files are untracked raster copies, not produced by the script. The plan embeds the SVGs.

## Conventions in the documents

- All dimensions in mm. X from the wall-side outer face toward the mullion, Y from the bottom outer face, Z from the window-side face into the room. Positions are measured from the frame's outer faces, as in the RFQ.
- The DIY plan's section 2 records each decision with the rejected alternatives and why. Add to it rather than silently changing a choice.
