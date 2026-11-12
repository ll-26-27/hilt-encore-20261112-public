#!/usr/bin/env bash
# build.sh -- compile handout .tex files to PDF with the house style.
#
# Requires: tectonic (https://tectonic-typesetting.github.io) on PATH.
#
# Usage:
#   build.sh <dir>              compile every .tex under <dir>
#   build.sh <file.tex> ...     compile the named file(s)
#
# Before compiling, it makes sure housestyle.sty and handout.sty sit next to
# each .tex (copying them from this skill's styles/ dir if missing), so a
# handout folder compiles standalone.
set -euo pipefail

skill_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
styles="$skill_dir/styles"

ensure_styles() {
    local dir="$1"
    for sty in housestyle.sty handout.sty; do
        [ -f "$dir/$sty" ] || cp "$styles/$sty" "$dir/$sty"
    done
}

compile_one() {
    local tex="$1"
    local dir; dir="$(cd "$(dirname "$tex")" && pwd)"
    ensure_styles "$dir"
    echo "Compiling $(basename "$tex")"
    ( cd "$dir" && tectonic "$(basename "$tex")" )
}

[ "$#" -ge 1 ] || { echo "usage: build.sh <dir | file.tex ...>" >&2; exit 2; }

for arg in "$@"; do
    if [ -d "$arg" ]; then
        found=0
        while IFS= read -r -d '' tex; do
            compile_one "$tex"; found=1
        done < <(find "$arg" -name '*.tex' -print0)
        [ "$found" -eq 1 ] || echo "No .tex files under $arg"
    elif [ -f "$arg" ]; then
        compile_one "$arg"
    else
        echo "Skipping $arg (not a file or directory)" >&2
    fi
done

echo "Done. PDFs are written next to their .tex sources."
