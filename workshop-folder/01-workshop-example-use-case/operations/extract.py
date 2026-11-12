#!/usr/bin/env python3
"""
Comfort-spectrum extraction — the deterministic half of operations/01-photos-to-csv.md.

Optional. The prompt stands on its own; this is the fast path when you would rather
not hand-implement the pixel work. Every tunable the prompt quotes in prose lives in
the CONSTANTS block below, so the two can be checked against each other.

Three steps, with a human in the middle:

    python extract.py prep   inputs/ work/          # HEIC -> JPEG, tape made horizontal
    python extract.py detect work/                  # find tape + cards, write contact sheets
    <you read work/sheets/*.png and write work/labels.json>
    python extract.py score  work/ outputs/ai_comfort_spectrum.csv

`detect` cannot name a card and `score` cannot judge a pile; those two steps are
yours. Everything either side of them is arithmetic.

Needs: pillow-heif, Pillow, numpy, scipy, scikit-image.
"""

import argparse, csv, json, os, sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage
from skimage.feature import peak_local_max
from skimage.segmentation import watershed

# ----------------------------------------------------------------- CONSTANTS
WORK_LONG_EDGE = 2000      # px; every threshold below assumes this working size

# HSV gates, hue in degrees, S and V on 0-1
TAPE_HSV     = ((75, 165), 0.40, 0.35)
TEACHER_HSV  = ((280, 345), 0.30, 0.28)   # the pink card is really a magenta
STUDENT_HSV  = ((10, 45), 0.45, 0.45)

TAPE_MIN_COMPONENT = 1500  # px; smaller green blobs are noise
TAPE_MIN_ELONGATION = 3.0  # PCA ratio; rejects bags, helmets, marker caps
TAPE_BAND = 45             # px either side of the fitted axis

CARD_MIN_COMPONENT = 200   # px
CARD_OPEN_DISK = 5         # px
CARD_CLOSE_FRAC = 0.08     # x R; closes the notch a paperclip cuts in a card
                           # (bigger and it welds touching cards together)
PEAK_DISTANCE_FRAC = 0.75  # x R; cards overlap, so centres sit well under 2r apart
PEAK_THRESHOLD_FRAC = 0.35 # x R
LOOSE_DISTANCE_FRAC = 0.55 # x R, for the rescue pass on a photo with merged cards
LOOSE_THRESHOLD_FRAC = 0.20
RADIUS_BAND = (0.50, 1.60)    # x R
ROUNDNESS_BAND = (0.85, 1.90) # area / (pi r^2), with r an inradius

CLUSTER_GAP = 0.30         # scale units; chain to the previous card
CLUSTER_SPAN = 0.60        # scale units; cap on a whole cluster
CONF_HIGH, CONF_MED = 0.22, 0.38   # |cluster mean - nearest integer|
OFFLINE_MED, OFFLINE_LOW = 4.5, 7.0   # card-radii off the tape, confidence caps
OFFLINE_DROP = 8.0         # card-radii; beyond this a lone card is not placed
PILE_PROXIMITY = 2.2       # x r between centres

TEACHER_TASKS = ["Assign the grade", "Give feedback on drafts", "Draft a rec letter",
                 "Write exam questions", "Write the problem set + solutions",
                 "Design the rubric", "Detect AI use", "Clean the class dataset",
                 "Generate synthetic data"]
STUDENT_TASKS = ["Draft the essay", "Outline the essay", "Summarize the reading",
                 "Run + interpret the analysis", "Explain a concept",
                 "Code the interview transcripts", "Make practice problems",
                 "Debug the code", "Find + check sources"]
KIND = {t: "teacher" for t in TEACHER_TASKS} | {t: "student" for t in STUDENT_TASKS}
# the semantic direction check: these belong at the low end, those at the high end
LOW_END  = {"Draft the essay", "Assign the grade", "Give feedback on drafts"}
HIGH_END = {"Debug the code", "Generate synthetic data", "Make practice problems"}


