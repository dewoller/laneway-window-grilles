# Laneway window grilles: DIY build plan

29 Oct 2026. Hardwood frame, 12 mm steel rods, pinned crossings. Fallback to
the fabricated version in `laneway-grilles_rfq.pdf`, which eight shops did not
answer. All dimensions in mm, all positions measured from the frame's outer
faces exactly as in the RFQ, so either version drops into the same reveal.

The RFQ says "plaster reveal". The reveal is solid timber. Correct the docx and
PDF before sending the RFQ out again.

## 1. What is being built

Two grilles, a left-hand and a right-hand, mirror images, for the two hinged end
bays of the steel casement. Each sits in the room-side timber reveal, its
window-side face 27 mm in front of the sash, fixed to the reveal on three sides
(wall-side stile, top rail, bottom rail). The fourth stile stands free beside the
mullion and carries the 24 V chain opener.

It is a deterrent, not a rated security screen. The deterrent is the 12 mm rod
grid; the frame's only job is to hold the rod ends captive and carry the opener.

| Item | Left | Right |
|------|------|-------|
| Frame outside W × H | 465 × 1171 | 465 × 1178 |
| Tolerance on outside | +0 / −2 | +0 / −2 |
| Square | diagonals within 2 | diagonals within 2 |

## 2. Decisions, and what was rejected

| Decision | Chosen | Rejected, and why |
|----------|--------|-------------------|
| Bars | 12 mm round mild steel | Timber bars: a 25 mm hardwood dowel kicks or saws out in seconds. Thinner steel: strength goes with diameter cubed, see table below. |
| Crossings | Drilled through both rods and roll-pinned, in the dry-fitted frame | Tack welds: need a welder or a shop, heat near timber, grinding. Half-lapped steel: 24 notches of grinding and filing. Tie wire or epoxy alone: unfixed crossings let a 1170 span of 12 mm rod bend by hand. |
| Frame | 42 × 42 DAR hardwood, end-lap corners | Steel frame: that is the RFQ, still fine if a shop bites. |
| Spot welder | Not used | Fuses 3 to 5 mm crossings, not 12 mm. |
| Dense mesh (5 mm at 50 pitch) | Not used | Stronger and cheaper deterrent, but looks like a coop on the room side and the opener chain needs a cut-out. |
| Fixing | Screws into the timber reveal, plugged, plus a room-side stop bead | Security screws alone: the heads face the opening. |

Why 12 mm. Push at the centre of a 295 mm segment to permanently bend it,
crossings fixed:

| Rod | Push |
|-----|------|
| 12 mm | 58 kg |
| 10 mm | 34 kg |
| 8 mm | 17 kg |
| 6 mm | 7 kg |

Without fixed crossings a 1170 vertical bends at about 15 kg. The crossings are
not optional.

## 3. Geometry

Z is measured from the window-side face of the frame, into the room. X from the
wall-side outer face toward the mullion. Y from the bottom outer face.

### Frame members, per grille

| Member | Section | Length | Notes |
|--------|---------|--------|-------|
| Wall-side stile | 42 × 42 | 1171 (left) / 1178 (right) | Full height, end-lapped both ends |
| Free stile | 42 × 42 | 1171 / 1178 | Full height, end-lapped both ends, carries opener inserts |
| Top rail | 42 × 42 | 465 | End-lapped both ends |
| Bottom rail | 42 × 42 | 465 | End-lapped both ends |

End laps 42 wide × 42 long × 21 deep. Lap faces are open on two sides, so the
rails go on first and the stiles slide in sideways afterwards, which is what lets
the frame close around a pinned grid.

### Rod layers

| Layer | Rods | Centre Z | Timber wall left in front / behind |
|-------|------|----------|-----------------------------------|
| Front (toward glass) | Horizontals | 14 | 8 / 22 |
| Rear | Verticals | 26 | 20 / 10 |

Centres 12 apart, so the rods touch at every crossing. Both layers sit inside the
42 depth. The RFQ had 6.5 and 18.5 because its rods were welded to the face of a
5 mm bar; here they pass through holes and need timber either side.

### Rod holes, 12.5 mm

