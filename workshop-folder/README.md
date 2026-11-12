# Desktop AI app workshop materials

This repository contains materials for a Bok Center Learning Lab workshop on
working with an AI assistant in folders of files. The main workshop path works
in both **ChatGPT Desktop** and **Claude Desktop**; some optional materials also
show the providers' coding tools. It includes one workshop use case, six
further use cases, reference handouts, and a blank project for your own work.

You do not need to understand every file. Start with the walkthrough.

## Start here

1. Use this repository’s `workshop-folder/` directory as your workshop folder.
2. Open the unzipped folder in the desktop app you are using:
   - **ChatGPT Desktop:** open it as a local workspace or folder.
   - **Claude Desktop:** open **Cowork**, choose **Add folder**, and select it.
3. Open [`00-start-here/walkthrough.md`](00-start-here/walkthrough.md) and
   follow the steps.

## Repository guide

| Folder | Contents | Start here |
|---|---|---|
| [`00-start-here/`](00-start-here/) | The workshop walkthrough and the tokenizer page. | [`walkthrough.md`](00-start-here/walkthrough.md) |
| [`01-workshop-example-use-case/`](01-workshop-example-use-case/) | The shared workshop activity. It converts photos of table responses into a CSV file and an interactive chart. | [`README.md`](01-workshop-example-use-case/README.md) |
| [`02-further-use-cases/`](02-further-use-cases/) | Six additional examples involving interviews, manuscripts, research papers, exams, handouts, and interactive simulations. | [`README.md`](02-further-use-cases/README.md) |
| [`03-your-project/`](03-your-project/) | A blank project with empty `inputs/`, `operations/`, and `outputs/` folders. | [`inputs/README.md`](03-your-project/inputs/README.md) |
| [`resources/`](resources/) | A glossary, setup guides, and workshop handouts. | [`README.md`](resources/README.md) |

## Common folder structure

Most examples use three folders:

```text
inputs/       source files such as photos, transcripts, papers, or documents
operations/   prompts, skills, and scripts used to process the source files
outputs/      results produced from the source files
```

In a chat, the conversation is the record of your work. In this structure, the
folder is the record, and you can point several chats at it. If you run an
example with your own material, keep the original files in `inputs/` and write
new files to `outputs/`.

## Choose your desktop app

The prompts, folders, and review practices are shared. Interface labels and
permission prompts differ. See the
[`desktop-app setup guide`](resources/handouts/setup-checklists/desktop-app/README.md)
for parallel ChatGPT Desktop and Claude Desktop instructions.

## Optional coding surfaces

The same folder-based method also works in coding agents. **Codex** is OpenAI's
coding surface; **Claude Code** is Anthropic's. The further use cases retain
`CLAUDE.md` files as Claude Code examples, and their reusable prompts can be
read explicitly in either app. The workshop use case also includes a supporting
script. Claude Code setup guides for macOS and Windows are in
[`resources/handouts/setup-checklists/code-ide/`](resources/handouts/setup-checklists/code-ide/).

## HILT Encore examples

- [GENED 1104 cooking simulations](02-further-use-cases/physics-interactives/index.md): inputs, mathematical operations and interactive outputs.
- [German transcription](02-further-use-cases/manuscript-transcription/index.md): the selected Mueser reading-room page and its inputs and operations.
- [Import record](IMPORT-MANIFEST.json): source versions and checksums. The original workshop files are preserved except for these navigation and example-guide updates.

The German reading room and PhET-style simulation page are embedded in the Next.js site; see [embedding handoff](../nextjs/EMBEDDING.md).
