# Make-up Candidates for Final Exam

_Generated 2026-05-14 from `tests_and_psets/final/final_s.tex` (LaTeX)._
_Context sources: none._
_Candidates per slot: 3._
_Topic scopes confirmed via interview phase (see test plan below)._

**How to use this file:**

- For each slot, three candidate replacement problems are provided (1A, 1B, 1C, ...). The original is excerpted at the top for orientation.
- Under each candidate are two clickable checkboxes (`- [ ] **Keep**`, `- [ ] **Drop**`). Most editors (VS Code, Cursor, GitHub web) let you click these to toggle.
- Check **Keep** on the candidate you want for the make-up. Check **Drop** on any candidate you want me to actively avoid in future iteration rounds.
- A candidate with neither box checked is "under consideration" — kept in the file for future rounds but not chosen.
- To **request another round** for a slot, fill in its `**Feedback for next round**` block with notes and re-invoke the skill.
- Once every slot has exactly one **Keep** checked, ask me to assemble the final make-up exam.

## Test plan (extracted from original; topic scopes confirmed via interview)

| Slot | Topic scope | Skills | Subparts | Difficulty | Est. time |
|------|-------------|--------|----------|------------|-----------|
| 1  | set identities + cardinality + characterization, on any binary/ternary set operation (broader, per interview) | mutual-inclusion identity proof; derived cardinality; characterizing condition | 3 (build-on) | medium | ~10 min |
| 2  | disprove-and-strengthen technique on **any substrate** — number theory, logic, or functions (broader+substrate-flex, per interview) | counterexample construction; proof of strengthened claim under added hypothesis | 2 (parallel) | medium-hard | ~10 min |
| 3  | any relations problem (broadest, per interview) | property-checking; equivalence classes; partial-order verification; relation composition / closure | 2 (build-on or parallel) | medium | ~8 min |
| 4  | any counting / combinatorics problem (broadest, per interview) | binomial / multinomial counting; multiplication principle; inclusion-exclusion | 2 (build-on) | easy-medium | ~6 min |
| 5  | any induction problem — ordinary, strong, or structural (broadest, per interview) | direct verification; induction proof on numerical, combinatorial, or recursive claim | 2 (build-on) | easy-medium | ~8 min |
| 6  | inductively-defined sets with possibly different object types or invariant character; same complexity (broader, per interview) | exhibit derivation; structural induction proof of invariant | 2 (build-on) | medium | ~10 min |
| 7  | Bayes with two conditionally independent ±tests on a binary state (narrow, per interview) | posterior with conditional independence | 2 (parallel) | medium-hard | ~10 min |
| 8  | random variables / expectation, preferring linearity + indicator variables (broadest, per interview) | indicator-variable decomposition; linearity of expectation; variance computation | 2 (build-on) | hard | ~12 min |
| 9  | graph theory restricted to coloring, connectivity, or isomorphism (broadest, per interview) | graph property analysis: chromatic number, component counting, or isomorphism check | 2 (build-on) | medium | ~8 min |
| 10 | broken greedy MST: success/failure construction + named fix (narrow, per interview) | constructive counterexample; identification of corrected named algorithm | 3 (parallel + synthesis) | medium-hard | ~12 min |

**Format conventions of the original:** `\begin{problem}…\end{problem}` blocks; `\subproblem` for parts; `\begin{solution}…\end{solution}` with `\subsolution` for solution parts; `$…$` and `\[…\]` for math; `\pagebreak` between problems. All candidates follow these conventions.

---

## Slot 1 — Set identities + cardinality + characterization · 3 subparts · ~10 min · medium

**Original (excerpt for orientation):**

> For sets $A$ and $B$, define the symmetric difference as $A \triangle B = (A \setminus B) \cup (B \setminus A)$. (a) Prove $A \triangle B = (A \cup B) \setminus (A \cap B)$. (b) Use part (a) to prove $|A \triangle B| = |A| + |B| - 2|A \cap B|$. (c) State a condition on $A$ and $B$ characterizing when $A \triangle B = A \cup B$.

### Candidate 1A — Distributivity of intersection over union for three sets

- [ ] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Tests the same three-skill build (mutual-inclusion identity → derived cardinality → characterizing condition) on a three-set distributivity rather than symmetric difference; the operation, the cardinality formula, and the characterizing condition ($A \cap B \cap C = \emptyset$) are all unrelated to the original.

```latex
\begin{problem}

Let $A$, $B$, and $C$ be sets.

\subproblem Prove the distributive identity $(A \cup B) \cap C = (A \cap C) \cup (B \cap C)$. (Hint: show $\subseteq$ in both directions.)

\subproblem Using part (a), prove the cardinality formula
\[
|(A \cup B) \cap C| = |A \cap C| + |B \cap C| - |A \cap B \cap C|
\]
for finite sets $A$, $B$, $C$. You may use without proof the inclusion--exclusion principle $|X \cup Y| = |X| + |Y| - |X \cap Y|$.

\subproblem State a condition on $A$, $B$, $C$ that characterizes exactly when $|(A \cup B) \cap C| = |A \cap C| + |B \cap C|$. (No justification required.)

\begin{solution}
\subsolution ($\subseteq$) Let $x \in (A \cup B) \cap C$. Then $x \in C$ and ($x \in A$ or $x \in B$). If $x \in A$, then $x \in A \cap C$; if $x \in B$, then $x \in B \cap C$. Either way, $x \in (A \cap C) \cup (B \cap C)$.

($\supseteq$) Let $x \in (A \cap C) \cup (B \cap C)$. Then either $x \in A \cap C$ or $x \in B \cap C$. In either case $x \in C$, and $x \in A$ or $x \in B$, so $x \in A \cup B$. Hence $x \in (A \cup B) \cap C$. $\blacksquare$

\subsolution By part (a), $(A \cup B) \cap C = (A \cap C) \cup (B \cap C)$. Apply inclusion--exclusion to the right-hand side, taking $X = A \cap C$ and $Y = B \cap C$:
\[
|(A \cap C) \cup (B \cap C)| = |A \cap C| + |B \cap C| - |(A \cap C) \cap (B \cap C)|.
\]
The intersection $(A \cap C) \cap (B \cap C) = A \cap B \cap C$, so
\[
|(A \cup B) \cap C| = |A \cap C| + |B \cap C| - |A \cap B \cap C|. \quad \blacksquare
\]

\subsolution $|(A \cup B) \cap C| = |A \cap C| + |B \cap C|$ iff $A \cap B \cap C = \emptyset$ (no element of $C$ lies in both $A$ and $B$).
\end{solution}

\pagebreak

\end{problem}
```

### Candidate 1B — Iterated set difference

