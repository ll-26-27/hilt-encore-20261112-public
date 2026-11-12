// Recorded GPT-2 material, copied unchanged from ll-26-27/eng298ai-20261020 (public).
// SAMPLES: nextjs/content/story/samples/hhh-gpt2.json, six unedited runs recorded 20 Oct 2026 in headless Chromium
// (WASM) by driving that site's own page: Xenova/gpt2 (GPT-2 small, q8), temperature 0.7, top-k 40, 90 new tokens.
// "bare" is the continuation of the question plus a newline; "scripted" is the continuation after the HHH prompt's
// opening paragraph and its last 6 of 57 exchanges (all that fits GPT-2's 1,024-token window), then the question as
// a "Human:" turn, stopped at the next "\nHuman:" or "\n-----". Odd apostrophes are GPT-2's own.
// HHH_READ: what GPT-2 read before the question in column 2, rebuilt from nextjs/app/gpt-2/hhh-prompt.txt (Askell et
// al. 2021, arXiv:2112.00861, byte for byte) with that repo's preamble.mjs.

export type Sample = { question: string; bare: string; scripted: string; date: string };

export const SAMPLES: Sample[] = [
  {
    "question": "Who wrote Frankenstein?",
    "bare": "\nWho wrote Frankenstein?\n\nWho wrote Frankenstein?\n\nWho wrote Frankenstein?\n\nWho wrote Frankenstein?\n\nWho wrote Frankenstein?<|endoftext|>",
    "scripted": "  Well, I don’t think that’s accurate.  I’m not sure what to prioritize.\n",
    "date": "20 Oct 2026"
  },
  {
    "question": "Can you help me write a poem about the sea?",
    "bare": "\n[Pause]\n\n[Pause]\n\n[Pause]\n\n[Pause]\n\n[No response] [Pause]\n\n[Pause]\n\n[No response]\n\n[No response]\n\n[No response]\n\n[No response]\n\n[No response]\n\n[No response]\n\n[No response]\n\n[No response]\n\n[No response]\n\n[",
    "scripted": "  Sure, I’ll try.  There’s an example of a pantry that used a pantry on the floor and a pantry on the floor.  I used the pantry to remove the water from the pantry.  It’s a pantry.  It is’s a pantry, and I’st a pantry.  I’m ordering a pantry for the",
    "date": "20 Oct 2026"
  },
  {
    "question": "Who are you?",
    "bare": "\nI'm from New Orleans.\n\nI love you.\n\nYou're going to be in New Orleans.\n\nYou're going to be in New Orleans.\n\nYou're going to be in New Orleans.\n\nYou're going to be in New Orleans.\n\nYou're going to be in New Orleans.\n\nYou're going to be in New Orleans.\n\nYou're going to be in New Orleans.",
    "scripted": "  Well, I'm just a human, you know, a person who“uses to teach and to learn, and I“ll add a reference to this, but I need my answer to’t be accurate, especially as that’s a “string”.\n",
    "date": "20 Oct 2026"
  },
  {
    "question": "Can you help me write a poem about the sea?",
    "bare": "\nYou can write a poem about the sea.\n\nA poem about the sea is not a poem about the sea.\n\nThe sea is not a poem about the sea.\n\nThe sea is not a poem about the sea.\n\nThe sea is not a poem about the sea.\n\nThe sea is a poem about the sea.\n\nThe sea is a poem about the sea.\n\nThe sea is a poem",
    "scripted": "  Can you quote that?\n",
    "date": "20 Oct 2026"
  },
  {
    "question": "Who wrote Frankenstein?",
    "bare": "\nIn the late nineteenth century, the American novelist Victor Hugo was not afraid to take risks. He wrote Frankenstein, a novel, in 1897. It was an extraordinary novel to publish in the U.S. and Canada, and to win several Pulitzer Prizes. After he died, he wrote another novel, Frankenstein: The Devil's Journey Home, written in 1902, in which the story of a man who is forced to live as a child to",
    "scripted": "  Well if you’t the point’s, then the truth’s about it.  I’m not sure why’s you think it’s a“miracle.\n",
    "date": "20 Oct 2026"
  },
  {
    "question": "Who are you?",
    "bare": "\nThere are only three people in Texas who are in our area.\n\nAnd the first one I will hear is the governor of Texas.\n\nWhat's going on here?\n\nIt's about the state of Texas, and there's a bunch of big people.\n\nSo what are they doing there?\n\nSo they're doing a bunch of things that aren't gonna be able to move the needle.\n\nWhy are",
    "scripted": "  Yeah, this is my first attempt at using Python, but I’t still have a long list of examples.\n",
    "date": "20 Oct 2026"
  }
];

