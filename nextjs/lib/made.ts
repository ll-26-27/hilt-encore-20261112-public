import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

// "How this talk was made": the morning's workspace of agents, live. Runs only where the talk is being made (Marlon's
// laptop): the orchestration run's manifest is local and gitignored, so its path comes from HILT_RUN_JSON in the
// gitignored nextjs/.env.local. Only roles, models, and status are shown: never prompts, paths, or thread IDs. The
// commits are this public repo's own history. Deployed, both are empty and the slide shows its fallback.
const run = promisify(execFile);
const appRoot = /* turbopackIgnore: true */ process.cwd();
const repoRoot = path.dirname(appRoot);

// What each pane does, in words for the audience.
const ROLES: Record<string, string> = {
  HL: "Lead: holds the arc and the run of show, routes the work, reads every change before it goes public",
  DX: "Dictation: takes Marlon's voice notes and turns them into script",
  FE: "The site: builds this app, the slides you're looking at",
  CX: "The words: writes what the slides say, checks every link",
};

export type MadeAgent = { id: string; label: string; role: string; provider: string; model: string; status: string; startedAt: string; done: boolean };
export type MadeCommit = { hash: string; time: string; subject: string };
export type Made = { live: boolean; agents: MadeAgent[]; commits: MadeCommit[]; at: string };

async function envValue(name: string) {
  if (process.env[name]?.trim()) return process.env[name]!.trim();
  try {
    const text = await readFile(/* turbopackIgnore: true */ path.join(appRoot, ".env.local"), "utf8");
    return text.match(new RegExp(`^\\s*${name}\\s*=\\s*(.*?)\\s*$`, "m"))?.[1]?.replace(/^(['"])(.*)\1$/, "$2") ?? "";
  } catch {
    return "";
  }
}

async function readJson(file: string) {
  try {
    return JSON.parse(await readFile(/* turbopackIgnore: true */ file, "utf8"));
  } catch {
    return null;
  }
}

async function agents(): Promise<MadeAgent[]> {
  const runFile = await envValue("HILT_RUN_JSON");
  if (!runFile) return [];
  const manifest = await readJson(runFile);
  const list = (manifest?.groups ?? []).flatMap((group: { agents?: unknown[] }) => group.agents ?? []);
  return Promise.all(
    list.map(async (agent: { id: string; label?: string; provider?: string; model?: string; contextFile?: string }) => {
      const dir = agent.contextFile ? path.dirname(agent.contextFile) : "";
      const runtime = dir ? await readJson(path.join(dir, "runtime.json")) : null;
      const handoff = dir ? await readJson(path.join(dir, "handoff.json")) : null;
      return {
        id: agent.id,
        label: agent.label ?? agent.id,
        role: ROLES[agent.id] ?? "",
        provider: agent.provider ?? "",
        model: agent.model ?? "",
        status: handoff ? "handed off" : runtime?.status ?? "",
        startedAt: runtime?.startedAt ?? "",
        done: Boolean(handoff),
      };
    }),
  );
}

async function commits(): Promise<MadeCommit[]> {
  try {
    const { stdout } = await run("git", ["-C", repoRoot, "log", "--since=18 hours ago", "--pretty=format:%h%x09%aI%x09%s", "-n", "40"]);
    return stdout.split("\n").filter(Boolean).map((line) => {
      const [hash, time, subject] = line.split("\t");
      return { hash, time, subject };
    });
  } catch {
    return [];
  }
}

export async function getMade(): Promise<Made> {
  // No run named (deployed, or another machine): nothing live, and the slide shows its fallback.
  if (!(await envValue("HILT_RUN_JSON"))) return { live: false, agents: [], commits: [], at: new Date().toISOString() };
  const [a, c] = await Promise.all([agents(), commits()]);
  return { live: a.length > 0 || c.length > 0, agents: a, commits: c, at: new Date().toISOString() };
}
