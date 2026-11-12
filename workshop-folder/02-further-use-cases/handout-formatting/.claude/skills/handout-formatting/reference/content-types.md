# Content types — mapping source material to the house style

A handout is a mix of content types. Identify each block in the source, then
render it with the matching environment from the two style packages. The body
is written once for all audiences; answers and asides are *gated*, not removed.

## Document skeleton

```latex
\documentclass[11pt]{article}
\usepackage{housestyle}
\usepackage[]{handout}        % []=student, [key]=answer key, [teacher]=key+notes
\hypersetup{pdftitle={<Subject> -- <Kind> <N>}}   % set pdflang too if not English
\begin{document}
\handouttitle{<Subject>}{<Kind, e.g. Worksheet 1>}{<date or blank>}
\calloutbox{Today's Goals}{%
  \begin{itemize}[leftmargin=*]
    \item <3-5 goals inferred from the content>
  \end{itemize}}
% ... content blocks ...
\end{document}
```

Group related blocks under `\section{...}` headings. Use `\subsection{...}` for
finer structure. Real sectioning commands matter for accessibility.

## Prose and reading passages

Plain expository text is just text. For a passage students read and work from,
box it so it reads as a unit:

```latex
\begin{passage}
<the reading, with accents and punctuation as themselves>
\end{passage}
```

## Numbered exercises and a one-source answer key

Each task is an `exercise` with optional blank work-space (a bare length). Its
answer goes in `solution` — hidden for students, a ruled box labelled
"Solution." for key/teacher.

```latex
\begin{enumerate}[leftmargin=*, label=\numbox{\arabic*}]
\item
  \begin{exercise}[4cm]
    <the prompt>
  \end{exercise}
  \begin{solution}
    <the worked answer>
  \end{solution}
\end{enumerate}
```

Size the work-space (`[3cm]`–`[7cm]`, or `[\vfill]`) to how much room the task
needs. In key/teacher builds the space collapses automatically.

The `exercise` environment guards page breaks with `needspace`: a problem will
not start in the last sliver of a page, so breaks fall *between* problems rather
than stranding a prompt from its work-space or its solution. (This means
work-space-heavy student handouts may run an extra page — that is the intended
trade.) For finer control, drop a `\newpage` between sections, or wrap a block
you want kept whole in its own `\needspace{<len>}`.

For inline answers (fill-in-the-blank, common in language drills) use `\fitb`:

```latex
El niño \fitb[2cm]{está} en el café.   % blank for students, "está" for the key
```

Use `\studentonly{...}`, `\keyonly{...}`, `\teacheronly{...}` for any other
inline content that belongs to only one audience.

## Teacher notes

Pedagogical asides — what to emphasize, a common error to flag — go in `note`,
shown only in the teacher build:

```latex
\begin{note}Remind students that \emph{estar} marks location, not \emph{ser}.\end{note}
```

## Messy tables (vocabulary, conjugations, data)

Tables are where extraction hurts most: `pdftotext` and pasted content arrive
as ragged whitespace with merged or split columns. Rebuild them deliberately.

- **Vocabulary / glossary** (two columns, term + meaning) — use the ready-made
  environment:

  ```latex
  \begin{vocabtable}
    \vocabentry{la palabra}{the word}
    \vocabentry{el café}{coffee; café}
  \end{vocabtable}
  ```

- **Grammar / conjugation / data tables** (more columns) — use `tabular` with
  `booktabs` rules (loaded by the house style). Pick column types to taste:

  ```latex
  \begin{center}\renewcommand{\arraystretch}{1.3}
  \begin{tabular}{@{} l l l @{}}
    \toprule
    \textbf{Person} & \textbf{Singular} & \textbf{Plural} \\
    \midrule
    1st & hablo   & hablamos \\
    2nd & hablas  & habláis  \\
    3rd & habla   & hablan   \\
    \bottomrule
  \end{tabular}\end{center}
  ```

  Rules of thumb: one logical column per `tabular` column (do not let two source
  columns bleed together); `\toprule`/`\midrule`/`\bottomrule` instead of
  vertical lines; align numbers on the decimal with `S` columns (siunitx) only
  if the data warrants it. Verify every cell against the source — extraction
  loves to shift a value one column over.

## Dialogues and interlinear glosses (language learning)

```latex
\dialogue{Ana}{¿Quieres un café?}
\dialogue{Beto}{Sí, con leche, por favor.}

\gloss{Ich habe einen Hund.}{I have a dog. (lit. I have a-ACC dog)}
```

## Math

When the source is mathematical, reconstruct — don't transcribe. `pdftotext`
scatters exponents, fractions, integrals, and subscripts into loose fragments
and Unicode (`dy/dx`, `x²`). Reassemble into correct LaTeX (`\dfrac`, `^{...}`,
`_{...}`, `\int`, `\sqrt`, `\ln`, `\sin`) and verify each derivation follows
step to step. `amsmath`/`amssymb` are already loaded. A math handout is not done
until every expression is valid LaTeX and the steps check out.

## Non-Latin scripts and heavy diacritics

The engine is Unicode-native, so Latin-with-diacritics (Spanish, French,
Vietnamese, IPA) works out of the box with the default Latin Modern font. For
Greek, Cyrillic, CJK, Arabic, Devanagari, etc., point the main font at an
installed Unicode font near the top of the document:

```latex
\handoutfont{Noto Serif}        % any installed Unicode font
```

For complex scripts that need shaping/bidi (Arabic, Devanagari, Thai), add
`polyglossia` and set the languages; for mixed-script handouts, set per-span
fonts with `fontspec`'s `\newfontfamily`. Keep the text as real Unicode
characters in the source — never as images of text — so it stays selectable and
accessible.

## Figures you cannot reproduce

Insert a placeholder where the figure belongs and keep going; flag it in your
report:

```latex
% FIGURE OMITTED: hand-drawn slope field for y' = x - y
```