- [x] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Same three skills via iterated set difference; the proof is mutual-inclusion on a 3-letter expression, the cardinality formula is a subtraction (rather than the original's $+ \cdots - 2 \cdots$), and the characterizing condition asks "$A$ disjoint from both $B$ and $C$."

```latex
\begin{problem}

Let $A$, $B$, and $C$ be sets.

\subproblem Prove that $(A \setminus B) \setminus C = A \setminus (B \cup C)$. (Hint: show $\subseteq$ in both directions.)

\subproblem Using part (a), prove the cardinality formula
\[
|(A \setminus B) \setminus C| = |A| - |A \cap (B \cup C)|
\]
for finite sets $A$, $B$, $C$. You may use without proof that for finite sets $X \subseteq Y$, $|Y \setminus X| = |Y| - |X|$, and the standard identity $A \setminus S = A \setminus (A \cap S)$ for any $S$.

\subproblem State a condition on $A$, $B$, $C$ that characterizes exactly when $(A \setminus B) \setminus C = A$. (No justification required.)

\begin{solution}
\subsolution ($\subseteq$) Let $x \in (A \setminus B) \setminus C$. Then $x \in A \setminus B$ and $x \notin C$, i.e., $x \in A$, $x \notin B$, and $x \notin C$. So $x \notin B \cup C$, hence $x \in A \setminus (B \cup C)$.

($\supseteq$) Let $x \in A \setminus (B \cup C)$. Then $x \in A$, $x \notin B$, and $x \notin C$. Then $x \in A \setminus B$ and $x \notin C$, so $x \in (A \setminus B) \setminus C$. $\blacksquare$

\subsolution By part (a), $(A \setminus B) \setminus C = A \setminus (B \cup C)$. Using $A \setminus S = A \setminus (A \cap S)$ with $S = B \cup C$, and then the given fact about cardinality of subtraction:
\[
|A \setminus (B \cup C)| = |A \setminus (A \cap (B \cup C))| = |A| - |A \cap (B \cup C)|. \quad \blacksquare
\]

\subsolution $(A \setminus B) \setminus C = A$ iff $A \cap (B \cup C) = \emptyset$, i.e., $A$ is disjoint from both $B$ and $C$.
\end{solution}

\pagebreak

\end{problem}
```

### Candidate 1C — Three-piece partition of a union

- [ ] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Same three skills, but the cardinality formula is a *sum* of three sizes (no subtraction), and the proof requires both a mutual-inclusion step and a disjointness check; the characterizing condition ($A \subseteq B$) is a third distinct answer.

```latex
\begin{problem}

Let $A$ and $B$ be sets.

\subproblem Prove that $A \cup B = (A \setminus B) \cup (B \setminus A) \cup (A \cap B)$, and verify that the three pieces $A \setminus B$, $B \setminus A$, $A \cap B$ are pairwise disjoint. (Hint: show set equality by mutual inclusion, then check disjointness pairwise.)

\subproblem Using part (a), prove the cardinality formula
\[
|A \cup B| = |A \setminus B| + |B \setminus A| + |A \cap B|
\]
for finite sets $A$ and $B$. You may use without proof that the cardinality of a finite disjoint union is the sum of the cardinalities of its pieces.

\subproblem State a condition on $A$ and $B$ that characterizes exactly when $A \setminus B = \emptyset$. (No justification required.)

\begin{solution}
\subsolution ($\subseteq$) Let $x \in A \cup B$. Either $x \in A \setminus B$, $x \in B \setminus A$, or $x \in A \cap B$, depending on which of $A$ and $B$ contain $x$. In every case, $x$ lies in $(A \setminus B) \cup (B \setminus A) \cup (A \cap B)$.

($\supseteq$) Each of $A \setminus B$, $B \setminus A$, $A \cap B$ is a subset of $A \cup B$. Hence the union of the three is also a subset of $A \cup B$. $\blacksquare$

Disjointness: an element of $A \setminus B$ has $x \notin B$, but every element of $B \setminus A$ and of $A \cap B$ has $x \in B$. So $A \setminus B$ is disjoint from each of the others. Similarly $B \setminus A$ (with $x \notin A$) is disjoint from $A \cap B$ (with $x \in A$).

\subsolution By part (a), $A \cup B$ is the disjoint union of the three pieces, so
\[
|A \cup B| = |A \setminus B| + |B \setminus A| + |A \cap B|. \quad \blacksquare
\]

\subsolution $A \setminus B = \emptyset$ iff $A \subseteq B$.
\end{solution}

\pagebreak

\end{problem}
```

**Feedback for next round:**

_(empty)_

---

## Slot 2 — Disprove + strengthen on any substrate · 2 subparts · ~10 min · medium-hard

**Original (excerpt for orientation):**

> Claim: for all positive integers $a, b$, if $ab$ is a perfect square then both are. (a) Disprove with a counterexample. (b) Prove the strengthened claim with the added hypothesis $\gcd(a,b)=1$ (using unique prime factorization).

### Candidate 2A — Number theory: Euclid's lemma via Bézout

- [ ] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Same disprove-then-strengthen-with-coprimality structure on a number-theoretic claim, but the claim (divisibility of a product) and the proof technique (Bézout's identity) are independent of the original's perfect-square / UPF setup.

```latex
\begin{problem}

Consider the claim: \emph{For all positive integers $a$, $b$, $c$, if $a \mid bc$ then $a \mid b$ or $a \mid c$.}

\subproblem Disprove the claim by giving an explicit counterexample with concrete values of $a$, $b$, and $c$. Verify that your counterexample satisfies the hypothesis but not the conclusion.

\subproblem Prove the \emph{strengthened claim:} For all positive integers $a$, $b$, $c$ with $\gcd(a, b) = 1$, if $a \mid bc$ then $a \mid c$. You may use without proof B\'ezout's identity: $\gcd(a, b) = 1$ implies there exist integers $x, y$ with $ax + by = 1$.

\begin{solution}
\subsolution Take $a = 6$, $b = 4$, $c = 9$. Then $bc = 36$ and $6 \mid 36$, so the hypothesis holds. But $6 \nmid 4$ and $6 \nmid 9$, so the conclusion fails.

\subsolution Suppose $\gcd(a, b) = 1$ and $a \mid bc$. By B\'ezout, there exist integers $x, y$ with $ax + by = 1$. Multiply by $c$:
\[
acx + bcy = c.
\]
Now $a \mid acx$ trivially, and $a \mid bcy$ because $a \mid bc$. So $a$ divides $c$. $\blacksquare$

The counterexample violates the hypothesis: $\gcd(6, 4) = 2 \neq 1$.
\end{solution}

\pagebreak

\end{problem}
```

### Candidate 2B — Logic: a propositional satisfiability claim

- [ ] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Same disprove-then-strengthen structure but in propositional logic — students give a truth-assignment counterexample and then prove the strengthened version by contradiction; substrate is entirely outside the number-theory / coprimality framing of the original, which gives the strongest security gap.

```latex
\begin{problem}

For propositional formulas $\varphi$ and $\psi$, recall: $\varphi$ is \emph{satisfiable} if some truth assignment makes $\varphi$ true; $\varphi$ is a \emph{tautology} if every truth assignment makes $\varphi$ true.

Consider the claim: \emph{For all propositional formulas $\varphi$ and $\psi$, if $\varphi \wedge \psi$ is satisfiable, then both $\varphi$ and $\psi$ are tautologies.}

\subproblem Disprove the claim by giving an explicit counterexample with concrete formulas $\varphi$ and $\psi$. Verify by exhibiting a satisfying assignment for $\varphi \wedge \psi$ and a falsifying assignment for at least one of $\varphi$ or $\psi$.

\subproblem Prove the \emph{strengthened claim:} For all propositional formulas $\varphi$ and $\psi$, if $\varphi \wedge \psi$ is a \emph{tautology}, then both $\varphi$ and $\psi$ are tautologies.

\begin{solution}
\subsolution Take $\varphi = p$ and $\psi = q$ (two distinct propositional variables). Then $\varphi \wedge \psi = p \wedge q$ is satisfied by the assignment $p = T, q = T$, so the hypothesis holds. But the assignment $p = F$ makes $\varphi = p$ false, so $\varphi$ is not a tautology. Hence the conclusion fails.

\subsolution Suppose for contradiction that $\varphi \wedge \psi$ is a tautology but $\varphi$ is not (the case where $\psi$ is not a tautology is symmetric). Then there exists a truth assignment $\alpha$ that makes $\varphi$ false. Under $\alpha$, $\varphi \wedge \psi$ is false (a conjunction is false whenever either conjunct is false). This contradicts $\varphi \wedge \psi$ being a tautology. Hence $\varphi$ must be a tautology, and by the same argument so must $\psi$. $\blacksquare$

The counterexample violates the strengthened hypothesis: $\varphi \wedge \psi = p \wedge q$ is satisfiable but not a tautology (the assignment $p = F$ falsifies it).
\end{solution}

\pagebreak

\end{problem}
```

### Candidate 2C — Functions: composition of partial inverses

- [x] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Same disprove-then-strengthen structure on a claim about function composition; the substrate (functions and their inverses) is unrelated to the original's number theory, and the strengthening adds a second composition equation as the hypothesis.

```latex
\begin{problem}

Let $A$ and $B$ be (possibly infinite) sets. For functions $f: A \to B$ and $g: B \to A$, write $g \circ f: A \to A$ for the composition $(g \circ f)(x) = g(f(x))$. Let $\mathrm{id}_A: A \to A$ denote the identity function on $A$.

Consider the claim: \emph{For all functions $f: A \to B$ and $g: B \to A$, if $g \circ f = \mathrm{id}_A$, then $f$ is a bijection and $g = f^{-1}$.}

\subproblem Disprove the claim by giving explicit finite sets $A$, $B$ and explicit functions $f$, $g$ satisfying the hypothesis but not the conclusion. Verify each property.

\subproblem Prove the \emph{strengthened claim:} For all functions $f: A \to B$ and $g: B \to A$, if $g \circ f = \mathrm{id}_A$ and $f \circ g = \mathrm{id}_B$, then $f$ is a bijection and $g = f^{-1}$.

\begin{solution}
\subsolution Take $A = \{1, 2\}$, $B = \{1, 2, 3\}$, with $f(1) = 1$, $f(2) = 2$, and $g(1) = 1$, $g(2) = 2$, $g(3) = 1$. Verify the hypothesis: $(g \circ f)(1) = g(1) = 1$ and $(g \circ f)(2) = g(2) = 2$, so $g \circ f = \mathrm{id}_A$. But $f$ is not surjective (no element of $A$ maps to $3 \in B$), so $f$ is not a bijection. Hence the conclusion fails.

\subsolution Assume $g \circ f = \mathrm{id}_A$ and $f \circ g = \mathrm{id}_B$.

\emph{$f$ is injective.} Suppose $f(x_1) = f(x_2)$ for some $x_1, x_2 \in A$. Apply $g$ to both sides: $g(f(x_1)) = g(f(x_2))$, i.e., $(g \circ f)(x_1) = (g \circ f)(x_2)$, i.e., $x_1 = x_2$.

\emph{$f$ is surjective.} For any $y \in B$, take $x = g(y) \in A$. Then $f(x) = f(g(y)) = (f \circ g)(y) = y$.

So $f$ is a bijection. Finally, $g = f^{-1}$: for every $y \in B$, $f(g(y)) = y$ (from the second hypothesis), which is exactly the defining property of the inverse. $\blacksquare$

The counterexample violates the strengthened hypothesis: $f \circ g \neq \mathrm{id}_B$, since $(f \circ g)(3) = f(g(3)) = f(1) = 1 \neq 3$.
\end{solution}

\pagebreak

\end{problem}
```

**Feedback for next round:**

_(empty)_

---

## Slot 3 — Any relations problem · 2 subparts · ~8 min · medium

**Original (excerpt for orientation):**

> $R$ on $A$ with $|A| \ge 2$. (a) Prove: if $R$ is symmetric, transitive, and irreflexive then $R = \emptyset$. (b) Show the conclusion can fail without transitivity by giving a non-empty symmetric, irreflexive $R$ on $\{1,2,3\}$.

### Candidate 3A — Verify an equivalence relation and describe its classes

- [x] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Tests relation-property *verification* (rather than property-combo proof) and the construction of equivalence classes; same medium difficulty and 2-subpart shape, but the specific skill differs from the original (per the broadest scope you confirmed).

```latex
\begin{problem}

Define a relation $R$ on $\mathbb{Z}$ by
\[
a \mathbin{R} b \iff 3 \mid (a - b).
\]

\subproblem Prove that $R$ is an equivalence relation on $\mathbb{Z}$ (i.e., $R$ is reflexive, symmetric, and transitive).

\subproblem Describe the equivalence classes of $R$. How many distinct classes are there, and what does each one look like?

\begin{solution}
\subsolution
\emph{Reflexive.} For any $a \in \mathbb{Z}$, $a - a = 0$ and $3 \mid 0$, so $a \mathbin{R} a$.

\emph{Symmetric.} Suppose $a \mathbin{R} b$, i.e., $3 \mid (a - b)$, so $a - b = 3k$ for some $k \in \mathbb{Z}$. Then $b - a = -3k = 3(-k)$, so $3 \mid (b - a)$, i.e., $b \mathbin{R} a$.

\emph{Transitive.} Suppose $a \mathbin{R} b$ and $b \mathbin{R} c$, so $a - b = 3k$ and $b - c = 3m$ for integers $k, m$. Then $a - c = (a - b) + (b - c) = 3k + 3m = 3(k + m)$, so $3 \mid (a - c)$, i.e., $a \mathbin{R} c$. $\blacksquare$

\subsolution The equivalence class of $a$ is $\{b \in \mathbb{Z} : 3 \mid (a - b)\}$, which is the set of integers congruent to $a$ modulo $3$.

There are exactly $\boxed{3}$ distinct equivalence classes:
\begin{itemize}
\item $[0] = \{\ldots, -6, -3, 0, 3, 6, \ldots\}$ (integers divisible by $3$).
\item $[1] = \{\ldots, -5, -2, 1, 4, 7, \ldots\}$ (integers $\equiv 1 \pmod 3$).
\item $[2] = \{\ldots, -4, -1, 2, 5, 8, \ldots\}$ (integers $\equiv 2 \pmod 3$).
\end{itemize}
Every integer lies in exactly one of these three classes.
\end{solution}

\pagebreak

\end{problem}
```

### Candidate 3B — Verify a partial order; check totality

- [ ] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Tests verification of the three partial-order properties (reflexive, antisymmetric, transitive) and the distinction between partial and total orders; same medium difficulty, parallel-structure subparts, but the skill (partial-order verification) is distinct from the original.

```latex
\begin{problem}

Let $\mathbb{Z}^+$ denote the positive integers. Define a relation $R$ on $\mathbb{Z}^+$ by
\[
a \mathbin{R} b \iff a \mid b.
\]

\subproblem Prove that $R$ is a partial order on $\mathbb{Z}^+$ (i.e., $R$ is reflexive, antisymmetric, and transitive).

\subproblem Determine whether $R$ is a \emph{total order} on $\mathbb{Z}^+$: that is, whether for every pair of positive integers $a, b$, either $a \mathbin{R} b$ or $b \mathbin{R} a$. If $R$ is a total order, prove it; if not, give a specific pair $a, b$ that fails the condition.

\begin{solution}
\subsolution
\emph{Reflexive.} For any $a \in \mathbb{Z}^+$, $a = a \cdot 1$, so $a \mid a$, i.e., $a \mathbin{R} a$.

\emph{Antisymmetric.} Suppose $a \mathbin{R} b$ and $b \mathbin{R} a$, i.e., $a \mid b$ and $b \mid a$. Then $b = ak$ and $a = bm$ for positive integers $k, m$. Substituting, $a = bm = (ak)m = a(km)$, so $km = 1$. Since $k$ and $m$ are positive integers, $k = m = 1$, so $a = b$.

\emph{Transitive.} Suppose $a \mid b$ and $b \mid c$, so $b = ak$ and $c = bm$ for positive integers $k, m$. Then $c = bm = (ak)m = a(km)$, so $a \mid c$, i.e., $a \mathbin{R} c$. $\blacksquare$

\subsolution $R$ is \emph{not} a total order. Take $a = 2$ and $b = 3$. Then $2 \nmid 3$ (since $3 = 2 \cdot 1 + 1$) and $3 \nmid 2$ (since $2 < 3$). So neither $a \mathbin{R} b$ nor $b \mathbin{R} a$, violating the totality condition.
\end{solution}

\pagebreak

\end{problem}
```

### Candidate 3C — Composition and transitive closure

- [ ] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Tests *computational* relation skills (composition, transitive closure) — pure pair-set manipulation, no abstract property proof; same medium difficulty and 2-subpart shape, but skill is again distinct from the original's property-combo argument.

```latex
\begin{problem}

Let $A = \{1, 2, 3, 4\}$ and let $R = \{(1, 2), (2, 3), (3, 4), (4, 1)\}$, viewed as a relation on $A$. Recall that the composition is defined by
\[
R \circ R = \{(a, c) : \exists b \in A \text{ with } (a, b) \in R \text{ and } (b, c) \in R\},
\]
and the transitive closure $R^*$ is the smallest transitive relation on $A$ containing $R$.

\subproblem Compute $R \circ R$ as an explicit set of pairs.

\subproblem Compute the transitive closure $R^*$ as an explicit set of pairs.

\begin{solution}
\subsolution For each $(a, b) \in R$, find every $c$ with $(b, c) \in R$:
\begin{itemize}
\item $(1, 2) \in R$ and $(2, 3) \in R$, so $(1, 3) \in R \circ R$.
\item $(2, 3) \in R$ and $(3, 4) \in R$, so $(2, 4) \in R \circ R$.
\item $(3, 4) \in R$ and $(4, 1) \in R$, so $(3, 1) \in R \circ R$.
\item $(4, 1) \in R$ and $(1, 2) \in R$, so $(4, 2) \in R \circ R$.
\end{itemize}
So $R \circ R = \{(1, 3), (2, 4), (3, 1), (4, 2)\}$.

\subsolution $R$ traces a $4$-cycle: $1 \to 2 \to 3 \to 4 \to 1 \to 2 \to \cdots$. From any vertex, we can reach every vertex (including itself) in $1$, $2$, $3$, or $4$ steps. So the transitive closure contains every ordered pair $(a, c) \in A \times A$:
\[
R^* = A \times A = \{(a, c) : a, c \in \{1, 2, 3, 4\}\},
\]
which is the set of all $16$ ordered pairs.
\end{solution}

\pagebreak

\end{problem}
```

**Feedback for next round:**

_(empty)_

---

## Slot 4 — Any counting / combinatorics problem · 2 subparts · ~6 min · easy-medium

**Original (excerpt for orientation):**

> Lattice paths from $(0,0)$ to $(5,3)$ with right and up unit steps. (a) How many total. (b) How many pass through $(3, 2)$.

### Candidate 4A — Permutations with adjacency constraint

- [x] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Tests *permutation* counting (a different combinatorial primitive than the original's binomial-coefficient counting) plus the standard "treat-pair-as-unit" trick for an adjacency constraint; same difficulty band and structural shape.

```latex
\begin{problem}

Six people --- including Alice and Bob --- are to be seated in a row of $6$ chairs.

\subproblem In how many distinct orderings can the six people be seated, with no further restrictions?

\subproblem In how many of those orderings do Alice and Bob sit next to each other (in either order)?

\begin{solution}
\subsolution The number of arrangements of $6$ distinct people in a row is $6! = 720$.

\subsolution Treat Alice and Bob as a single "block." Then there are $5$ items to arrange (the AB-block plus the other $4$ people), giving $5! = 120$ arrangements. Within the block, Alice and Bob can be in $2$ internal orders (A--B or B--A). By the product rule, the count is $5! \cdot 2 = 240$.
\end{solution}

\pagebreak

\end{problem}
```

### Candidate 4B — Multinomial coefficient (anagrams)

- [ ] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Tests *multinomial* counting (rather than the original's binomial), via anagrams of a word with repeated letters; same easy-medium difficulty and 2-subpart structure.

```latex
\begin{problem}

Consider distinct anagrams of the word \texttt{MISSISSIPPI}, which has $11$ letters: \texttt{M} once, \texttt{I} four times, \texttt{S} four times, \texttt{P} twice.

\subproblem How many distinct anagrams of \texttt{MISSISSIPPI} are there with no further restrictions?

\subproblem How many of these anagrams begin with the letter \texttt{M}?

\begin{solution}
\subsolution The total number of distinct anagrams of $\texttt{MISSISSIPPI}$ is the multinomial coefficient
\[
\frac{11!}{1! \cdot 4! \cdot 4! \cdot 2!} = \frac{39\,916\,800}{1 \cdot 24 \cdot 24 \cdot 2} = \frac{39\,916\,800}{1152} = 34\,650.
\]

\subsolution If \texttt{M} is fixed in position $1$, the remaining $10$ positions hold the multiset $\{\texttt{I}, \texttt{I}, \texttt{I}, \texttt{I}, \texttt{S}, \texttt{S}, \texttt{S}, \texttt{S}, \texttt{P}, \texttt{P}\}$. The number of distinct arrangements of this multiset is
\[
\frac{10!}{4! \cdot 4! \cdot 2!} = \frac{3\,628\,800}{24 \cdot 24 \cdot 2} = \frac{3\,628\,800}{1152} = 3150.
\]
\end{solution}

\pagebreak

\end{problem}
```

### Candidate 4C — Inclusion–exclusion on divisibility

- [ ] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Tests inclusion--exclusion (a third counting primitive, distinct from the original's binomial counting and from candidates 4A/4B); same easy-medium difficulty and 2-subpart build-on shape.

```latex
\begin{problem}

\subproblem Among the integers from $1$ to $200$ (inclusive), how many are divisible by $2$ or $3$ (or both)? Use inclusion--exclusion.

\subproblem Using your answer to part (a), determine how many integers from $1$ to $200$ are divisible by neither $2$ nor $3$.

\begin{solution}
\subsolution Let $A$ = integers in $\{1, \ldots, 200\}$ divisible by $2$, and $B$ = integers in $\{1, \ldots, 200\}$ divisible by $3$. Then
\[
|A| = \lfloor 200/2 \rfloor = 100, \quad |B| = \lfloor 200/3 \rfloor = 66, \quad |A \cap B| = \lfloor 200/6 \rfloor = 33.
\]
By inclusion--exclusion,
\[
|A \cup B| = |A| + |B| - |A \cap B| = 100 + 66 - 33 = 133.
\]

\subsolution Integers in $\{1, \ldots, 200\}$ divisible by neither $2$ nor $3$ form the complement of $A \cup B$:
\[
200 - |A \cup B| = 200 - 133 = 67.
\]
\end{solution}

\pagebreak

\end{problem}
```

**Feedback for next round:**

_(empty)_

---

## Slot 5 — Any induction problem · 2 subparts · ~8 min · easy-medium

**Original (excerpt for orientation):**

> (a) Verify $7 \mid 8^n - 1$ for $n = 1, 2, 3$ by direct computation. (b) Prove by induction that $7 \mid 8^n - 1$ for all $n \geq 1$.

### Candidate 5A — Sum identity (Gauss formula) by ordinary induction

- [ ] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Tests ordinary induction on a *sum identity* (rather than a divisibility claim); same verify-then-induct two-subpart structure, same easy-medium difficulty.

```latex
\begin{problem}

Let $S(n) = 1 + 2 + 3 + \cdots + n$ for $n \geq 1$.

\subproblem Verify that $S(n) = \dfrac{n(n+1)}{2}$ for $n = 1, 2, 3$ by direct computation.

\subproblem Prove by induction on $n$ that $S(n) = \dfrac{n(n+1)}{2}$ for every integer $n \geq 1$.

\begin{solution}
\subsolution
\begin{itemize}
\item $n = 1$: $S(1) = 1$ and $\frac{1 \cdot 2}{2} = 1$. $\checkmark$
\item $n = 2$: $S(2) = 1 + 2 = 3$ and $\frac{2 \cdot 3}{2} = 3$. $\checkmark$
\item $n = 3$: $S(3) = 1 + 2 + 3 = 6$ and $\frac{3 \cdot 4}{2} = 6$. $\checkmark$
\end{itemize}

\subsolution Let $P(n) := \left(S(n) = \frac{n(n+1)}{2}\right)$. Proof for all $n \geq 1$ by induction.

\emph{Base case ($n = 1$).} $S(1) = 1 = \frac{1 \cdot 2}{2}$, so $P(1)$ holds.

\emph{Inductive step.} Assume $P(k)$: $S(k) = \frac{k(k+1)}{2}$. Show $P(k + 1)$: $S(k + 1) = \frac{(k+1)(k+2)}{2}$.
\[
S(k + 1) = S(k) + (k + 1) = \frac{k(k + 1)}{2} + (k + 1) = \frac{k(k + 1) + 2(k + 1)}{2} = \frac{(k + 1)(k + 2)}{2}.
\]
Hence $P(k + 1)$ holds, and by induction $P(n)$ holds for all $n \geq 1$. $\blacksquare$
\end{solution}

\pagebreak

\end{problem}
```

### Candidate 5B — Existence of prime factorization by strong induction

- [ ] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Tests *strong* induction on the existence half of the fundamental theorem of arithmetic; same verify-then-induct shape, same easy-medium difficulty, but uses strong induction instead of ordinary — a structurally distinct technique from the original.

```latex
\begin{problem}

A positive integer $n \geq 2$ is said to have a \emph{prime factorization} if it can be written as a product of one or more (not necessarily distinct) primes.

\subproblem Verify that $n = 2$, $n = 3$, and $n = 12$ each have a prime factorization by writing each as an explicit product of primes.

\subproblem Prove by strong induction that every integer $n \geq 2$ has a prime factorization.

\begin{solution}
\subsolution
\begin{itemize}
\item $n = 2 = 2$ (a single prime, so a product of one prime). $\checkmark$
\item $n = 3 = 3$ (a single prime). $\checkmark$
\item $n = 12 = 2 \cdot 2 \cdot 3$ (a product of three primes). $\checkmark$
\end{itemize}

\subsolution Let $P(n) :=$ "$n$ has a prime factorization." Proof for all $n \geq 2$ by strong induction.

\emph{Base case ($n = 2$).} $2$ is prime, so $2 = 2$ is itself a (one-factor) prime factorization. $P(2)$ holds.

\emph{Inductive step.} Fix $n \geq 3$ and assume $P(k)$ holds for every integer $k$ with $2 \leq k < n$. Show $P(n)$.

Case 1: $n$ is prime. Then $n = n$ is a (one-factor) prime factorization, so $P(n)$ holds.

Case 2: $n$ is composite. Then there exist integers $a, b$ with $2 \leq a, b < n$ and $n = a \cdot b$. By the inductive hypothesis, both $a$ and $b$ have prime factorizations, say $a = p_1 \cdots p_r$ and $b = q_1 \cdots q_s$. Then
\[
n = a \cdot b = p_1 \cdots p_r \cdot q_1 \cdots q_s
\]
is a product of primes, so $n$ has a prime factorization. Hence $P(n)$ holds.

By strong induction, $P(n)$ holds for all $n \geq 2$. $\blacksquare$
\end{solution}

\pagebreak

\end{problem}
```

### Candidate 5C — Inequality `2^n > n²` for `n ≥ 5` by ordinary induction

- [ ] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Tests ordinary induction on an *inequality* (rather than equality / divisibility), with a non-standard base case ($n = 5$); same verify-then-induct shape, same easy-medium difficulty, but the inductive step requires an algebraic inequality argument distinct from the original's modular reasoning.

```latex
\begin{problem}

\subproblem Verify that $2^n > n^2$ for $n = 5$ and $n = 6$ by direct computation.

\subproblem Prove by induction that $2^n > n^2$ for every integer $n \geq 5$.

\begin{solution}
\subsolution
\begin{itemize}
\item $n = 5$: $2^5 = 32$, $5^2 = 25$, and $32 > 25$. $\checkmark$
\item $n = 6$: $2^6 = 64$, $6^2 = 36$, and $64 > 36$. $\checkmark$
\end{itemize}

\subsolution Let $P(n) := (2^n > n^2)$. Proof for all $n \geq 5$ by induction.

\emph{Base case ($n = 5$).} $2^5 = 32 > 25 = 5^2$, so $P(5)$ holds.

\emph{Inductive step.} Fix $k \geq 5$ and assume $P(k)$ holds: $2^k > k^2$. Show $P(k + 1)$: $2^{k+1} > (k+1)^2$.
\[
2^{k+1} = 2 \cdot 2^k > 2 k^2 \quad \text{(by the inductive hypothesis).}
\]
It suffices to show $2 k^2 \geq (k + 1)^2$ for $k \geq 5$. Expand:
\[
2 k^2 - (k + 1)^2 = 2 k^2 - k^2 - 2k - 1 = k^2 - 2k - 1 = (k - 1)^2 - 2.
\]
For $k \geq 5$, $(k - 1)^2 \geq 16 > 2$, so $2k^2 - (k + 1)^2 \geq 16 - 2 = 14 > 0$, giving $2 k^2 > (k + 1)^2$.

Combining, $2^{k+1} > 2 k^2 > (k + 1)^2$, so $P(k + 1)$ holds. By induction, $P(n)$ holds for all $n \geq 5$. $\blacksquare$
\end{solution}

\pagebreak

\end{problem}
```

**Feedback for next round** (consumed by Round 2):

> All of these are just a tiny bit too easy.

_Round 2 (2026-05-14), addressing feedback above:_

### Candidate 5D — Sum of cubes equals square of triangular number

- [x] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Tests ordinary induction on a sum identity that requires a substantive algebraic factoring step (combining $\left(\frac{k(k+1)}{2}\right)^2 + (k+1)^3$ into $\left(\frac{(k+1)(k+2)}{2}\right)^2$); harder than 5A by virtue of the algebra, even though both are ordinary induction on a sum.

```latex
\begin{problem}

\subproblem Verify that $1^3 + 2^3 + \cdots + n^3 = \left(\dfrac{n(n+1)}{2}\right)^2$ for $n = 1, 2, 3$ by direct computation.

\subproblem Prove by induction on $n$ that $1^3 + 2^3 + \cdots + n^3 = \left(\dfrac{n(n+1)}{2}\right)^2$ for every integer $n \geq 1$.

\begin{solution}
\subsolution
\begin{itemize}
\item $n = 1$: LHS $= 1^3 = 1$ and RHS $= (1 \cdot 2 / 2)^2 = 1$. $\checkmark$
\item $n = 2$: LHS $= 1 + 8 = 9$ and RHS $= (2 \cdot 3 / 2)^2 = 9$. $\checkmark$
\item $n = 3$: LHS $= 1 + 8 + 27 = 36$ and RHS $= (3 \cdot 4 / 2)^2 = 36$. $\checkmark$
\end{itemize}

\subsolution Let $P(n) := \left(\sum_{i=1}^n i^3 = \left(\frac{n(n+1)}{2}\right)^2\right)$. Proof for all $n \geq 1$ by induction.

\emph{Base case ($n = 1$).} $1^3 = 1 = \left(\frac{1 \cdot 2}{2}\right)^2$, so $P(1)$ holds.

\emph{Inductive step.} Assume $P(k)$. Compute:
\[
\sum_{i=1}^{k+1} i^3 = \sum_{i=1}^k i^3 + (k+1)^3 = \left(\frac{k(k+1)}{2}\right)^2 + (k+1)^3.
\]
Factor $(k+1)^2$:
\[
= (k+1)^2 \left[\frac{k^2}{4} + (k+1)\right] = (k+1)^2 \cdot \frac{k^2 + 4(k+1)}{4} = (k+1)^2 \cdot \frac{k^2 + 4k + 4}{4} = (k+1)^2 \cdot \frac{(k+2)^2}{4} = \left(\frac{(k+1)(k+2)}{2}\right)^2.
\]
Hence $P(k+1)$ holds, and by induction $P(n)$ holds for all $n \geq 1$. $\blacksquare$
\end{solution}

\pagebreak

\end{problem}
```

### Candidate 5E — Stamp problem (strong induction)

- [ ] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Tests strong induction on a constructive existence claim with *four* base cases, forcing students to reason about which prior case to invoke for the inductive step (the IH is applied at $n - 4$); a slightly harder strong-induction template than 5B, which had only one base case.

```latex
\begin{problem}

A post office sells two stamp denominations: $4$-cent stamps and $5$-cent stamps.

\subproblem Verify that postage of $12$, $13$, $14$, and $15$ cents can each be made using non-negative integer combinations of $4$-cent and $5$-cent stamps. Show one explicit combination for each amount.

\subproblem Prove by strong induction that every postage amount $n \geq 12$ cents can be made using $4$-cent and $5$-cent stamps.

\begin{solution}
\subsolution
\begin{itemize}
\item $12 = 4 + 4 + 4$ (three $4$s).
\item $13 = 4 + 4 + 5$ (two $4$s, one $5$).
\item $14 = 4 + 5 + 5$ (one $4$, two $5$s).
\item $15 = 5 + 5 + 5$ (three $5$s).
\end{itemize}

\subsolution Let $P(n) :=$ ``$n$ cents of postage can be made using $4$-cent and $5$-cent stamps.''

\emph{Base cases ($n = 12, 13, 14, 15$).} Verified above.

\emph{Inductive step.} Fix $n \geq 16$ and assume $P(k)$ holds for every integer $k$ with $12 \leq k < n$. Since $n \geq 16$, we have $n - 4 \geq 12$, so $P(n - 4)$ holds: $n - 4$ cents can be made using $4$-cent and $5$-cent stamps. Adding one more $4$-cent stamp yields $n$ cents, so $P(n)$ holds.

By strong induction, $P(n)$ holds for all $n \geq 12$. $\blacksquare$
\end{solution}

\pagebreak

\end{problem}
```

**Feedback for next round:**

_(empty)_

---

## Slot 6 — Inductively-defined sets, varied object types and invariants · 2 subparts · ~10 min · medium

**Original (excerpt for orientation):**

> Smallest set $S$ with base $(0,0)$ and rule $(x,y) \to (x+1, y+x+1)$. (a) Show $(3, 6) \in S$ via explicit derivation. (b) Prove by structural induction every $(x, y) \in S$ has $y = x(x+1)/2$.

### Candidate 6A — Pair set, multiplicative recursion (closed form `y = 3^{x-1}`)

- [x] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Same object type as the original (integer pairs) but the recursion is multiplicative and the closed form is exponential — distinct from the original's additive recursion and triangular formula; matches your "different invariant character" request while keeping the same complexity.

```latex
\begin{problem}

Let $S$ be the smallest set of integer pairs satisfying:
\begin{itemize}
\item \textbf{Base:} $(1, 1) \in S$.
\item \textbf{C1:} If $(x, y) \in S$, then $(x + 1,\ 3 y) \in S$.
\end{itemize}

\subproblem Show that $(4, 27) \in S$ by exhibiting an explicit derivation. List each rule application and the resulting pair.

\subproblem Prove by structural induction that every $(x, y) \in S$ satisfies $y = 3^{x - 1}$.

\begin{solution}
\subsolution Derivation of $(4, 27)$:
\begin{enumerate}
\item Base: $(1, 1) \in S$.
\item C1: $(2, 3) \in S$.
\item C1: $(3, 9) \in S$.
\item C1: $(4, 27) \in S$. $\checkmark$
\end{enumerate}
Sanity check: $3^{4 - 1} = 27$. $\checkmark$

\subsolution \textbf{Base case.} $(1, 1)$: $3^{1 - 1} = 1 = y$. $\checkmark$

\textbf{Inductive step.} Assume $(x, y) \in S$ has $y = 3^{x - 1}$. Then C1 produces $(x + 1, 3y)$. Compute:
\[
3 y = 3 \cdot 3^{x - 1} = 3^x = 3^{(x + 1) - 1}.
\]
By structural induction, every $(x, y) \in S$ satisfies $y = 3^{x - 1}$. $\blacksquare$
\end{solution}

\pagebreak

\end{problem}
```

### Candidate 6B — String set, "balanced" invariant

- [ ] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Different object type (binary strings, not integer pairs) and a *non-numerical* invariant (a counting equality between two symbols); structural-induction template applied to a string-based recursion — fits your "different type of objects" request directly.

```latex
\begin{problem}

Let $S$ be the smallest set of binary strings satisfying:
\begin{itemize}
\item \textbf{Base:} the empty string $\varepsilon \in S$.
\item \textbf{C1:} If $w \in S$, then $0 w 1 \in S$.
\end{itemize}

For a string $w$, let $|w|_0$ and $|w|_1$ denote the number of $0$s and the number of $1$s in $w$, respectively.

\subproblem Show that $000111 \in S$ by exhibiting an explicit derivation. List each rule application and the resulting string.

\subproblem Prove by structural induction that every $w \in S$ satisfies $|w|_0 = |w|_1$.

\begin{solution}
\subsolution Derivation of $000111$:
\begin{enumerate}
\item Base: $\varepsilon \in S$.
\item C1: $01 \in S$.
\item C1: $0011 \in S$.
\item C1: $000111 \in S$. $\checkmark$
\end{enumerate}
Sanity check: $|000111|_0 = 3 = |000111|_1$. $\checkmark$

\subsolution \textbf{Base case.} $w = \varepsilon$: $|\varepsilon|_0 = 0 = |\varepsilon|_1$. $\checkmark$

\textbf{Inductive step.} Assume $w \in S$ satisfies $|w|_0 = |w|_1$. Then C1 produces $w' = 0 w 1$. Counting,
\[
|w'|_0 = 1 + |w|_0, \qquad |w'|_1 = |w|_1 + 1.
\]
By the inductive hypothesis $|w|_0 = |w|_1$, so $|w'|_0 = |w|_1 + 1 = |w'|_1$.

By structural induction, every $w \in S$ satisfies $|w|_0 = |w|_1$. $\blacksquare$
\end{solution}

\pagebreak

\end{problem}
```

### Candidate 6C — Binary tree set: leaves vs. internal nodes

- [ ] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Third object type (binary trees, distinct from pairs and strings) with an invariant that relates two structural counts (leaves and internal nodes); the proof requires combining counts from two recursive subtrees rather than transforming a single one — a distinct invariant character at the same complexity.

```latex
\begin{problem}

Let $S$ be the smallest set of binary trees satisfying:
\begin{itemize}
\item \textbf{Base:} the single-node tree $\bullet$ (one leaf, no internal nodes) is in $S$.
\item \textbf{C1:} If $T_1, T_2 \in S$, then the binary tree $T = (T_1,\ T_2)$ formed by attaching $T_1$ as the left subtree and $T_2$ as the right subtree of a new root is in $S$.
\end{itemize}

For a tree $T \in S$, let $L(T)$ denote the number of leaves and $I(T)$ the number of internal (non-leaf) nodes.

\subproblem Show that the complete binary tree of depth $2$ (root, two children, four grandchildren --- a total of $4$ leaves and $3$ internal nodes) is in $S$ by exhibiting an explicit derivation. List each rule application and the resulting tree.

\subproblem Prove by structural induction that every tree $T \in S$ satisfies $L(T) = I(T) + 1$.

\begin{solution}
\subsolution Derivation of the complete binary tree of depth $2$:
\begin{enumerate}
\item Base: the single-node tree $\bullet$ is in $S$.
\item C1 with $T_1 = T_2 = \bullet$: $(\bullet, \bullet) \in S$. This is the depth-$1$ complete tree with one root (internal) and two leaves.
\item C1 with $T_1 = T_2 = (\bullet, \bullet)$: $((\bullet, \bullet), (\bullet, \bullet)) \in S$. This is the depth-$2$ complete tree --- $1$ root + $2$ depth-$1$ internal nodes = $3$ internal nodes total, and $4$ leaves at depth $2$. $\checkmark$
\end{enumerate}
Sanity check: $L = 4$, $I = 3$, and $4 = 3 + 1$. $\checkmark$

\subsolution \textbf{Base case.} $T = \bullet$: $L(T) = 1$ and $I(T) = 0$, so $L(T) = 0 + 1 = I(T) + 1$. $\checkmark$

\textbf{Inductive step.} Assume $T_1, T_2 \in S$ each satisfy the property: $L(T_1) = I(T_1) + 1$ and $L(T_2) = I(T_2) + 1$. Then C1 produces $T = (T_1, T_2)$. Compute the leaf and internal-node counts of $T$:
\begin{itemize}
\item $L(T) = L(T_1) + L(T_2)$ (leaves of $T$ are exactly the leaves of $T_1$ together with the leaves of $T_2$).
\item $I(T) = I(T_1) + I(T_2) + 1$ (internal nodes of $T$ are those of $T_1$, those of $T_2$, plus the new root).
\end{itemize}
Then
\[
L(T) = L(T_1) + L(T_2) = (I(T_1) + 1) + (I(T_2) + 1) = (I(T_1) + I(T_2) + 1) + 1 = I(T) + 1.
\]
By structural induction, every $T \in S$ satisfies $L(T) = I(T) + 1$. $\blacksquare$
\end{solution}

\pagebreak

\end{problem}
```

**Feedback for next round:**

_(empty)_

---

## Slot 7 — Bayes / two conditionally independent tests · 2 subparts · ~10 min · medium-hard

**Original (excerpt for orientation):**

> Disease prevalence $\pi = 0.1$. Test A: TPR $0.9$, FPR $0.1$. Test B: TPR $0.8$, FPR $0.2$. Tests are conditionally independent given disease status. (a) $P(D \mid A^+ \cap B^+)$. (b) $P(D \mid A^+ \cap B^-)$.

### Candidate 7A — Spam filtering with two filters

- [ ] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Same Bayes-with-conditional-independence skill and parallel "both flag" / "asymmetric outcomes" structure, with email-spam domain in place of disease testing; numerics tuned so neither posterior matches the original's $0.8$ or $0.2$.

```latex
\begin{problem}

An incoming email is spam with prior probability $\pi = 0.4$. There are two independent spam filters:
\begin{itemize}
\item Filter $A$: probability of flagging given spam is $0.9$, probability of flagging given not spam is $0.2$.
\item Filter $B$: probability of flagging given spam is $0.8$, probability of flagging given not spam is $0.1$.
\end{itemize}
Conditional on the true label (spam or not spam), the two filter results are independent. An email is run through both filters.

\subproblem Compute $P(\text{spam} \mid A^+ \cap B^+)$, the probability the email is spam given both filters flag it.

\subproblem Compute $P(\text{spam} \mid A^+ \cap B^-)$, the probability the email is spam given filter $A$ flags it but filter $B$ does not.

\begin{solution}
Let $S$ = spam ($P(S) = 0.4$, $P(\overline{S}) = 0.6$).

\subsolution
\[
P(A^+ B^+ \mid S) = 0.9 \cdot 0.8 = 0.72, \quad P(A^+ B^+ \mid \overline{S}) = 0.2 \cdot 0.1 = 0.02.
\]
\[
P(S \mid A^+ B^+) = \frac{0.72 \cdot 0.4}{0.72 \cdot 0.4 + 0.02 \cdot 0.6} = \frac{0.288}{0.300} = \frac{24}{25} = 0.96.
\]

\subsolution
\[
P(A^+ B^- \mid S) = 0.9 \cdot 0.2 = 0.18, \quad P(A^+ B^- \mid \overline{S}) = 0.2 \cdot 0.9 = 0.18.
\]
\[
P(S \mid A^+ B^-) = \frac{0.18 \cdot 0.4}{0.18 \cdot 0.4 + 0.18 \cdot 0.6} = \frac{0.072}{0.180} = \frac{2}{5} = 0.4.
\]
\end{solution}

\pagebreak

\end{problem}
```

### Candidate 7B — Manufacturing QC with two tests

- [ ] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Same skill, distinct domain (factory defects), distinct numerical regime (rare condition with $\pi = 0.05$); the second subpart asks about the asymmetric outcome where the *less* sensitive test fires alone, requiring a different intuition than the original.

```latex
\begin{problem}

A factory produces parts with defect rate $\pi = 0.05$. Each part is independently checked by two quality-control tests:
\begin{itemize}
\item Test $A$: probability of flagging given defective is $0.95$, probability of flagging given non-defective is $0.10$.
\item Test $B$: probability of flagging given defective is $0.85$, probability of flagging given non-defective is $0.05$.
\end{itemize}
Conditional on the true defect status, the two test results are independent.

\subproblem Compute $P(\text{defective} \mid A^+ \cap B^+)$, the probability a part is defective given both tests flag it.

\subproblem Compute $P(\text{defective} \mid A^- \cap B^+)$, the probability a part is defective given test $A$ does not flag but test $B$ does.

\begin{solution}
Let $D$ = defective ($P(D) = 0.05$, $P(\overline{D}) = 0.95$).

\subsolution
\[
P(A^+ B^+ \mid D) = 0.95 \cdot 0.85 = 0.8075, \quad P(A^+ B^+ \mid \overline{D}) = 0.10 \cdot 0.05 = 0.005.
\]
\[
P(D \mid A^+ B^+) = \frac{0.8075 \cdot 0.05}{0.8075 \cdot 0.05 + 0.005 \cdot 0.95} = \frac{0.040375}{0.045125} = \frac{323}{361} \approx 0.8947.
\]

\subsolution
\[
P(A^- B^+ \mid D) = 0.05 \cdot 0.85 = 0.0425, \quad P(A^- B^+ \mid \overline{D}) = 0.90 \cdot 0.05 = 0.045.
\]
\[
P(D \mid A^- B^+) = \frac{0.0425 \cdot 0.05}{0.0425 \cdot 0.05 + 0.045 \cdot 0.95} = \frac{0.002125}{0.044875} \approx 0.0474.
\]
\end{solution}

\pagebreak

\end{problem}
```

### Candidate 7C — Hiring: two interview signals

- [ ] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Same Bayes skill in a non-medical, non-engineering domain (job hiring); prior ($\pi = 0.3$) and conditionals tuned for clean fractional posteriors that differ from both the original and the other candidates.

```latex
\begin{problem}

A job candidate is qualified for a position with prior probability $\pi = 0.3$. They are evaluated by two independent interview signals:
\begin{itemize}
\item Signal $T$ (technical): probability of positive given qualified is $0.8$, probability of positive given not qualified is $0.3$.
\item Signal $C$ (cultural): probability of positive given qualified is $0.7$, probability of positive given not qualified is $0.4$.
\end{itemize}
Conditional on the candidate's true qualification status, the two signals are independent.

\subproblem Compute $P(\text{qualified} \mid T^+ \cap C^+)$.

\subproblem Compute $P(\text{qualified} \mid T^+ \cap C^-)$.

\begin{solution}
Let $Q$ = qualified ($P(Q) = 0.3$, $P(\overline{Q}) = 0.7$).

\subsolution
\[
P(T^+ C^+ \mid Q) = 0.8 \cdot 0.7 = 0.56, \quad P(T^+ C^+ \mid \overline{Q}) = 0.3 \cdot 0.4 = 0.12.
\]
\[
P(Q \mid T^+ C^+) = \frac{0.56 \cdot 0.3}{0.56 \cdot 0.3 + 0.12 \cdot 0.7} = \frac{0.168}{0.252} = \frac{2}{3} \approx 0.667.
\]

\subsolution
\[
P(T^+ C^- \mid Q) = 0.8 \cdot 0.3 = 0.24, \quad P(T^+ C^- \mid \overline{Q}) = 0.3 \cdot 0.6 = 0.18.
\]
\[
P(Q \mid T^+ C^-) = \frac{0.24 \cdot 0.3}{0.24 \cdot 0.3 + 0.18 \cdot 0.7} = \frac{0.072}{0.198} = \frac{4}{11} \approx 0.364.
\]
\end{solution}

\pagebreak

\end{problem}
```

**Feedback for next round** (consumed by Round 2):

> I like candidate 7B but I need the numbers to be simplified so that they can easily be calculated by hand without a calculator without taking a lot of time.

_Round 2 (2026-05-14), addressing feedback above:_

### Candidate 7D — Manufacturing QC, calculator-free numerics

- [x] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Same domain and structure as 7B (manufacturing QC, two conditionally independent tests, both-flag and asymmetric posteriors), with prior $\pi = 0.2$ and conditionals $\{0.8, 0.1, 0.9, 0.2\}$ chosen so all multiplications are at most two decimals and the posteriors reduce to clean fractions ($9/10$ and $1/5$); doable in $\sim 4$ minutes by hand.

```latex
\begin{problem}

A factory produces parts with defect rate $\pi = 0.2$. Each part is independently checked by two quality-control tests:
\begin{itemize}
\item Test $A$: probability of flagging given defective is $0.8$, probability of flagging given non-defective is $0.1$.
\item Test $B$: probability of flagging given defective is $0.9$, probability of flagging given non-defective is $0.2$.
\end{itemize}
Conditional on the true defect status, the two test results are independent.

\subproblem Compute $P(\text{defective} \mid A^+ \cap B^+)$, the probability a part is defective given both tests flag it.

\subproblem Compute $P(\text{defective} \mid A^- \cap B^+)$, the probability a part is defective given test $A$ does not flag but test $B$ does.

\begin{solution}
Let $D$ = defective ($P(D) = 0.2$, $P(\overline{D}) = 0.8$).

\subsolution
\[
P(A^+ B^+ \mid D) = 0.8 \cdot 0.9 = 0.72, \quad P(A^+ B^+ \mid \overline{D}) = 0.1 \cdot 0.2 = 0.02.
\]
\[
P(D \mid A^+ B^+) = \frac{0.72 \cdot 0.2}{0.72 \cdot 0.2 + 0.02 \cdot 0.8} = \frac{0.144}{0.144 + 0.016} = \frac{0.144}{0.160} = \frac{9}{10}.
\]

\subsolution
\[
P(A^- B^+ \mid D) = 0.2 \cdot 0.9 = 0.18, \quad P(A^- B^+ \mid \overline{D}) = 0.9 \cdot 0.2 = 0.18.
\]
\[
P(D \mid A^- B^+) = \frac{0.18 \cdot 0.2}{0.18 \cdot 0.2 + 0.18 \cdot 0.8} = \frac{0.036}{0.036 + 0.144} = \frac{0.036}{0.180} = \frac{1}{5}.
\]
\end{solution}

\pagebreak

\end{problem}
```

**Feedback for next round:**

_(empty)_

---

## Slot 8 — RV expectation: linearity + indicator decomposition · 2 subparts · ~12 min · hard

**Original (excerpt for orientation):**

> Roll a fair 6-sided die until you see a $1$ or $2$. (a) $T$ = final roll value; compute $\mathbb{E}[T]$ by symmetry. (b) $S$ = sum of all rolls; compute $\mathbb{E}[S]$ by linearity with random index.

### Candidate 8A — Random permutation: fixed points

- [ ] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** A canonical linearity-of-expectation + indicator-variables problem (expected number of fixed points of a random permutation), with a variance computation that requires handling pairwise indicator covariances. Hard difficulty matches the original; framing has no overlap with stopping-time problems.

```latex
\begin{problem}

A professor randomly redistributes $n$ graded exams to her $n$ students, so that each permutation of returns is equally likely. Let $X$ be the number of students who receive their own exam.

\subproblem Express $X$ as a sum of indicator random variables and use linearity of expectation to compute $\mathbb{E}[X]$.

\subproblem Compute $\mathrm{Var}(X)$. (Hint: expand $X^2$ as $\sum_i I_i^2 + \sum_{i \neq j} I_i I_j$ and compute $\mathbb{E}[I_i I_j]$ for $i \neq j$.)

\begin{solution}
\subsolution For each student $i \in \{1, \ldots, n\}$, let $I_i = 1$ if student $i$ receives their own exam, $0$ otherwise. Then $X = \sum_{i=1}^n I_i$. By symmetry, student $i$ receives a uniformly random exam, so $P(I_i = 1) = 1/n$ and $\mathbb{E}[I_i] = 1/n$. By linearity,
\[
\mathbb{E}[X] = \sum_{i=1}^n \mathbb{E}[I_i] = n \cdot \tfrac{1}{n} = 1.
\]

\subsolution Expand $X^2 = \sum_i I_i^2 + \sum_{i \neq j} I_i I_j$. Since $I_i \in \{0, 1\}$, $I_i^2 = I_i$, so $\sum_i \mathbb{E}[I_i^2] = \mathbb{E}[X] = 1$.

For $i \neq j$, $I_i I_j = 1$ iff students $i$ and $j$ both receive their own exam. The number of permutations of $n$ exams that fix both positions $i$ and $j$ is $(n - 2)!$, so
\[
P(I_i I_j = 1) = \frac{(n - 2)!}{n!} = \frac{1}{n(n - 1)}.
\]
There are $n(n - 1)$ ordered pairs $(i, j)$ with $i \neq j$, so
\[
\sum_{i \neq j} \mathbb{E}[I_i I_j] = n(n - 1) \cdot \frac{1}{n(n - 1)} = 1.
\]
Therefore $\mathbb{E}[X^2] = 1 + 1 = 2$, and
\[
\mathrm{Var}(X) = \mathbb{E}[X^2] - (\mathbb{E}[X])^2 = 2 - 1 = 1.
\]
\end{solution}

\pagebreak

\end{problem}
```

### Candidate 8B — Random graph: number of triangles

- [ ] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Linearity + indicators applied to triangles in an Erdős–Rényi random graph; tests the same technique as 8A on a more combinatorially rich object, with a Chebyshev concentration bound in part (b). Matches the original's hard difficulty.

```latex
\begin{problem}

Consider an Erd\H{o}s--R\'enyi random graph $G$ on $n$ labeled vertices, formed by including each of the $\binom{n}{2}$ possible edges independently with probability $p$. Let $X$ be the number of triangles in $G$.

\subproblem Express $X$ as a sum of indicator random variables (one for each triple of vertices) and use linearity of expectation to compute $\mathbb{E}[X]$ in closed form.

\subproblem Compute $\mathrm{Var}(X)$. (Hint: $\mathrm{Var}(X) = \sum_T \mathrm{Var}(I_T) + \sum_{T \neq T'} \mathrm{Cov}(I_T, I_{T'})$. Two triangles are independent iff they share at most one vertex (zero shared edges); they have a non-zero covariance iff they share exactly two vertices (one shared edge). Count carefully.)

\begin{solution}
\subsolution For each triple $T = \{u, v, w\}$ of distinct vertices (there are $\binom{n}{3}$ such triples), let $I_T = 1$ if all three edges of $T$ are in $G$, $0$ otherwise. Then $X = \sum_T I_T$. By independence of edges, $\mathbb{E}[I_T] = p^3$. By linearity,
\[
\mathbb{E}[X] = \binom{n}{3} \cdot p^3.
\]

\subsolution Each $\mathrm{Var}(I_T) = p^3 (1 - p^3)$, and there are $\binom{n}{3}$ such terms.

For ordered pairs of distinct triples $(T, T')$:
\begin{itemize}
\item If $T$ and $T'$ share at most one vertex, they share no edges, so $I_T$ and $I_{T'}$ are independent and $\mathrm{Cov}(I_T, I_{T'}) = 0$.
\item If $T$ and $T'$ share exactly two vertices (one edge), they have $3 + 3 - 1 = 5$ distinct edges combined. So $\mathbb{E}[I_T I_{T'}] = p^5$, and $\mathrm{Cov}(I_T, I_{T'}) = p^5 - p^3 \cdot p^3 = p^5 - p^6 = p^5(1 - p)$.
\end{itemize}
The number of ordered pairs of distinct triples sharing exactly two vertices: choose the shared edge (any pair of vertices, $\binom{n}{2}$ ways), then choose the third vertex of $T$ (any of the $n - 2$ remaining vertices), then choose the third vertex of $T'$ (any of the $n - 3$ remaining). This gives $\binom{n}{2}(n-2)(n-3)$ ordered pairs.

Putting it together:
\[
\mathrm{Var}(X) = \binom{n}{3} \cdot p^3(1 - p^3) + \binom{n}{2}(n-2)(n-3) \cdot p^5 (1 - p).
\]
\end{solution}

\pagebreak

\end{problem}
```

### Candidate 8C — Balls in bins: empty bins

- [ ] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Linearity + indicators on a balls-and-bins problem (expected number of empty bins). Hard difficulty, with a part (b) that requires combining indicators across bins to compute the variance of empty bins.

```latex
\begin{problem}

Suppose $r$ distinguishable balls are thrown independently and uniformly at random into $b$ distinguishable bins. Let $X$ be the number of empty bins (bins receiving zero balls).

\subproblem Express $X$ as a sum of indicator random variables (one for each bin) and use linearity of expectation to compute $\mathbb{E}[X]$ in closed form.

\subproblem Compute $\mathrm{Var}(X)$. (Hint: for two distinct bins $i \neq j$, compute $P(\text{bins } i \text{ and } j \text{ are both empty})$.)

\begin{solution}
\subsolution For each bin $i \in \{1, \ldots, b\}$, let $I_i = 1$ if bin $i$ is empty, $0$ otherwise. Then $X = \sum_{i=1}^b I_i$. The probability that any single ball avoids bin $i$ is $(b - 1)/b$, and the $r$ balls are independent, so
\[
P(I_i = 1) = \left(\frac{b - 1}{b}\right)^r, \qquad \mathbb{E}[I_i] = \left(\frac{b - 1}{b}\right)^r.
\]
By linearity,
\[
\mathbb{E}[X] = b \cdot \left(\frac{b - 1}{b}\right)^r.
\]

\subsolution Compute $\mathbb{E}[X^2] = \sum_i \mathbb{E}[I_i^2] + \sum_{i \neq j} \mathbb{E}[I_i I_j]$.

Since $I_i \in \{0, 1\}$, $I_i^2 = I_i$, so $\sum_i \mathbb{E}[I_i^2] = \mathbb{E}[X] = b \left(\frac{b-1}{b}\right)^r$.

For $i \neq j$, $I_i I_j = 1$ iff bins $i$ and $j$ are both empty. The probability that any single ball avoids both bins is $(b - 2)/b$, and the $r$ balls are independent, so
\[
\mathbb{E}[I_i I_j] = \left(\frac{b - 2}{b}\right)^r.
\]
There are $b(b - 1)$ ordered pairs with $i \neq j$, so
\[
\sum_{i \neq j} \mathbb{E}[I_i I_j] = b(b - 1) \left(\frac{b - 2}{b}\right)^r.
\]
Combine:
\[
\mathbb{E}[X^2] = b \left(\frac{b-1}{b}\right)^r + b(b - 1) \left(\frac{b - 2}{b}\right)^r.
\]
Therefore
\[
\mathrm{Var}(X) = \mathbb{E}[X^2] - (\mathbb{E}[X])^2 = b\!\left(\frac{b-1}{b}\right)^r + b(b - 1)\!\left(\frac{b - 2}{b}\right)^r - b^2 \!\left(\frac{b-1}{b}\right)^{2r}.
\]
\end{solution}

\pagebreak

\end{problem}
```

**Feedback for next round** (consumed by Round 2):

> These ones aren't quite right. I'd like something that is closer to the original problem than these. Let's try a less restrictive set of options — not just linearity. Some expectation/random variable problems of similar difficulty to the original one.

_Round 2 (2026-05-14), addressing feedback above:_

### Candidate 8D — Die-stopping with a different stop set

- [x] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Closest match to the original — same template (stop-on-condition, symmetry argument for $\mathbb{E}[T]$, linearity-with-random-index for $\mathbb{E}[S]$); uses an $8$-sided die and stop set $\{1, 8\}$ so the numerical answers ($\mathbb{E}[T] = 4.5$, $\mathbb{E}[S] = 18$) differ from the original's $1.5$ and $10.5$.

```latex
\begin{problem}

You roll a fair eight-sided die (with faces $1, 2, \ldots, 8$) repeatedly until you see a value in $\{1, 8\}$. Let $N$ be the number of rolls needed. Since the number of rolls is a geometric random variable with success probability $1/4$, $\mathbb{E}[N] = 4$. You may use this fact without proof.

\subproblem Let $T$ be the value of the \emph{final} roll (so $T \in \{1, 8\}$). Compute $\mathbb{E}[T]$.

\subproblem Let $S$ be the sum of the values of all rolls (including the final roll that produced the value in $\{1, 8\}$). Compute $\mathbb{E}[S]$.

\begin{solution}
\subsolution By symmetry, at each roll the values $1$ and $8$ are equally likely (each with probability $1/8$, independently of past rolls). Hence the first of $\{1, 8\}$ to appear is equally likely to be either, so
\[
\mathbb{E}[T] = \tfrac{1}{2}(1 + 8) = \tfrac{9}{2} = 4.5.
\]

\subsolution Decompose $S = (\text{sum of first } N - 1 \text{ rolls}) + T$. The first $N - 1$ rolls are conditionally uniform on $\{2, 3, 4, 5, 6, 7\}$ (six values, since they were not in $\{1, 8\}$), with conditional mean
\[
\frac{2 + 3 + 4 + 5 + 6 + 7}{6} = \frac{27}{6} = 4.5.
\]
By linearity of expectation, using $\mathbb{E}[N] = 4$,
\[
\mathbb{E}[\text{sum of first } N-1] = (\mathbb{E}[N] - 1) \cdot 4.5 = 3 \cdot 4.5 = 13.5.
\]
Therefore
\[
\mathbb{E}[S] = 13.5 + 4.5 = 18.
\]
\end{solution}

\pagebreak

\end{problem}
```

### Candidate 8E — Expected wait for two consecutive heads (law of total expectation)

- [ ] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** A different RV/expectation flavor — uses the *law of total expectation* by conditioning on the outcomes of the first one or two flips and solving a self-referential equation for $\mathbb{E}[N]$; same hard-difficulty band as the original, but exercises a distinct technique (conditional expectation + algebraic recursion) than stopping-with-symmetry.

```latex
\begin{problem}

A coin with $P(\text{heads}) = 2/3$ is flipped repeatedly. Let $N$ be the number of flips until the first occurrence of two consecutive heads.

\subproblem Set up an equation for $\mathbb{E}[N]$ using the law of total expectation, conditioning on the outcome(s) of the first one or two flips. Carefully account for the cases: first flip tails; first flip heads followed by tails; first flip heads followed by heads.

\subproblem Solve the equation in part (a) to find $\mathbb{E}[N]$.

\begin{solution}
\subsolution Let $E = \mathbb{E}[N]$. Condition on the first one or two flips:
\begin{itemize}
\item \textbf{First flip is tails} (probability $1/3$). The flip is ``wasted''; the experiment effectively restarts from scratch. So $\mathbb{E}[N \mid \text{T first}] = 1 + E$.
\item \textbf{First flip is heads, second flip is heads} (probability $\frac{2}{3} \cdot \frac{2}{3} = \frac{4}{9}$). Two consecutive heads on flips $1$ and $2$, so $N = 2$.
\item \textbf{First flip is heads, second flip is tails} (probability $\frac{2}{3} \cdot \frac{1}{3} = \frac{2}{9}$). Two flips wasted; experiment restarts. So $\mathbb{E}[N \mid \text{HT prefix}] = 2 + E$.
\end{itemize}
By the law of total expectation:
\[
E = \tfrac{1}{3}(1 + E) + \tfrac{4}{9}(2) + \tfrac{2}{9}(2 + E).
\]

\subsolution Expand:
\[
E = \tfrac{1}{3} + \tfrac{1}{3}E + \tfrac{8}{9} + \tfrac{4}{9} + \tfrac{2}{9}E = \tfrac{3 + 8 + 4}{9} + \tfrac{3 + 2}{9}E = \tfrac{15}{9} + \tfrac{5}{9}E = \tfrac{5}{3} + \tfrac{5}{9}E.
\]
Subtract $\tfrac{5}{9}E$ from both sides:
\[
E - \tfrac{5}{9}E = \tfrac{5}{3} \quad\Longleftrightarrow\quad \tfrac{4}{9}E = \tfrac{5}{3} \quad\Longleftrightarrow\quad E = \tfrac{5}{3} \cdot \tfrac{9}{4} = \tfrac{15}{4}.
\]
So $\mathbb{E}[N] = 15/4 = 3.75$.
\end{solution}

\pagebreak

\end{problem}
```

**Feedback for next round:**

_(empty)_

---

## Slot 9 — Graph theory: coloring, connectivity, or isomorphism · 2 subparts · ~8 min · medium

**Original (excerpt for orientation):**

> Four library events with overlapping time windows. (a) Build the conflict graph. (b) Find $\chi(G)$ with lower and upper bounds.

### Candidate 9A — Coloring: chromatic number of `C₅` plus one chord

- [ ] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Same coloring skill as the original (chromatic number with lower and upper bounds), but on an explicitly described abstract graph rather than a real-world conflict scenario; same medium difficulty and 2-subpart structure.

```latex
\begin{problem}

Let $G$ be the graph on vertex set $V = \{v_1, v_2, v_3, v_4, v_5\}$ with edge set
\[
E(G) = \{\{v_1, v_2\}, \{v_2, v_3\}, \{v_3, v_4\}, \{v_4, v_5\}, \{v_5, v_1\}, \{v_1, v_3\}\}.
\]
(Geometrically: $G$ is the $5$-cycle $v_1 v_2 v_3 v_4 v_5$ together with the extra "chord" edge $\{v_1, v_3\}$.)

\subproblem Determine $\chi(G)$, the chromatic number of $G$. Justify the lower bound by exhibiting a clique.

\subproblem Justify the upper bound for $\chi(G)$ by exhibiting an explicit proper coloring of $G$ using $\chi(G)$ colors.

\begin{solution}
\subsolution $\chi(G) = 3$.

\emph{Lower bound:} The vertices $v_1, v_2, v_3$ form a triangle: $\{v_1, v_2\}, \{v_2, v_3\}, \{v_1, v_3\}$ are all in $E(G)$. A triangle requires at least $3$ colors, so $\chi(G) \geq 3$.

\subsolution The $3$-coloring
\[
v_1 \mapsto 1, \quad v_2 \mapsto 2, \quad v_3 \mapsto 3, \quad v_4 \mapsto 1, \quad v_5 \mapsto 2
\]
is proper. Check each edge:
\begin{itemize}
\item $\{v_1, v_2\}$: $1 \neq 2$. $\checkmark$
\item $\{v_2, v_3\}$: $2 \neq 3$. $\checkmark$
\item $\{v_3, v_4\}$: $3 \neq 1$. $\checkmark$
\item $\{v_4, v_5\}$: $1 \neq 2$. $\checkmark$
\item $\{v_5, v_1\}$: $2 \neq 1$. $\checkmark$
\item $\{v_1, v_3\}$: $1 \neq 3$. $\checkmark$
\end{itemize}
So $\chi(G) \leq 3$, combined with the lower bound, $\chi(G) = 3$.
\end{solution}

\pagebreak

\end{problem}
```

### Candidate 9B — Connectivity: count connected components from an adjacency description

- [ ] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Tests *connectivity* analysis (rather than coloring) — students must trace connected components from an explicit edge list and either find a path between two vertices or prove none exists; same medium difficulty and 2-subpart shape, but a distinct skill from the original.

```latex
\begin{problem}

Let $G$ be the graph on vertex set $V = \{1, 2, 3, 4, 5, 6, 7\}$ with edge set
\[
E(G) = \{\{1, 2\}, \{2, 3\}, \{3, 1\}, \{4, 5\}, \{5, 6\}, \{6, 7\}\}.
\]

\subproblem Determine the number of connected components of $G$. List the vertex set of each component.

\subproblem For the pair of vertices $1$ and $4$: either give an explicit path in $G$ from $1$ to $4$ (listing vertices in order), or prove no such path exists.

\begin{solution}
\subsolution Trace the connected components by following edges.

Starting from $1$: $1 - 2 - 3$, with $\{1, 2\}, \{2, 3\}, \{3, 1\}$ all in $E(G)$. No edges leave $\{1, 2, 3\}$ to any other vertex. So one component is $\{1, 2, 3\}$.

Starting from $4$: $4 - 5 - 6 - 7$, with $\{4, 5\}, \{5, 6\}, \{6, 7\}$ all in $E(G)$. No edges leave $\{4, 5, 6, 7\}$ to any other vertex. So another component is $\{4, 5, 6, 7\}$.

Together these account for all $7$ vertices, so $G$ has $\boxed{2}$ connected components: $\{1, 2, 3\}$ and $\{4, 5, 6, 7\}$.

\subsolution \emph{No path exists.} Vertex $1$ lies in component $\{1, 2, 3\}$ (from part (a)), and vertex $4$ lies in component $\{4, 5, 6, 7\}$. Since these are distinct connected components and a path in a graph stays within a single component, no path from $1$ to $4$ exists.
\end{solution}

\pagebreak

\end{problem}
```

### Candidate 9C — Isomorphism: are two graphs isomorphic?

- [ ] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Tests *isomorphism* analysis — either exhibit an explicit vertex bijection preserving adjacency, or identify a distinguishing graph invariant; medium difficulty matches the original, and the skill is structurally distinct from coloring or connectivity questions.

```latex
\begin{problem}

Consider the following two graphs on $5$ vertices each.

$G_1$ has vertex set $\{a, b, c, d, e\}$ and edge set
\[
E(G_1) = \{\{a, b\}, \{b, c\}, \{c, d\}, \{d, e\}, \{e, a\}\}
\]
(i.e., $G_1$ is the $5$-cycle $C_5$).

$G_2$ has vertex set $\{1, 2, 3, 4, 5\}$ and edge set
\[
E(G_2) = \{\{1, 2\}, \{1, 3\}, \{1, 4\}, \{1, 5\}\}
\]
(i.e., $G_2$ is the star $K_{1,4}$).

\subproblem Compute the degree sequence (sorted multiset of vertex degrees) of $G_1$ and of $G_2$.

\subproblem Determine whether $G_1$ and $G_2$ are isomorphic. If yes, exhibit an explicit vertex bijection that preserves adjacency. If no, identify a graph invariant that differs between $G_1$ and $G_2$, and use it to justify that no isomorphism can exist.

\begin{solution}
\subsolution
$G_1$: each vertex of the $5$-cycle has exactly $2$ neighbors. Degree sequence: $(2, 2, 2, 2, 2)$.

$G_2$: vertex $1$ has $4$ neighbors; vertices $2, 3, 4, 5$ each have $1$ neighbor (only vertex $1$). Degree sequence: $(4, 1, 1, 1, 1)$.

\subsolution $G_1$ and $G_2$ are \emph{not isomorphic}. The degree sequence is a graph invariant (preserved under any isomorphism, since an isomorphism preserves adjacency and hence vertex degrees). The degree sequences from part (a) differ:
\[
(2, 2, 2, 2, 2) \neq (4, 1, 1, 1, 1).
\]
Hence no bijection $\varphi: V(G_1) \to V(G_2)$ can preserve adjacency, so $G_1 \not\cong G_2$.
\end{solution}

\pagebreak

\end{problem}
```

**Feedback for next round** (consumed by Round 2):

> I think we need to try again here. How about we try a problem where they have to identify the connected components and draw the underlying DAG? And maybe identify the minimum number of edges to make the graph strongly connected?

_Round 2 (2026-05-14), addressing feedback above:_

### Candidate 9D — Strongly connected components, condensation DAG, edge augmentation

- [x] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Implements your suggested framing — students identify the strongly connected components, build the condensation DAG, then use the source/sink count to determine the minimum number of edges needed to make the graph strongly connected. Same medium difficulty band and 2-subpart shape as the original, but in a directed-graph setting that exercises distinct skills (SCC analysis + DAG manipulation + the $\max(\#\text{sources}, \#\text{sinks})$ result for strongly-connected augmentation).

```latex
\begin{problem}

Consider the directed graph $G$ on vertex set $V = \{1, 2, 3, 4, 5, 6, 7\}$ with edge set
\[
E(G) = \{(1, 3),\ (2, 3),\ (3, 4),\ (4, 5),\ (5, 4),\ (4, 6),\ (4, 7)\}.
\]
(So $(u, v) \in E$ means there is a directed edge from $u$ to $v$.)

\subproblem Identify the strongly connected components (SCCs) of $G$. List each SCC as a set of vertices, and describe the \emph{condensation DAG} of $G$ --- the directed acyclic graph obtained by collapsing each SCC of $G$ to a single super-node, with an edge from super-node $X$ to super-node $Y$ whenever some edge of $G$ goes from a vertex in $X$ to a vertex in $Y$ (with $X \neq Y$).

\subproblem Determine the minimum number of additional directed edges that must be added to $G$ to make it strongly connected, and exhibit one valid set of additions. Justify the minimum using the structure of the condensation DAG. (Hint: count sources and sinks of the condensation; when the condensation has at least two vertices, the answer is $\max(\#\text{sources}, \#\text{sinks})$.)

\begin{solution}
\subsolution Trace cycles in $G$: the only cycle is $4 \to 5 \to 4$, giving an SCC $\{4, 5\}$. Vertices $1$, $2$, $3$, $6$, $7$ each have no return path and are singleton SCCs.

SCCs: $\{1\},\ \{2\},\ \{3\},\ \{4, 5\},\ \{6\},\ \{7\}$ ($6$ in total).

Condensation DAG: project each edge of $G$ onto its SCC endpoints (skipping edges internal to an SCC):
\begin{itemize}
\item $(1, 3) \rightsquigarrow \{1\} \to \{3\}$.
\item $(2, 3) \rightsquigarrow \{2\} \to \{3\}$.
\item $(3, 4) \rightsquigarrow \{3\} \to \{4, 5\}$.
\item $(4, 6) \rightsquigarrow \{4, 5\} \to \{6\}$.
\item $(4, 7) \rightsquigarrow \{4, 5\} \to \{7\}$.
\item $(4, 5)$ and $(5, 4)$ are internal to $\{4, 5\}$ --- they do not appear in the condensation.
\end{itemize}
So the condensation DAG has the $5$ edges
\[
\{1\} \to \{3\}, \quad \{2\} \to \{3\}, \quad \{3\} \to \{4, 5\}, \quad \{4, 5\} \to \{6\}, \quad \{4, 5\} \to \{7\}.
\]

\subsolution In the condensation DAG:
\begin{itemize}
\item \emph{Sources} (no incoming edges): $\{1\}$ and $\{2\}$. So $\#\text{sources} = 2$.
\item \emph{Sinks} (no outgoing edges): $\{6\}$ and $\{7\}$. So $\#\text{sinks} = 2$.
\end{itemize}
By the standard result, the minimum number of edges to add is $\max(2, 2) = 2$.

\emph{One valid set of $2$ additions:} the edges $(6, 1)$ and $(7, 2)$ (in the original graph $G$). Verify the augmented graph is strongly connected:
\begin{itemize}
\item Cycle $1 \to 3 \to 4 \to 6 \to 1$ exists, so $\{1, 3, 4, 5, 6\}$ are mutually reachable.
\item Cycle $2 \to 3 \to 4 \to 7 \to 2$ exists, so $\{2, 3, 4, 5, 7\}$ are mutually reachable.
\item These two cycles share vertex $3$ (and $4, 5$), so all $7$ vertices lie in one big SCC.
\end{itemize}

\emph{Lower bound argument:} every source SCC must gain at least one incoming edge from outside (else it remains a source after augmentation), and every sink SCC must gain at least one outgoing edge. By a pairing argument (each added edge can serve at most one source and one sink), at least $\max(\#\text{sources}, \#\text{sinks})$ edges are necessary. $\blacksquare$
\end{solution}

\pagebreak

\end{problem}
```

**Feedback for next round:**

_(empty)_

---

## Slot 10 — Greedy MST: counterexample + fix · 3 subparts · ~12 min · medium-hard

**Original (excerpt for orientation):**

> Tom's algorithm: for $n - 1$ steps, add the edge of minimum weight not already added. (a) Graph on which it succeeds. (b) Graph on which it fails (output is not a spanning tree). (c) One-line modification that makes it correct, and which standard MST algorithm does it become?

### Candidate 10A — Greedy nearest-neighbor (Prim-like) forgetting connectivity

- [ ] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Same skills (success / failure construction + named fix), but the broken algorithm and the fix differ from the original — failure mode is "stuck at starting vertex" rather than "builds a cycle," and the fix produces Prim's rather than Kruskal's.

```latex
\begin{problem}

Student Alex proposes the following algorithm for finding a minimum-weight spanning tree (MST) on a connected weighted graph $G$ with $n$ vertices: \emph{Pick an arbitrary starting vertex $v_0$ and add it to the tree. Then for $n - 1$ steps, add the edge of minimum weight among all edges incident to $v_0$ (and not already added).}

\subproblem Draw a connected weighted graph on $4$ vertices with $5$ edges, and choose a starting vertex $v_0$, on which Alex's algorithm successfully produces an MST. Specify the edge weights, the chosen $v_0$, and report the total MST weight.

\subproblem Draw a connected weighted graph on $4$ vertices, and choose a starting vertex $v_0$, on which Alex's algorithm fails. Specify the weights, the chosen $v_0$, and explain in $1$--$2$ sentences why the output is not a spanning tree.

\subproblem Suggest a one-line modification to Alex's algorithm that would make it correct. Which well-known MST algorithm does it become?

\begin{solution}
\subsolution Take $V = \{A, B, C, D\}$ with $v_0 = A$ and edges:
\[
AB = 1, \quad AC = 2, \quad AD = 3, \quad BC = 10, \quad CD = 20.
\]
Edges incident to $A$: $AB(1), AC(2), AD(3)$. Alex picks the three lightest such edges: $AB, AC, AD$. The result is a star centered at $A$, a spanning tree of weight $1 + 2 + 3 = 6$. This is the MST (any other spanning tree includes an edge of weight $\geq 10$).

\subsolution Take $V = \{A, B, C, D\}$ with $v_0 = A$ and edges:
\[
AB = 1, \quad AC = 2, \quad BC = 3, \quad CD = 4.
\]
The graph is connected: $A$--$B$, $A$--$C$, $C$--$D$. The edges incident to $A$ are only $AB$ and $AC$, so Alex can pick at most $2$ edges, never $n - 1 = 3$. The output covers only $\{A, B, C\}$ and never reaches $D$ — not a spanning tree.

\subsolution \emph{Modified algorithm:} For $n - 1$ steps, add the edge of minimum weight among all edges with exactly one endpoint in the current tree. This is \textbf{Prim's algorithm}. The growth restriction guarantees a new vertex is added every step, so after $n - 1$ steps the tree spans all $n$ vertices.
\end{solution}

\pagebreak

\end{problem}
```

### Candidate 10B — Reverse-delete without connectivity check

- [ ] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Same skills via a constructive algorithm running in the *opposite* direction (remove heaviest edges); the failure mode is graph disconnection and the fix produces the reverse-delete algorithm; substantially different framing from the original.

```latex
\begin{problem}

Student Bea proposes the following algorithm for finding a minimum-weight spanning tree (MST) on a connected weighted graph $G$ with $n$ vertices and $m$ edges: \emph{Repeat $m - (n - 1)$ times: remove the edge of maximum weight among the edges still present.}

\subproblem Draw a connected weighted graph on $4$ vertices with $5$ edges on which Bea's algorithm successfully produces an MST. Specify the edge weights and report the total MST weight.

\subproblem Draw a connected weighted graph on $4$ vertices with $5$ edges on which Bea's algorithm fails. Specify the weights and explain in $1$--$2$ sentences why the output is not a spanning tree.

\subproblem Suggest a one-line modification to Bea's algorithm that would make it correct. Which well-known MST algorithm does it become?

\begin{solution}
\subsolution Take $V = \{A, B, C, D\}$ and edges:
\[
AB = 1, \quad BC = 2, \quad CD = 3, \quad AD = 10, \quad AC = 20.
\]
$m = 5$, $n = 4$, so Bea removes $2$ edges. Sorted (descending): $AC(20), AD(10), CD(3), BC(2), AB(1)$. Bea removes $AC$ then $AD$, leaving $\{AB, BC, CD\}$, the path $A - B - C - D$, a spanning tree of weight $6$ (the MST).

\subsolution Take $V = \{A, B, C, D\}$ and edges:
\[
AB = 1, \quad BC = 2, \quad AC = 3, \quad AD = 4, \quad BD = 5.
\]
Bea removes $2$ edges. Sorted (descending): $BD(5), AD(4), AC(3), BC(2), AB(1)$. Bea removes $BD$, then $AD$. Remaining: $\{AB, BC, AC\}$ — a triangle on $\{A, B, C\}$ that does not include $D$. Vertex $D$ is now isolated — not a spanning tree.

\subsolution \emph{Modified algorithm:} Repeat $m - (n - 1)$ times: remove the edge of maximum weight \emph{among edges whose removal does not disconnect the graph}. This is the \textbf{reverse-delete algorithm}. The disconnection check guarantees the remaining edge set always spans the vertex set.
\end{solution}

\pagebreak

\end{problem}
```

### Candidate 10C — Vertex-centric greedy (Borůvka-flavored)

- [ ] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Same skills with a *vertex-centric* broken greedy (each vertex picks its own cheapest incident edge) — the failure mode is leftover disconnected components, and the fix is Borůvka's algorithm; entirely distinct framing, broken algorithm, and named fix from the original.

```latex
\begin{problem}

Student Carl proposes the following algorithm for finding a minimum-weight spanning tree (MST) on a connected weighted graph $G$ with $n$ vertices: \emph{For each vertex $v$, find the edge of minimum weight incident to $v$, and add it to the tree (eliminating duplicates). Stop after one pass.}

\subproblem Draw a connected weighted graph on $4$ vertices with $5$ edges on which Carl's algorithm successfully produces an MST. Specify the edge weights and report the total MST weight. (You may interpret "stop after one pass; if the result has fewer than $n - 1$ edges, add the cheapest cross-component edge to bridge components" as a reasonable single-pass extension.)

\subproblem Draw a connected weighted graph on $4$ vertices on which Carl's strict one-pass algorithm fails. Specify the weights and explain in $1$--$2$ sentences why the output is not a spanning tree.

\subproblem Suggest a one-line modification to Carl's algorithm that would make it correct. Which well-known MST algorithm does it become?

\begin{solution}
\subsolution Take $V = \{A, B, C, D\}$ with edges:
\[
AB = 1, \quad CD = 2, \quad BC = 3, \quad AD = 10, \quad AC = 20.
\]
Cheapest edge incident to each vertex: $A \to AB(1)$, $B \to AB(1)$, $C \to CD(2)$, $D \to CD(2)$. After eliminating duplicates: $\{AB, CD\}$. With the bridging extension, add the cheapest cross-component edge $BC(3)$. Result: $\{AB, CD, BC\}$, total weight $6$ (the MST).

\subsolution Take $V = \{A, B, C, D\}$ with edges:
\[
AB = 1, \quad CD = 2, \quad AC = 100, \quad BD = 101, \quad BC = 102.
\]
Cheapest incident edges: $A \to AB(1)$, $B \to AB(1)$, $C \to CD(2)$, $D \to CD(2)$. After deduplication, Carl outputs $\{AB, CD\}$ — only $2$ edges, while a spanning tree needs $n - 1 = 3$. The components $\{A, B\}$ and $\{C, D\}$ are not connected, so the output is not a spanning tree.

\subsolution \emph{Modified algorithm:} Repeat until only one component remains: in each pass, for every connected component $C$ of the current forest, find the cheapest edge with exactly one endpoint in $C$ and add all such edges (eliminating duplicates). This is \textbf{Borůvka's algorithm}. Each pass at least halves the number of components, so $O(\log n)$ passes suffice to span the graph.
\end{solution}

\pagebreak

\end{problem}
```

**Feedback for next round** (consumed by Round 2):

> I like candidate 10A with this variation: Let's have Alex's algorithm be "Pick the minimum weight edge incident to the vertex that was just added that does not create a cycle". I bet you can think of a better way to state that. It's a different issue with Prim's — it considers only the last added vertex rather than the whole frontier.

_Round 2 (2026-05-14), addressing feedback above:_

### Candidate 10D — Greedy "current vertex only" (last-vertex Prim variant)

- [x] **Keep** — use this in the make-up
- [ ] **Drop** — avoid this framing in future rounds

**Suitability:** Implements your specified variant — Alex extends from the *most recently added* vertex only, not the whole frontier; the failure mode is that this vertex may run out of usable edges (no edge to a non-tree vertex) even when other tree vertices have such edges; the fix is "consider the whole frontier," which yields Prim's algorithm. Same 3-subpart structure and difficulty as the original.

```latex
\begin{problem}

Student Alex proposes the following algorithm for finding a minimum-weight spanning tree (MST) on a connected weighted graph $G$ with $n$ vertices: \emph{Pick a starting vertex $v_0$ and add it to the tree. Maintain a ``current vertex'' $u$, initially set to $v_0$. Repeat $n - 1$ times: among edges incident to $u$ whose other endpoint is not yet in the tree, add the one of minimum weight; then update $u$ to be that newly added vertex.} (Alex only ever considers edges leaving the most recently added vertex, not edges leaving other tree vertices.)

\subproblem Draw a connected weighted graph on $4$ vertices with $5$ edges, and choose a starting vertex $v_0$, on which Alex's algorithm successfully produces an MST. Specify the edge weights, the chosen $v_0$, and report the total MST weight.

\subproblem Draw a connected weighted graph on $4$ vertices, and choose a starting vertex $v_0$, on which Alex's algorithm fails --- either the algorithm cannot complete $n - 1$ steps (the current vertex runs out of usable edges) or the set of $n - 1$ edges produced is not a minimum-weight spanning tree. Specify the weights, the chosen $v_0$, and explain in $1$--$2$ sentences exactly why the algorithm fails.

\subproblem Suggest a one-line modification to Alex's algorithm that would make it correct (i.e., always produce an MST on connected weighted graphs). Which well-known MST algorithm does it become?

\begin{solution}
\subsolution Take $V = \{A, B, C, D\}$ with $v_0 = A$ and edges:
\[
AB = 1, \quad BC = 2, \quad CD = 3, \quad AD = 10, \quad AC = 20.
\]
Trace Alex's algorithm starting at $A$:
\begin{itemize}
\item $u = A$. Edges from $A$ to non-tree vertices: $AB(1), AC(20), AD(10)$. Cheapest: $AB$. Add. $u \leftarrow B$.
\item $u = B$. Edges from $B$ to non-tree vertices ($\{C, D\}$): $BC(2)$ only. Add. $u \leftarrow C$.
\item $u = C$. Edges from $C$ to non-tree vertices ($\{D\}$): $CD(3)$ only. Add. Done.
\end{itemize}
Output: $\{AB, BC, CD\}$, the path $A - B - C - D$, total weight $6$ --- the MST (any other spanning tree includes an edge of weight $\geq 10$).

\subsolution Take $V = \{A, B, C, D\}$ with $v_0 = A$ and edges:
\[
AB = 1, \quad AC = 2, \quad AD = 3, \quad BC = 100.
\]
The graph is connected (everything reaches everything else through $A$). Trace Alex's algorithm:
\begin{itemize}
\item $u = A$. Cheapest edge from $A$ to a non-tree vertex: $AB(1)$. Add. $u \leftarrow B$.
\item $u = B$. Edges from $B$ to non-tree vertices ($\{C, D\}$): $BC(100)$ only. (No edge $BD$ exists.) Add. $u \leftarrow C$.
\item $u = C$. Edges from $C$ to non-tree vertices ($\{D\}$): \emph{none} (no edge $CD$ exists). Algorithm cannot proceed.
\end{itemize}
The algorithm halts after $2$ edges and never reaches $D$ --- not a spanning tree. The issue: from $C$, no edge to $D$ exists, but $A$ (already in the tree) has the edge $AD(3)$ available --- Alex's algorithm refuses to use it because $A$ is no longer the current vertex.

\subsolution \emph{Modified algorithm:} For $n - 1$ steps, add the edge of minimum weight among all edges with exactly one endpoint anywhere in the current tree (the cheapest edge across the whole frontier, not just the last-added vertex). This is \textbf{Prim's algorithm}. Considering the whole frontier guarantees that any reachable non-tree vertex remains accessible through some tree vertex, so the tree always grows and after $n - 1$ steps spans all $n$ vertices.
\end{solution}

\pagebreak

\end{problem}
```

**Feedback for next round:**

_(empty)_

---