# ------------------------------------------------------------------- helpers
def hsv(rgb):
    a = rgb.astype(np.float32) / 255.0
    mx, mn = a.max(2), a.min(2)
    d = mx - mn
    h = np.zeros_like(mx)
    r, g, b = a[:, :, 0], a[:, :, 1], a[:, :, 2]
    m = d > 1e-6
    i = m & (mx == r); h[i] = ((g - b)[i] / d[i]) % 6
    i = m & (mx == g); h[i] = ((b - r)[i] / d[i]) + 2
    i = m & (mx == b); h[i] = ((r - g)[i] / d[i]) + 4
    return h * 60, np.where(mx > 1e-6, d / np.maximum(mx, 1e-6), 0), mx


def mask_for(rgb, gate):
    (h0, h1), smin, vmin = gate
    H, S, V = hsv(rgb)
    return (H > h0) & (H < h1) & (S > smin) & (V > vmin)


def round_half_up(x):
    """Python's round() is banker's rounding and sends 4.5 to 4. This does not."""
    return int(np.floor(x + 0.5))


def tape_axis(green):
    """Return (origin, along, across) for the tape, or raise if there is no tape."""
    lab, n = ndimage.label(ndimage.binary_opening(green, np.ones((7, 7))))
    best = None
    for i in range(1, n + 1):
        ys, xs = np.where(lab == i)
        if len(xs) < TAPE_MIN_COMPONENT:
            continue
        P = np.stack([xs, ys], 1).astype(float)
        sv = np.linalg.svd(P - P.mean(0), compute_uv=False)
        elong = sv[0] / max(sv[1], 1e-6)
        if elong < TAPE_MIN_ELONGATION:
            continue                      # blobby green is not tape
        score = len(xs) * elong
        if best is None or score > best[0]:
            best = (score, P)
    if best is None:
        raise SystemExit("no tape found — check the green HSV gate against this photo")

    seed = best[1]
    m0 = seed.mean(0)
    vt = np.linalg.svd(seed - m0, full_matrices=False)[2]
    ys, xs = np.where(green)                     # extend along the whole tape run
    allp = np.stack([xs, ys], 1).astype(float)
    pts = allp[np.abs((allp - m0) @ vt[1]) < TAPE_BAND]
    for _ in range(3):
        c = pts.mean(0)
        vt = np.linalg.svd(pts - c, full_matrices=False)[2]
        along, across = (vt[0], vt[1]) if vt[0][0] >= 0 else (-vt[0], -vt[1])
        p = (pts - c) @ across
        pts = pts[np.abs(p - np.median(p)) < TAPE_BAND + 15]
    t = (pts - c) @ along
    return c, along, across, float(t.min()), float(t.max())


def segment_cards(mask, R=None, loose=False):
    """Split a colour mask into card-sized discs. r is an inradius, not sqrt(area/pi)."""
    if R:
        mask = ndimage.binary_closing(mask, disk(max(3, int(CARD_CLOSE_FRAC * R))))
    mask = ndimage.binary_opening(mask, disk(CARD_OPEN_DISK))
    mask = ndimage.binary_fill_holes(mask)
    dist = ndimage.distance_transform_edt(mask)
    if R is None:                                  # bootstrap pass
        lab, n = ndimage.label(mask)
        rr = [dist[lab == i].max() for i in range(1, n + 1)
              if (lab == i).sum() > 500]
        return float(np.median(rr)) if rr else None, []
    dfrac = LOOSE_DISTANCE_FRAC if loose else PEAK_DISTANCE_FRAC
    tfrac = LOOSE_THRESHOLD_FRAC if loose else PEAK_THRESHOLD_FRAC
    coords = peak_local_max(dist, min_distance=max(5, int(dfrac * R)),
                            threshold_abs=tfrac * R,
                            labels=mask, exclude_border=False)
    markers = np.zeros(mask.shape, int)
    for i, (y, x) in enumerate(coords, 1):
        markers[y, x] = i
    lab = watershed(-dist, ndimage.grey_dilation(markers, size=(5, 5)), mask=mask)
    out = []
    for i in range(1, lab.max() + 1):
        sel = lab == i
        area = int(sel.sum())
        if area < CARD_MIN_COMPONENT:
            continue
        r = float(dist[sel].max())
        ys, xs = np.where(sel)
        out.append(dict(cx=float(xs.mean()), cy=float(ys.mean()), r=r, area=area))
    return R, out


