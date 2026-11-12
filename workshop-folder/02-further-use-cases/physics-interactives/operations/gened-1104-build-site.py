#!/usr/bin/env python3
"""
Render sim-workshop-staff.md into index.html.

Plain HTML, no dependencies at page load, no network. Re-run after editing
the markdown:

    python3 build-site.py
"""

import re
import markdown

SRC = "sim-workshop-staff.md"
OUT = "index.html"

# The sims linked from the page. (file, label, subtitle, equation)
SIMS = [
    ("onion-caramelization-sim.html", "Onions",
     "Why caramelizing takes 45 minutes, not the 10 recipes claim.",
     "Q = mL<sub>v</sub>"),
    ("basil-sphere-sim.html", "Basil spheres",
     "How thick the gel shell gets while the sphere sits in the calcium bath.",
     "δ = √(2Dt)"),
    ("coffee-sim.html", "Coffee",
     "Cold brew at 4 °C for 16 hours against hot brew at 95 °C for 5 minutes.",
     "√(Dt), D temperature-dependent"),
    ("tahini-seizing-sim.html", "Tahini",
     "Why a splash of water seizes it and more water loosens it again.",
     "capillary bridging"),
]

# ---------------------------------------------------------------- math

GREEK = {
    r"\delta": "δ", r"\Delta": "Δ", r"\alpha": "α", r"\beta": "β",
    r"\gamma": "γ", r"\eta": "η", r"\phi": "φ", r"\sigma": "σ",
    r"\varepsilon": "ε", r"\epsilon": "ε", r"\rho": "ρ", r"\mu": "µ",
    r"\pi": "π", r"\theta": "θ", r"\lambda": "λ", r"\omega": "ω",
    r"\approx": "≈", r"\times": "×", r"\cdot": "·", r"\pm": "±",
    r"\le": "≤", r"\ge": "≥", r"\to": "→", r"\propto": "∝",
}
SUPER = {"0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
         "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻"}


def texify(expr: str) -> str:
    """Turn a small subset of inline TeX into plain unicode HTML."""
    s = expr
    s = re.sub(r"\\sqrt\{([^{}]*)\}", r"√(\1)", s)
    s = re.sub(r"\\frac\{([^{}]*)\}\{([^{}]*)\}", r"(\1)/(\2)", s)
    s = re.sub(r"\\text\{([^{}]*)\}", r"\1", s)
    for k, v in GREEK.items():
        s = s.replace(k, v)
    # exponents: r^2 -> r², 10^{-7} -> 10⁻⁷
    s = re.sub(r"\^\{([^{}]*)\}",
               lambda m: "".join(SUPER.get(c, c) for c in m.group(1)), s)
    s = re.sub(r"\^(-?\w)",
               lambda m: "".join(SUPER.get(c, c) for c in m.group(1)), s)
    # subscripts: L_v -> L<sub>v</sub>
    s = re.sub(r"_\{([^{}]*)\}", r"<sub>\1</sub>", s)
    s = re.sub(r"_(\w)", r"<sub>\1</sub>", s)
    s = s.replace("{", "").replace("}", "").replace("\\", "")
    return s.strip()


def render_math(md_text: str) -> str:
    return re.sub(r"\$([^$\n]+)\$",
                  lambda m: f"<span class=\"m\">{texify(m.group(1))}</span>",
                  md_text)


# ---------------------------------------------------------------- build

def main():
    md_text = open(SRC, encoding="utf-8").read()

    # Strip the doc's own masthead: the H1, a bold-only standfirst line if
    # present, and the horizontal rule that closes the block. The page
    # supplies its own header for all three.
    lines = md_text.split("\n")
    i = 0
    while i < len(lines) and not lines[i].startswith("# "):
        i += 1
    i += 1                                               # past the H1
    while i < len(lines) and not lines[i].strip():
        i += 1
    if i < len(lines) and re.fullmatch(r"\*\*.+\*\*", lines[i].strip()):
        i += 1                                           # past the standfirst
    while i < len(lines) and (not lines[i].strip()
                              or re.fullmatch(r"-{3,}", lines[i].strip())):
        i += 1                                           # past blanks + rule
    md_text = "\n".join(lines[i:])
    md_text = render_math(md_text)

    body = markdown.markdown(
        md_text, extensions=["tables", "attr_list", "sane_lists"]
    )

    cards = "\n".join(
        f"""      <a class="sim" href="{href}">
        <span class="sim-name">{name}</span>
        <span class="sim-eq">{eq}</span>
        <span class="sim-sub">{sub}</span>
      </a>"""
        for href, name, sub, eq in SIMS
    )

    html = PAGE.replace("<!--BODY-->", body).replace("<!--CARDS-->", cards)
    open(OUT, "w", encoding="utf-8").write(html)
    print(f"wrote {OUT} ({len(html)//1024} KB)")


