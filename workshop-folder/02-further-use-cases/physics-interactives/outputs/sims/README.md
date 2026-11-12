# Featured: Science and Cooking

Open [the GENED 1104 index](index.html) for the four cooking simulations. See [models and math](../../inputs/model-and-math.md) and the numbered [operations](../../operations/) for the inputs → operations → outputs workflow. The earlier workshop simulations below are also preserved.

---

# Example simulations

This folder contains three browser-based simulations produced with the
project's `/phet-sim` skill. Each simulation is a standalone HTML file. Open a
file in a browser; no server, installation, or network connection is required.

| File | Topic | Misconception addressed |
|---|---|---|
| [`enzyme-kinetics.html`](enzyme-kinetics.html) | Michaelis–Menten saturation and inhibition | Doubling substrate always doubles reaction rate; K<sub>m</sub> is a rate rather than a concentration |
| [`hardy-weinberg.html`](hardy-weinberg.html) | Changes in allele frequency | Dominant alleles always spread; selection quickly removes a recessive allele |
| [`predator-prey.html`](predator-prey.html) | Lotka–Volterra cycles and phase portraits | Predator and prey populations peak together; an outside cause is required for the cycle |

## Common interface

Each file includes:

- controls with current values and units
- two or three views linked to the same model state
- prompts that ask students to predict and then check an outcome
- a visible explanation of the model's limitations
- a design record in an HTML comment for instructors

## Technical checks

The mathematical output was compared with independent calculations:

- For enzyme kinetics at [S] = 10 µM, K<sub>m</sub> = 15, and V<sub>max</sub> =
  60, the simulation gives 40% occupancy and a rate of 24.0 µmol/min.
- For Hardy–Weinberg equilibrium at p = 0.5 with no selection, the genotype
  frequencies are 0.250, 0.500, and 0.250.
- The predator–prey model uses fourth-order Runge–Kutta integration. Near
  equilibrium, the predator peak follows the prey peak by about one-quarter of
  a cycle. The displayed large-amplitude example has a shorter measured delay.

All three files were also checked for the project's distribution requirements:
they contain no external scripts, frameworks, network requests, or build steps.
These checks do not replace review by a subject-matter expert or testing with
students.
