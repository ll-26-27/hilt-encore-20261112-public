# Workshop use case: photos to a chart

In this use case, each table places task cards on a 1–10 scale showing how
comfortable the group is with using AI for each task. The repository contains
12 photos of those arrangements.

The use case produces two files:

- `outputs/ai_comfort_spectrum.csv`: one row for each card that can be read and
  placed on the scale
- `outputs/ai_comfort_spectrum.html`: an interactive chart built from the CSV

Completed examples of both files are in `outputs/example/`. The `outputs/`
folder itself starts empty, so your own run does not mix with the examples.

## Activity that produced the photos

This activity was used with teaching fellows during training.

Each participant receives a paper card with one task on it:

- pink cards describe tasks completed by a teacher;
- orange cards describe tasks completed by a student.

Working in pairs or small groups, participants place the cards along a
horizontal line according to how comfortable they are with AI doing each task.
Tasks they do not want AI involved in go at the far left. Tasks they would be
comfortable assigning to AI go toward the far right. Cards can share the same
position and can be moved during the discussion.

After arranging the cards, the group discusses:

- What patterns appear across the teacher and student tasks?
- Where did group members disagree?
- For tasks at the uncomfortable end, is the concern that AI cannot perform the
  task well, or that completing the task is itself an important part of
  learning or teaching?

Each table then photographs its completed arrangement. Those photographs are
the inputs for the data-processing steps below.

## Folder contents

```text
inputs/            original HEIC photos, one per table, with inconsistent names
operations/        two task prompts and a supporting image-processing script
outputs/example/   completed CSV, HTML, and filename map from an earlier run
```

The photo names are inconsistent on purpose (`grp4`, `nine`, `table 7`).
Renaming them is the first step of the prompt.

## Run it in a desktop app

The [walkthrough](../00-start-here/walkthrough.md) takes you through these steps
one at a time. In short:

1. Ask the assistant to follow
   [`operations/01-photos-to-csv.md`](operations/01-photos-to-csv.md). The prompt
   explains how to normalize filenames, detect cards, assign positions, and
   write the CSV. Paths in the prompts are relative to this folder, so mention
   `01-workshop-example-use-case` if the app is working from the top of the
   repository:

   ```text
   Working in 01-workshop-example-use-case, follow the instructions in
   operations/01-photos-to-csv.md.
   ```

2. Review the detected cards and any exclusions before accepting the result.
   Compare at least one photo with its rows in the CSV.
3. Ask the assistant to follow
   [`operations/02-csv-to-visualization.md`](operations/02-csv-to-visualization.md)
   to create the HTML chart. If you do not have a CSV of your own yet, copy
   `outputs/example/ai_comfort_spectrum.csv` into `outputs/` first.

## Run it in a coding agent

Open this folder in Codex or start `claude` here for Claude Code so the relative
paths resolve, then give it the same two prompts. Review each proposed file
change before accepting it.

### Optional: the supporting script

The script automates image conversion, card detection, and position scoring. It
does not read the text on the cards or decide whether every detected object is a
valid card. Those steps still require review. Run it from this folder in a
terminal:

```bash
python operations/extract.py prep inputs/ work/
python operations/extract.py detect work/
```

Open the contact sheets in `work/sheets/`, identify the numbered cards, and
record the labels in `work/labels.json` as instructed by the script. Then run:

```bash
python operations/extract.py score work/ outputs/ai_comfort_spectrum.csv
```

The temporary `work/` folder is excluded from Git.

## What to check

- Every included label matches one of the 18 tasks listed in the first prompt.
- A task does not appear twice for the same group.
- The leftmost and rightmost included cards receive scores of 1 and 10.
- Unclear photos, duplicate group numbers, and excluded cards are reported for
  human review.