def disk(rad):
    rad = int(rad)
    y, x = np.ogrid[-rad:rad + 1, -rad:rad + 1]
    return x * x + y * y <= rad * rad


# ---------------------------------------------------------------------- prep
def cmd_prep(args):
    import pillow_heif
    pillow_heif.register_heif_opener()
    dst = Path(args.work) / "jpg"
    dst.mkdir(parents=True, exist_ok=True)
    for f in sorted(Path(args.inputs).iterdir()):
        if f.suffix.lower() not in {".heic", ".jpg", ".jpeg", ".png"}:
            continue
        im = Image.open(f).convert("RGB")
        w, h = im.size
        s = WORK_LONG_EDGE / max(w, h)
        if s < 1:
            im = im.resize((int(w * s), int(h * s)))
        a = np.array(im)
        _, along, _, _, _ = tape_axis(mask_for(a, TAPE_HSV))
        if abs(along[1]) > abs(along[0]):          # tape runs vertically: quarter-turn
            im = im.rotate(90, expand=True)
        out = dst / (f.stem + ".jpg")
        im.save(out, quality=88)
        print(f"  {f.name} -> {out.name} {im.size}")
    print("\nThe 180-degree ambiguity is left for `score`, which resolves it from the "
          "task names.")


# -------------------------------------------------------------------- detect
def cmd_detect(args):
    loose = set(args.loose or [])
    work = Path(args.work)
    sheets = work / "sheets"; sheets.mkdir(parents=True, exist_ok=True)
    result = {}
    for f in sorted((work / "jpg").glob("*.jpg")):
        a = np.array(Image.open(f).convert("RGB"))
        c, along, across, tmin, tmax = tape_axis(mask_for(a, TAPE_HSV))

        relax = f.stem in loose
        masks = {"teacher": mask_for(a, TEACHER_HSV), "student": mask_for(a, STUDENT_HSV)}
        # Bootstrap R over BOTH colours pooled. Per-colour medians are unstable: a photo
        # with one orange card takes its R from that single card's fragments.
        R = segment_cards(masks["teacher"] | masks["student"])[0]
        if not R:
            print(f"  {f.stem}: no cards found"); continue
        cards = []
        for kind, m in masks.items():
            _, regions = segment_cards(m, R, loose=relax)
            for g in regions:
                if not (RADIUS_BAND[0] * R <= g["r"] <= RADIUS_BAND[1] * R):
                    continue
                if not (ROUNDNESS_BAND[0] <= g["area"] / (np.pi * g["r"] ** 2)
                        <= ROUNDNESS_BAND[1]):
                    continue
                p = np.array([g["cx"], g["cy"]])
                cards.append(dict(kind=kind, cx=g["cx"], cy=g["cy"], r=g["r"],
                                  t=float((p - c) @ along),
                                  offline=abs(float((p - c) @ across)) / g["r"]))
        cards.sort(key=lambda d: d["t"])
        result[f.stem] = dict(R=R, tape=[tmin, tmax], origin=c.tolist(),
                              along=along.tolist(), across=across.tolist(), cards=cards)
        _overview(a, result[f.stem], sheets / f"{f.stem}-overview.jpg")
        _contact(a, cards, sheets / f"{f.stem}-cards.png")
        print(f"  {f.stem}: {len(cards)} cards, R={R:.0f}px"
              f"{'  (rescue pass)' if relax else ''}")

    (work / "detections.json").write_text(json.dumps(result, indent=1))
    tmpl = {k: {str(i): "" for i in range(len(v["cards"]))} for k, v in result.items()}
    lp = work / "labels.template.json"
    lp.write_text(json.dumps(tmpl, indent=1))
    print(f"\nRead {sheets}/*-cards.png, fill in {lp.name} (null excludes a card),")
    print("save it as labels.json, then run `score`.")


