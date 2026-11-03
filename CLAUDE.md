# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Planning documents for two laneway window grilles (left- and right-hand, mirror images). Not software: the only code is the figure generator. Two alternative builds of the same grille, sharing one geometry so either drops into the same reveal:

| File | What it is |
|------|-----------|
| `laneway-grilles_rfq.docx` / `.pdf` | Request for quotation sent to fabricators: welded grille, Option A 304/316 stainless or Option B powder-coated mild steel |
| `laneway-grilles_diy-build_plan.md` | Self-build alternative (thin white-painted timber frame, 12 mm black rod, roll-pinned crossings), written after no fabricator replied. Its section 8 holds the open questions, including corrections still owed to the RFQ |
| `diagrams/make_diagrams.mjs` | Generates the five SVG figures embedded in the DIY plan |
| `README.md` | Landing page for a fabricator: what is quoted, links to both spec files, contact line |

## The repo is public

`origin` is `github.com/dewoller/laneway-window-grilles`, and fabricators are pointed at it. Every push publishes, so confirm before pushing (see `~/.claude/rules/git.md`, "It is public").

## RFQ: two binaries, no source

No generator script or source markdown exists for the RFQ. Edit the `.docx`, then re-export the `.pdf`; the two must stay in sync. Use the `anthropic-skills:docx` and `anthropic-skills:pdf` skills to read or change them.

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
