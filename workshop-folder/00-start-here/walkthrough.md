# Walkthrough: beyond the chatbox

This is the path through today's workshop. Each step has a prompt you can copy,
what you should see, and what to do if you get stuck. Work at your own pace. If
you fall behind, skip ahead: every step works on its own.

In a chat, the conversation is the only record of your work. Here, the record is
this folder. You will point several chats at the same files, and the files will
keep your work when a chat ends.

The folder is organized in three parts, and the workshop follows them in order:

```text
inputs/       what you give the model
operations/   what you ask it to do, saved as files
outputs/      what it makes
```

---

## Step 1. Open the folder in your desktop app

1. Download the repository as a ZIP file:
   <https://github.com/ll-26-27/desktop-app-workshop/archive/refs/heads/main.zip>
2. Make an empty folder for your AI-assisted work, for example `AI workshop`
   in your home folder. Move the ZIP file into it.
3. **Unzip it.** Double-click the ZIP file. You should now have a folder called
   `desktop-app-workshop-main`. The app cannot work inside a ZIP file.
4. Open the folder in your app:
   - **ChatGPT Desktop:** start a local workspace or folder-based task and choose
     the unzipped folder.
   - **Claude Desktop:** switch to **Cowork**, choose **Add folder**, select the
     unzipped folder, and click **Allow**.
5. Review the folder-access prompt. Grant access only to the workshop folder.
6. If your app offers a model menu, choose a model suited to multi-step work
   rather than its fastest lightweight option.

**About folder access.** Granting access lets the app read, create, edit, and
move files in this folder. That is why you are using a separate folder that
contains only workshop files. Use your Harvard account, not a personal one, and
follow the data classification limits approved for that account and app. Do not
assume the same limit applies to every provider or account.

First prompt:

```text
What's in here?
```

**What you should see:** the assistant runs a few tool calls to list and read the
files, then describes the folder. The model does not know your files in advance.
It reads them with tools, as it does when it searches the web. You may be asked
to approve a tool or folder action.

**If you're stuck:** if the assistant says the folder is empty or cannot be
read, check that you added the unzipped folder, not the ZIP file.

---

## Step 2. Inputs: open the tokenizer page

Find `00-start-here/tokenizer.html` and open it in your browser from its path:

1. In Finder, right-click the file, then hold **Option** and choose
   **Copy "tokenizer.html" as Pathname**. The shortcut is ⌥⌘C.
2. Paste the path into your browser's address bar and press Return.

**What you should see:** a sentence divided into colored segments, with a list of
numbers underneath. Each segment is a **token**, and each number is that
token's ID. Models read and write these numbers, not letters or words. Hover
over a segment or a number to see which ones go together.

Look for:

- `Unsurprisingly` becomes `Un` + `sur` + `prisingly`, and `unhappily` becomes
  ` unh` + `app` + `ily`. The splits come from whatever letter combinations were
  most common in the training data, not from how the word is built.
- Most tokens include the space before the word. Turn on **Show spaces** to see
  them.
- **Capitals:** `Hello`, ` hello`, and ` HELLO` are different tokens, and
  ` HELLO` splits in two.
- **Korean:** the same sentence in Korean takes 26 tokens instead of 19.
  Languages with less training data need more tokens for the same meaning, and
  a single character can be split across two tokens.

Tokenization is the one input you never control. The next step covers the ones
you do.

**If you're stuck:** double-clicking `tokenizer.html` in Finder also opens it.

---

## Step 3. Inputs: who controls what

Everything the model receives in a session is text in one **context window**.
Some of that text is chosen for you, and some you choose:

| input | can you change what it says? | can you choose whether it loads? |
|---|---|---|
| tokenization and training data | no | no |
| system prompt | no, the company writes it | no, it always loads first |
| memory, project instructions, skills | yes | mostly automatic once turned on |
| your files, your prompts, instructions you point it to | yes | yes |

Things to try:

1. **Read part of the system prompt** on the printed handout. It is a long set of
   instructions that loads before your first message. You never see it in the
   chat.
2. **Turn on memory** in **Settings → Capabilities**. Memory is also text: saved
   notes that are added to the start of the context window.
3. Look at the "It's All Text" handout in
   `resources/handouts/its-all-text/`. A session starts partly full (the system
   prompt and memory), and each turn adds your prompt, your inputs, and the
   model's output until the window fills.

**Why this matters for teaching:** when you evaluate work a student made with
AI, the parts that show their judgment are the parts they controlled: the
context they chose, the operations they ran, and how they checked the outputs.

---

## Step 4. Inputs: Markdown

Open any `.md` file in this folder, such as this one. Markdown is plain text with
a few marks for structure: `#` for headings, `-` for lists, `**` for bold.

Models work well with Markdown because it is common in their training data and
has little formatting overhead. A PDF or Word file must be converted to text
first, and much of its formatting is lost or costs extra tokens. When you save
your own prompts and notes for an AI assistant, save them as `.md` files.

To see the difference, open the tokenizer page again and compare the **Plain
text** and **Markdown** buttons. They hold the same short announcement. The
Markdown version adds headings and bold text for 7 more tokens (41 instead of
34). Structure costs a little; a PDF's formatting costs much more.

**If you're stuck:** if your Mac has no app for `.md` files, right-click the file
and choose **Open With → TextEdit**. VS Code also works.

---

## Step 5. Inputs: clean up the use-case photos