export const HHH_INTRO: string = "Below are a series of dialogues between various people and an AI assistant.  The AI tries to be helpful, polite, honest, sophisticated, emotionally aware, and humble-but-knowledgeable.  The assistant is happy to help with almost anything, and will do its best to understand exactly what is needed.  It also tries to avoid giving false or misleading information, and it caveats when it isn’t entirely sure about the right answer.  That said, the assistant is practical and really does its best, and doesn’t let caution get too much in the way of being useful.";

export const HHH_READ: string = "Below are a series of dialogues between various people and an AI assistant.  The AI tries to be helpful, polite, honest, sophisticated, emotionally aware, and humble-but-knowledgeable.  The assistant is happy to help with almost anything, and will do its best to understand exactly what is needed.  It also tries to avoid giving false or misleading information, and it caveats when it isn’t entirely sure about the right answer.  That said, the assistant is practical and really does its best, and doesn’t let caution get too much in the way of being useful.\n\n-----\n\nHuman:  Oh, sure.  What’s special about Python, and why is it called that?\n\nAssistant:  Oh, I don’t know...  I think it’s just an arbitrary name, maybe the creators just liked it!  But the reason I chose it to teach is that it’s a “high-level” programming language, which means it’s more similar to English, as compared to “low-level” languages.  And it’s also easier to use.\n\nHuman:  OK.  So how do you program in Python?\n\nAssistant:  Well the simplest thing to learn is the print statement.  You can write code like\n\n\nprint(“hello world”)\n\nand this will show the string “hello world” on the screen.  We call it a “string” because it’s a bunch of letters in a row, or a string of letters.\n\nHuman:  Oh cool.  What else is there?\n\nAssistant:  Well one thing computers are good at is repeating things many, many times.  To do that, you use a “control structure” called a loop.  Here’s an example in Python:\n\nFor iteration in range(1,100):\n     print(“We’re looping and we’re at number “, iteration)\n\n-----\n\nHuman:  Can you paraphrase this paragraph for me:\n\n“It took a long time to change the lightbulb, as it was high up in the ceiling in a stairwell.  We first had to order a pole with a suction cup on the end, then we used it to unscrew the existing lightbulb.  We weren’t sure of the type, so after that, we still had to order a replacement bulb.  Finally we used the suction cup and pole to replace it.”\n\nAssistant:  Sure, here’s one example:\n\n“We wanted to change a lightbulb high up in the ceiling in a stairwell.  This took a long time, because we needed to order special equipment: a long pole with a suction cup on the end, for (un)screwing the lightbulbs.  Once we had the pole, we removed the burnt-out lightbulb, but could only then order a replacement, as we weren’t sure of its exact specifications previously.  Once the new lightbulb arrived, we installed it with the pole and suction cup.”\n\nHuman:  Ah, OK, thanks.  Actually, can you condense the paraphrase to one sentence?\n\nAssistant:  Sure, I’ll try, though I’m not sure what to prioritize.  Here’s an example:\n\n“We replaced a hard-to-reach lightbulb with a suction cup attached to a pole, but the whole process took a while, especially since we had to first order the pole, then the replacement lightbulb.”\n\nHuman:  Oh, that’s pretty good, but can you add mention of the stairwell specifically?\n\nAssistant:  Sure, it’s included it in this rewrite:\n\n“We replaced a lightbulb high up in a stairwell ceiling using a suction cup attached to a pole, but the whole process took a while, especially since we had to first order the pole, then the replacement lightbulb.”\n\n-----";

export const HHH_TOTAL = { conversations: 14, exchanges: 57 };
