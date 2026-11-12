# Diff cleanliness check

After writing the indexed transcript, verify that the only changes are header insertions. Run:

```
diff <original> <indexed>
```

For the demo corpus the originals live at `inputs/transcripts/<respondent_id>-Transcript.md` and the indexed copies at `outputs/indexed/<respondent_id>-Indexed.md`. Concretely:

```
diff inputs/transcripts/R001-Transcript.md outputs/indexed/R001-Indexed.md
```

**Pass condition:** every diff hunk should consist of `>` lines only (additions), and every added line should either be:

- An `## INDEX: <label> (lines A–B in <source>)` header, or
- A surrounding blank line for spacing.

**Fail condition:** any `<` lines (deletions) or any `c`/`change` hunks. If you see those, you have modified content that should not have been modified. Re-do the write, preserving the original byte-for-byte except for the inserted header blocks.

A useful tighter check is to filter out additions and confirm there is no remaining diff:

```
diff inputs/transcripts/R001-Transcript.md outputs/indexed/R001-Indexed.md | grep -E '^[<]' | grep -v '^---$'
```

This should return empty. If it returns any line, the indexed copy has deleted or modified content from the original.
