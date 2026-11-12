# 2. Make the equation visible

Give the assistant the staff brief and your model specification. Ask it to build one self-contained HTML file in `../outputs/sims/`: labelled controls with units, the equation with current values, a visual representation tied to that equation, and a visible account of what the model ignores. Sketch the representation before asking for code.

Use the existing `.claude/skills/` templates and rubrics if useful. The four GENED 1104 outputs are imported unchanged; they are worked examples, not regenerated results from this prompt.

The original homepage renderer is preserved as `gened-1104-build-site.py`. To regenerate the imported homepage, make a temporary directory containing that script as `build-site.py` and `../inputs/gened-1104-staff-brief.md` as `sim-workshop-staff.md`; run `python3 build-site.py` there with `python-markdown` installed, then copy its `index.html` to `../outputs/sims/index.html`. The four sim files must be beside the resulting homepage.
