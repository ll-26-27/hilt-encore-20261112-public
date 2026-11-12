# GENED 1104: from cooking observation to mathematical model

These notes map the equations implemented in the four imported HTML files to their controls and displays. The original [staff brief](gened-1104-staff-brief.md) supplies the teaching context and kitchen observations. The files are snapshots of the local `gened-1104` project behind https://gened-1104.vercel.app/.

| Example | Inputs: quantities the learner controls | Operations: implemented model | Outputs: what changes on screen |
|---|---|---|---|
| Onions | Onion mass (kg), fraction of water evaporated (%), effective power (W) | Convert mass to grams; evaporated water = mass × water fraction × evaporation fraction. Q = m_evap L_v + m c ΔT; t = Q/P. L_v = 2260 J/g. | Water remaining, energy required, predicted minutes, animated pan and energy display |
| Basil spheres | Radius (mm), diffusivity (m²/s), bath time (s) | δ = min(√(2Dt), R), with metres converted to millimetres. Gelled volume fraction = 1 − (1 − δ/R)³. | Shell thickness, cross-section, gelled fraction and specimen image |
| Coffee | Cold-brew grind radius (mm), temperature (°C), elapsed time | D(T) = D95 × 2^((T−95)/22); τ = Dt/r². Extraction uses the spherical diffusion series, with a short-time approximation. Time to the chosen extraction target scales as r²/D. | Hot/cold extraction curves, darkening glasses, times to target and recipe comparison |
| Tahini | Water fraction (%), particle size, temperature (°C), as labelled in the sim | x = w/8; Z = 6x exp(1−x); L(T) = 1−0.012(T−25); yield stress = 1.4×10⁵ L × 0.55 × Z/d². | Bridge network, yield-stress curve, and seizing/loosening regime |

The tahini relationship is an illustrative calibrated model, not a universal constitutive law. Coffee uses a calibrated diffusivity and a simplified spherical grain. Onion power is effective power into the food, and the energy budget is not a full browning model. Basil uses a diffusion-front approximation. Read the limitations in each simulation before interpreting its numbers.

For each example: predict the effect of doubling one input, derive the expected change, move the control, and explain where the approximation stops being useful. Distinguish the kitchen calibration target from an independently validated measurement.