Open `01-workshop-example-use-case/inputs/`. It contains 12 photos from a teaching fellow
activity. Each table placed task cards on a strip of tape from "keep AI out" to
"let AI do it." Pink cards are teacher tasks; orange cards are student tasks. The
[use-case README](../01-workshop-example-use-case/README.md) describes the activity.

The filenames are inconsistent, as they usually are when many people submit
files: `grp4`, `nine`, `group 5 final`, `table 7`. Preparing inputs is the first
job, and it is the part of the work you control most directly.

Prompt:

```text
In 01-workshop-example-use-case, copy inputs/ to a new folder called inputs-original/.
Then rename the photos in inputs/ to group-01, group-02, and so on, using the
group number in each filename and keeping each file's extension. Before
renaming, write the old and new names to outputs/filename_map.csv. If two files
have the same group number, or a file has no number, stop and ask me.
```

**What you should see:** a new `inputs-original/` folder, renamed files in
`inputs/`, and a mapping file in `outputs/`. Check in Finder. The files on your
computer have changed, not just the text in the chat.

**If you're stuck:** the renamed result is recorded in
`01-workshop-example-use-case/outputs/example/filename_map.csv`.

---

## Step 6. Operations: photos to a table

Open `01-workshop-example-use-case/operations/01-photos-to-csv.md` and skim it before you
run it. The prompt is a file. If you find yourself typing the same instructions
again and again, save them in `operations/` so you can reuse them on new inputs.

Prompt:

```text
Working in 01-workshop-example-use-case, follow the instructions in
operations/01-photos-to-csv.md.
```

This takes several minutes. While it runs, watch the steps the assistant takes.
The prompt begins by renaming the photos; if you completed step 5, it may
notice they are already renamed and skip ahead, or ask whether to.

**Check the result.** Choose one photo. Open it, then find its rows in
`01-workshop-example-use-case/outputs/ai_comfort_spectrum.csv`. Compare them:

- Is every card in the photo in the table?
- Is any card in the table that is not in the photo?
- Are the positions roughly right?

Models misread, invent, and misplace things while sounding confident. Checking
one example against the source is the habit to build.

**Optional: computed or generated?** Ask the same question two ways and compare the
answers:

```text
Which task was placed most often at the "keep AI out" end? Just tell me.
```

```text
Which task was placed most often at the "keep AI out" end? Write and run a
script over 01-workshop-example-use-case/outputs/ai_comfort_spectrum.csv to find out.
```

The first answer is generated from patterns. The second is computed from the
data.

**If you're stuck:** copy the finished table from
`01-workshop-example-use-case/outputs/example/ai_comfort_spectrum.csv` into
`01-workshop-example-use-case/outputs/` and continue with the next step.

---

## Step 7. A new chat on the same folder

Start a new task or chat on the same folder and ask:

```text
What has been done in this folder so far?
```

**What you should see:** the new chat does not remember the earlier
conversation, but it can read the files that conversation produced. Each chat is
a new context window. The folder keeps the work.

---

## Step 8. Outputs: make a chart

Make an interactive page from the table. Use the saved operation:

```text
Working in 01-workshop-example-use-case, follow the instructions in
operations/02-csv-to-visualization.md.
```

Or describe what you want in your own words, for example:

```text
Make a single HTML page from 01-workshop-example-use-case/outputs/ai_comfort_spectrum.csv
that shows where each table placed each task. Save it in
01-workshop-example-use-case/outputs/.
```

Open the result the same way you opened the tokenizer page: copy its path and
paste it into your browser. Then ask for one change, such as different colors, a
filter, or a short written summary of the patterns.

Check the chart against the table before you trust it.

**If you're stuck:** a finished version is in
`01-workshop-example-use-case/outputs/example/ai_comfort_spectrum.html`.

---

## Step 9. Your own folder

Open `03-your-project/`. It has empty `inputs/`, `operations/`, and `outputs/`
folders.

1. On the project plan handout, write down one task from your own teaching or
   research: what goes in, what should happen, and what should come out.
2. Put a sample input in `inputs/`. Use material that is safe to share.
3. Write your first operation, in your own words, as a `.md` file in
   `operations/`.
4. Start a new chat on the folder:

   ```text
   Follow the operation in 03-your-project/operations/ on the files in
   03-your-project/inputs/. Write the results to 03-your-project/outputs/.
   ```

**If you're stuck for an idea:** look through `02-further-use-cases/`. Each
example there is laid out the same way, with its own inputs, operations, and
outputs.

**Optional: standing instructions.** Write a file called
`03-your-project/instructions.md` with rules for any chat that works in this
folder, for example:

```text
- Never change or delete files in inputs/. Write new files to outputs/.
- Use plain language.
- Push back when my claims lack evidence, and say when you are unsure.
```

Start your chats with "Read 03-your-project/instructions.md first." To see the
difference it makes, ask the same question in a chat that has not read it and
compare.

---

## Going further: coding surfaces

Everything in this walkthrough also works in a coding agent. **Codex** is
OpenAI's coding surface, available through the ChatGPT/Codex desktop experience
and other interfaces. **Claude Code** is Anthropic's coding surface and runs in
a terminal or VS Code. Both expose file changes for review and can follow saved
project instructions.

The use cases in `02-further-use-cases/` include `CLAUDE.md` files as examples
of Claude Code's automatic project instructions. In another app, ask the
assistant to read that file, or copy the reusable parts into the instruction
file that app supports. Some examples also include skills: reusable, multi-step
instructions such as the interview-coding workflow.

Claude Code setup guides are in
`resources/handouts/setup-checklists/code-ide/`. The Claude Code commands
handout remains a product-specific optional reference.