PAGE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Build a Sim in Two Hours — GENED 1104</title>
<style>
  :root { --ink:#111; --mid:#555; --faint:#888; --rule:#ddd; --bg:#fff; }
  * { box-sizing:border-box; }
  html { -webkit-text-size-adjust:100%; }
  body {
    margin:0; background:var(--bg); color:var(--ink);
    font:400 16px/1.62 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
    font-feature-settings:"tnum" 1;
    -webkit-font-smoothing:antialiased;
  }
  .wrap { max-width:44rem; margin:0 auto; padding:56px 24px 96px; }

  /* masthead */
  .rule-top { border-top:2px solid var(--ink); }
  .meta { font-size:12px; letter-spacing:.09em; text-transform:uppercase; color:var(--faint); margin:10px 0 22px; }
  h1.title { font-size:30px; line-height:1.18; font-weight:650; letter-spacing:-.015em; margin:0; }
  .standfirst { color:var(--mid); font-size:15px; margin:12px 0 0; }

  /* nav */
  .jump { margin:26px 0 0; padding:14px 0; border-top:1px solid var(--rule); border-bottom:1px solid var(--rule); font-size:14px; }
  .jump b { font-weight:600; }
  .jump a { color:var(--ink); }

  /* body copy */
  h2 { font-size:13px; letter-spacing:.1em; text-transform:uppercase; font-weight:700;
       margin:52px 0 14px; padding-bottom:7px; border-bottom:1px solid var(--ink); }
  h3 { font-size:17px; font-weight:650; margin:34px 0 10px; }
  h4 { font-size:14px; font-weight:650; margin:26px 0 8px; color:var(--mid); }
  p { margin:0 0 14px; }
  ul, ol { margin:0 0 14px; padding-left:22px; }
  li { margin:0 0 6px; }
  a { color:var(--ink); text-underline-offset:2px; }
  strong { font-weight:650; }
  hr { border:0; border-top:1px solid var(--rule); margin:38px 0; }
  code { font-family:ui-monospace, SFMono-Regular, Menlo, monospace; font-size:13.5px;
         background:#f4f4f4; padding:1px 5px; }
  blockquote { margin:20px 0; padding:2px 0 2px 18px; border-left:2px solid var(--ink);
               color:var(--mid); font-size:15px; }
  blockquote p:last-child { margin-bottom:0; }
  .m { font-style:italic; white-space:nowrap; }

  table { border-collapse:collapse; width:100%; margin:18px 0; font-size:14.5px; }
  th { text-align:left; font-weight:650; font-size:12px; letter-spacing:.06em;
       text-transform:uppercase; color:var(--faint);
       border-bottom:1px solid var(--ink); padding:0 12px 7px 0; }
  td { border-bottom:1px solid var(--rule); padding:9px 12px 9px 0; vertical-align:top; }
  td:last-child, th:last-child { padding-right:0; }

  /* sims */
  .sims { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:18px 0 0; }
  .sim { display:block; border:1px solid var(--ink); padding:16px 16px 18px;
         text-decoration:none; color:var(--ink); }
  .sim:hover { background:var(--ink); color:#fff; }
  .sim:hover .sim-eq, .sim:hover .sim-sub { color:#ccc; }
  .sim-name { display:block; font-weight:650; font-size:17px; }
  .sim-eq { display:block; font-style:italic; font-size:13.5px; color:var(--faint); margin:3px 0 7px; }
  .sim-sub { display:block; font-size:13.5px; line-height:1.45; color:var(--mid); }

  .foot { margin:64px 0 0; padding-top:14px; border-top:1px solid var(--rule);
          font-size:12.5px; color:var(--faint); display:flex; justify-content:space-between; gap:16px; }

  @media (max-width:640px) { .sims { grid-template-columns:1fr; } .wrap { padding:36px 18px 72px; } }
  @media print { .jump { display:none; } a { text-decoration:none; } }
</style>
</head>
<body>
<div class="wrap">

  <div class="rule-top"></div>
  <p class="meta">Bok Center · Learning Lab · staff session</p>
  <h1 class="title">Build a Sim in Two Hours</h1>
  <p class="standfirst">Testing the GENED 1104 sim assignment before it goes near students.</p>

  <p class="jump"><b>Worked examples:</b>
    <a href="onion-caramelization-sim.html">Onions</a> ·
    <a href="basil-sphere-sim.html">Basil spheres</a> ·
    <a href="coffee-sim.html">Coffee</a> ·
    <a href="tahini-seizing-sim.html">Tahini</a>
  </p>

<!--BODY-->

  <h2>The worked examples</h2>
  <p>Four of the seven topics already have a sim. Open them, drag the sliders,
     and look at what each one chose to draw — the pictures are different
     because the decision about what to show is a separate one from the physics.</p>

  <div class="sims">
<!--CARDS-->
  </div>

  <div class="foot">
    <span>GENED 1104 · Science and Cooking · draft for discussion</span>
    <span>Bok Center · Learning Lab</span>
  </div>

</div>
</body>
</html>
"""

if __name__ == "__main__":
    main()