def _overview(a, rec, path):
    im = Image.fromarray(a); d = ImageDraw.Draw(im)
    c = np.array(rec["origin"]); al = np.array(rec["along"]); ac = np.array(rec["across"])
    lo, hi = rec["tape"]
    d.line([tuple(c + al * lo), tuple(c + al * hi)], fill=(0, 0, 255), width=4)
    for i, card in enumerate(rec["cards"]):
        d.ellipse([card["cx"] - 10, card["cy"] - 10, card["cx"] + 10, card["cy"] + 10],
                  outline=(0, 0, 255), width=5)
        d.text((card["cx"] + 14, card["cy"] - 14), str(i), fill=(0, 0, 255))
    im.save(path, quality=85)


def _contact(a, cards, path, cell=190, cols=6):
    """Crops at working resolution, enlarged — this is the sheet you read task names off."""
    rows = (len(cards) + cols - 1) // cols or 1
    sheet = Image.new("RGB", (cols * cell, rows * (cell + 22)), (255, 255, 255))
    d = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 16)
    except OSError:
        font = None
    for i, card in enumerate(cards):
        r = int(card["r"] * 1.25)
        box = (int(card["cx"]) - r, int(card["cy"]) - r,
               int(card["cx"]) + r, int(card["cy"]) + r)
        crop = Image.fromarray(a).crop(box).resize((cell, cell), Image.LANCZOS)
        x, y = (i % cols) * cell, (i // cols) * (cell + 22)
        sheet.paste(crop, (x, y + 22))
        d.text((x + 4, y + 3), f"[{i}]", fill=(0, 0, 0), font=font)
    sheet.save(path)


# --------------------------------------------------------------------- score
def cmd_score(args):
    work = Path(args.work)
    det = json.loads((work / "detections.json").read_text())
    labels = json.loads((work / "labels.json").read_text())
    rows, notes = [], []

    for stem in sorted(det):
        rec, lab = det[stem], labels.get(stem, {})
        group = _group_number(stem)
        kept = []
        for i, card in enumerate(rec["cards"]):
            task = lab.get(str(i)) or None
            if task:
                kept.append(dict(task=task, **card))
        for task, cx, cy in lab.get("extra", []):          # cards added by hand
            p = np.array([cx, cy], float)
            c = np.array(rec["origin"]); al = np.array(rec["along"]); ac = np.array(rec["across"])
            kept.append(dict(task=task, kind=KIND[task], cx=cx, cy=cy, r=rec["R"],
                             t=float((p - c) @ al),
                             offline=abs(float((p - c) @ ac)) / rec["R"]))
        if not kept:
            continue

        kept = _drop_piles(kept, notes, group)
        kept = [k for k in kept if k["offline"] <= OFFLINE_DROP
                or notes.append(f"group {group}: dropped {k['task']} "
                                f"({k['offline']:.1f} radii off the line)")]
        kept.sort(key=lambda k: k["t"])

        if _reversed(kept):                                 # the 180-degree check
            notes.append(f"group {group}: axis reversed, flipped")
            for k in kept:
                k["t"] = -k["t"]
            kept.reverse()

        lo, hi = kept[0]["t"], kept[-1]["t"]
        span = (hi - lo) / (rec["tape"][1] - rec["tape"][0])
        if span < 0.5:
            notes.append(f"group {group}: cards span only {span:.0%} of the tape — "
                         f"the 1-10 rescaling stretches them")
        for k in kept:
            k["frac"] = (k["t"] - lo) / (hi - lo)

        for cluster in _cluster(kept):
            centre = sum(1 + 9 * k["frac"] for k in cluster) / len(cluster)
            value = min(10, max(1, round_half_up(centre)))
            d = abs(centre - round(centre))
            base = "high" if d < CONF_HIGH else ("medium" if d < CONF_MED else "low")
            for k in cluster:
                conf = "high" if k["frac"] in (0.0, 1.0) else base     # anchors are high
                cap = ("high" if k["offline"] < OFFLINE_MED else
                       "medium" if k["offline"] < OFFLINE_LOW else "low")
                order = ["low", "medium", "high"]
                rows.append(dict(
                    group=group, task=k["task"], task_type=KIND[k["task"]],
                    comfort_level=value,
                    confidence=order[min(order.index(conf), order.index(cap))],
                    position_on_scale=round(1 + 9 * k["frac"], 2),
                    tied_with=len(cluster) - 1, source_image=stem + args.ext))

    rows.sort(key=lambda r: (r["group"], r["comfort_level"], r["task_type"], r["task"]))
    out = Path(args.out); out.parent.mkdir(parents=True, exist_ok=True)
    with out.open("w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=["group", "task", "task_type", "comfort_level",
                                           "confidence", "position_on_scale", "tied_with",
                                           "source_image"])
        w.writeheader(); w.writerows(rows)
    print(f"{len(rows)} rows -> {out}")
    _checks(rows)
    for n in notes:
        print("  note:", n)


