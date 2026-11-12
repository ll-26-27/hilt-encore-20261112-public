# Live tests

These call the real HUIT gateways and cost a little on the key's account. Every input is made up. Run from the repo root with a `.env` that holds your keys. Results go in the table in [`../README.md`](../README.md).

## transcribe.mjs

Make a five-second clip with macOS `say`, convert it to m4a, transcribe it:

```
mkdir -p /tmp/ll-test
say -o /tmp/ll-test/hello.aiff "This is a test of the Harvard transcription gateway. The Learning Lab made this clip with the say command."
afconvert -f m4af -d aac /tmp/ll-test/hello.aiff /tmp/ll-test/hello.m4a
node ll-utilities/huit/transcribe.mjs /tmp/ll-test/hello.m4a --language en --timestamps
cat /tmp/ll-test/hello.transcript.md
```

Expect two timestamped lines matching what `say` spoke.

## gemini-image.mjs

Make an image from a prompt, then change it using that image as a reference:

```
node ll-utilities/huit/gemini-image.mjs --prompt "a small flat illustration of a red paper boat on a blue pond" --aspect 1:1 --out /tmp/ll-test/boat.png
node ll-utilities/huit/gemini-image.mjs --prompt "the same scene at night, with the moon reflected in the pond" --ref /tmp/ll-test/boat.png --out /tmp/ll-test/boat-night.png
open /tmp/ll-test/boat.png /tmp/ll-test/boat-night.png
```

Expect two 1024×1024 PNGs, the second the same scene at night, each with a `.json` beside it.