| Member | Rods | Positions | Hole |
|--------|------|-----------|------|
| Top rail | Verticals | X = 155, 310 | Through, at Z = 26 |
| Bottom rail | Verticals | X = 155, 310 | Through, at Z = 26 |
| Wall-side stile | Horizontals | Y = 290, 585, 880 | Through, at Z = 14 |
| Free stile | Horizontals | Y = 290, 585, 880 | Blind, 25 deep, at Z = 14 |

Through-holes in the rails and the wall-side stile are blocked by the reveal once
installed. The blind holes stop a horizontal walking out of the free stile. Once
pinned, the grid is one piece and none of this is load-bearing; it is belt and
braces.

### Rods, per grille

| Rod | Qty | Cut length | Runs |
|-----|-----|------------|------|
| Vertical | 2 | 1170 (left) / 1177 (right) | Flush with both rail outer faces |
| Horizontal | 3 | 445 | Flush with the wall-side outer face, 2 mm short of the blind-hole bottom |

About 3.7 m per grille, 7.4 m total. Three 3 m lengths, or one 6 m length plus
offcut from a steel merchant, which is cheaper.

### Crossings, per grille

Six, at X = 155 and 310 by Y = 290, 585 and 880. Each gets one 4 mm hole
through both rods, drilled perpendicular to the grid plane, and one 4 × 24 roll
pin. The hole takes about a third of the rod section at the node. On a six-node
deterrent grid that does not matter.

Alternative at any crossing: M4 button-head bolt and nyloc, head toward the
glass, nut on the room side. Use this if the pin holes end up oversize.

### Fixing holes

Same positions as the RFQ. Each is a 5 mm clearance hole through the 42 width,
counterbored 12 mm × 10 deep on the opening-side face for the screw head and a
timber plug.

| Member | Positions |
|--------|-----------|
| Wall-side stile | Y = 145, 437, 732, 1026 |
| Top rail | X = 77, 232, 388 |
| Bottom rail | X = 77, 232, 388 |
| Free stile | none |

All clear of the rod holes.

### Opener inserts

Free stile, inner face (facing the opening), four M5 threaded inserts at
Y = 624, 659, 1080, 1150, Z = 30. Same on both grilles. The 585 horizontal's
blind hole is at Z = 14 and 39 mm below the nearest insert, so there is no clash.

Check the opener's chain run before committing: the RFQ geometry assumed a 50 × 5
steel stile with the rod plane 6.5 mm behind the window face. Here the stile is
42 deep and the front rod plane is 8 mm behind the window face.

## 4. Shopping list

Prices are rough, Melbourne, late 2026.

| Item | Qty | Note | Approx |
|------|-----|------|--------|
| 42 × 42 DAR hardwood (Tas oak / Vic ash, or merbau) | 2 × 2.4 m + 1 × 1.2 m | Two stiles per 2.4 m length, four rails from the 1.2 | $60 to $90 |
| 12 mm round mild steel | 7.4 m | 3 × 3 m hardware lengths, or 6 m + 1.5 m from a merchant | $40 to $70 |
| Roll pins 4 × 24 | 12, buy 20 | Spring steel | $10 |
| M5 threaded inserts, screw-in brass | 8, buy 10 | 8 mm pilot, check the insert's spec | $15 |
| 10 g × 100 bugle batten screws | 20 | Through 42 of frame, 58 into the reveal | $10 |
| 12 mm timber plugs or a plug cutter | 20 | Glued over the screw heads | $10 |
| 8 g × 40 screws for the laps | 16 | Two per corner | $5 |
| Stop bead, 19 × 19 hardwood | 2 × (1171 + 2 × 465) ≈ 4.3 m | Room side, three sides per grille | $20 |
| Polyurethane or epoxy glue | 1 | Laps | $15 |
| Cold gal or etch primer, matte black enamel | 1 each | Rods | $30 |
| Oil or lacquer for the timber | 1 | | $20 |
| Rebar tie wire, cutting oil | | | $10 |

Total roughly $250 to $300.

## 5. Tools