def _group_number(stem):
    import re
    m = [x for x in re.findall(r"\d+", stem) if len(x) != 4 or not x.startswith(("19", "20"))]
    if not m:
        raise SystemExit(f"no group number in {stem!r} — rename it or add it to labels.json")
    return int(m[0])


def _drop_piles(cards, notes, group):
    """A pile is >=2 cards close to each other and all well off the line. Runs first:
    a pile member can sit inside the keep band, and the order decides its fate."""
    far = [c for c in cards if c["offline"] > OFFLINE_MED]
    doomed = set()
    for i, a in enumerate(far):
        for b in far[i + 1:]:
            if np.hypot(a["cx"] - b["cx"], a["cy"] - b["cy"]) < PILE_PROXIMITY * a["r"]:
                doomed |= {a["task"], b["task"]}
    if doomed:
        notes.append(f"group {group}: pile dropped — {', '.join(sorted(doomed))}")
    return [c for c in cards if c["task"] not in doomed]


def _reversed(cards):
    lows = [i for i, c in enumerate(cards) if c["task"] in LOW_END]
    highs = [i for i, c in enumerate(cards) if c["task"] in HIGH_END]
    if not lows or not highs:
        return False
    return np.mean(lows) > np.mean(highs)


def _cluster(cards):
    out, cur = [], [cards[0]]
    for c in cards[1:]:
        here = 1 + 9 * c["frac"]
        prev = 1 + 9 * cur[-1]["frac"]
        start = 1 + 9 * cur[0]["frac"]
        if here - prev < CLUSTER_GAP and here - start <= CLUSTER_SPAN:
            cur.append(c)
        else:
            out.append(cur); cur = [c]
    out.append(cur)
    return out


def _checks(rows):
    from collections import Counter
    bad = []
    for r in rows:
        if r["task"] not in KIND:
            bad.append(f"unknown task {r['task']!r}")
        if not 1 <= r["comfort_level"] <= 10:
            bad.append(f"{r['task']} out of range")
    for g in {r["group"] for r in rows}:
        rs = [r for r in rows if r["group"] == g]
        for task, n in Counter(r["task"] for r in rs).items():
            if n > 1:
                bad.append(f"group {g}: {task} appears {n} times")
        for kind in ("teacher", "student"):
            n = sum(r["task_type"] == kind for r in rs)
            if n > 9:
                bad.append(f"group {g}: {n} {kind} cards (max 9)")
    print("  checks:", "all pass" if not bad else "FAILED")
    for b in bad:
        print("    !", b)


# ----------------------------------------------------------------------- cli
if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    p = sub.add_parser("prep");   p.add_argument("inputs"); p.add_argument("work"); p.set_defaults(fn=cmd_prep)
    p = sub.add_parser("detect"); p.add_argument("work")
    p.add_argument("--loose", nargs="*", help="stems to re-run with the rescue pass "
                   "when the contact sheet shows merged cards")
    p.set_defaults(fn=cmd_detect)
    p = sub.add_parser("score");  p.add_argument("work"); p.add_argument("out")
    p.add_argument("--ext", default=".HEIC", help="extension to write into source_image")
    p.set_defaults(fn=cmd_score)
    args = ap.parse_args()
    args.fn(args)
