# Workshop resources

This folder contains reference material for the workshop. The files can be read
independently of the group exercise and use cases.

## Glossary

The glossary defines 30 terms used in the workshop, including *token*, *context
window*, *agent*, *skill*, *prompt injection*, and *data classification*.

- [`glossary/glossary-md/`](glossary/glossary-md/) contains the Markdown source,
  with one file per term.
- [`glossary/glossary-html/index.html`](glossary/glossary-html/index.html) opens
  the browsable HTML version.

## Handouts

Most handouts are available as a standalone HTML file and a PDF. Some also have
Markdown source.

| Handout | Topic |
|---|---|
| [`ai-surfaces/`](handouts/ai-surfaces/) | Comparison of Chat, Work, and CLI surfaces |
| [`its-all-text/`](handouts/its-all-text/) | How prompts, project instructions, memory, skills, and tool definitions are stored as text |
| [`project-plan/`](handouts/project-plan/) | The `inputs/` → `operations/` → `outputs/` project structure |
| [`markdown-cheatsheet/`](handouts/markdown-cheatsheet/) | Basic Markdown syntax |
| [`terminal-refresher/`](handouts/terminal-refresher/) | Basic terminal commands and file paths |
| [`claude-code-commands-and-concepts/`](handouts/claude-code-commands-and-concepts/) | Claude Code commands and related concepts |
| [`security-concerns/`](handouts/security-concerns/) | Prompt injection, excessive permissions, and data exposure |
| [`what-you-can-make/`](handouts/what-you-can-make/) | Examples of projects that can be built with desktop AI apps and coding agents |

## Setup guides

The [`handouts/setup-checklists/`](handouts/setup-checklists/) folder contains:

- `code-ide/`: terminal and VS Code setup for macOS and Windows
- `desktop-app/`: parallel setup notes for ChatGPT Desktop and Claude Desktop
- `webui/`: browser setup

The `code-ide/checklists/` folder contains shorter printable checklists.

## Rebuilding a handout PDF

Edit the handout's HTML source, then use the workshop's HTML-to-PDF script:

```bash
~/.claude/skills/handout-house-style/scripts/html2pdf.sh handouts/<name>/<name>.html
```

This command depends on a local skill outside this repository. If that skill is
not installed, the existing HTML and PDF files can still be used as provided.