| Tool | For | Have / buy |
|------|-----|------------|
| Benchtop drill press, 13 mm chuck, 50 mm stroke | The 20 rod holes, fixing holes, insert pilots | Buy, $130 to $200. Pays for itself here and stays. |
| Hardened V-groove drill guide (Big Gator V-DrillGuide or similar) | The 12 pin holes through rod, drilled in place | Buy, $60 to $80. The grid will not reach a benchtop press spindle. |
| 12.5 mm brad-point or auger bit | Rod holes | Buy |
| 4 mm HSS bits | Pin holes | Buy a few |
| 5 mm bit, 12 mm counterbore or Forstner | Fixing holes | |
| Hacksaw or angle grinder with cutting disc | Rods | |
| Tenon saw, 25 mm chisel, mallet | End laps in timber | |
| Combination square, tape, marking knife | | |
| Four sash or F clamps, one pair locking pliers | Dry fit, crossings | |
| Centre punch, pin punch, hammer | Pin holes and roll pins | |
| Spot welder | Nothing on this job | |

If the press is not happening, a portable drill guide (Milescraft DrillMate or
Wolfcraft) does the timber holes well enough, and the frame and rod positions have
±2 mm to play with.

## 6. Build sequence

Do one grille start to finish before cutting the second. The second is the
mirror image: swap which end is the wall side.

### Timber

1. Cut stiles and rails to length. Check each pair against the other for equal
   length, not against the tape.
2. Mark and cut the end laps, 21 deep. Test-fit each corner. Diagonals within 2.
3. Mark every hole from the outer faces, not from the lap shoulders.
4. On the press, drill the rod holes. Through-holes at full depth. Blind holes in
   the free stile with the depth stop at 25. Keep Z exact: 14 for stiles, 26 for
   rails, measured from the face that will be the window side. Mark that face
   on every member before drilling anything.
5. Drill the fixing holes, 5 mm through and the 12 mm counterbore. Drill the
   insert pilots in the free stile.

### Rods

6. Cut the rods. Deburr every end with a file so they enter the holes without
   tearing the timber.

### Dry fit

7. Lay the frame flat, window-side face down. Push the verticals through the
   bottom rail, then the top rail. Push the horizontals into the wall-side stile
   from outside, then slide the free stile on over their other ends, closing the
   laps as it goes.
8. Clamp the corners and square the frame. Diagonals within 2.
9. Twist tie wire tight around each crossing so the two rods touch with no gap.
   A gap is where the drill wanders.

### Pin the crossings

10. Centre punch the top rod at each crossing. Sit the V-guide on it, 4 mm bit,
    about 2000 rpm, cutting oil, peck through both rods. Six holes.
11. Drive a 4 × 24 roll pin into each. Snip the tie wire. The grid is now one
    piece.

### Finish

12. Knock the frame apart. Degrease the grid, prime, matte black. Or clear
    lacquer if you like the steel look against the timber.
13. Oil or lacquer the timber, masking the lap faces.

### Glue up

14. Reassemble around the finished grid, same order as the dry fit. Glue the
    laps, clamp square, two 8 g × 40 screws per corner from the room-side face.
15. Fit the M5 inserts.

### Install

16. Offer the grille into the reveal, window-side face 27 mm in front of the
    sash. Shim to plumb and square.
17. Screw through the ten fixing holes into the reveal with the 10 g × 100s.
    Glue a timber plug over each head. A plugged head cannot be unscrewed from
    the opening side.
18. Screw the 19 × 19 stop bead to the reveal on the room side of the grille,
    on the three fixed sides. A push from the glass side now loads the bead and
    puts the screws in shear, not withdrawal.
19. Fit the opener to the inserts, sash bracket, wiring. Outside this plan.

## 7. Done when

- Both grilles in, diagonals within 2, no rattle at any crossing.
- A hard shove on the middle of any rod from the window side moves nothing you
  can see.
- Every fixing head plugged, stop bead on three sides, opener opens and closes
  the sash through the grid.

## 8. Open questions

- [ ] Ring three of the eight fabricators with the short pitch before buying
      timber. "Two small welded grilles, flat bar and 12 mm rod, mild steel, you
      pick the finish, I have a drawing." If one bites, this plan is the backup.
- [ ] How much room-side depth does the reveal have before the architrave? The
      frame is 42 deep plus a 19 bead, where the RFQ needed 25 to 50.
- [ ] Opener chain run with a 42 deep stile and the rod plane 8 mm back.
- [ ] Timber species. Tas oak is at Bunnings and takes a 12.5 hole with 8 mm of
      wall. Merbau is harder and heavier.
- [ ] Rod finish: black or clear.
- [ ] Fix "plaster reveal" in the RFQ docx and PDF.
