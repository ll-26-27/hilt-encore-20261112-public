"use client";

import "@xyflow/react/dist/style.css";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Background, ConnectionMode, Controls, Handle, MarkerType, MiniMap, Panel, Position, ReactFlow,
  useEdgesState, useNodesState, type Connection, type Edge, type Node, type NodeProps,
} from "@xyflow/react";
import type { Board, Card, Column, Network } from "@/lib/stories";

const ORDER: Column[] = ["0", "1", "2", "3", "4", "5", "unplaced"];
const LABELS = ["leads to", "sets up", "answers"];
const KIND_COLOR: Record<string, string> = { story: "#6aa9ff", "set piece": "#ff6b57", demo: "#7fc787", moment: "#f2c14e", takeaway: "#c58cf2", question: "#4fd1c5" };
const COL_W = 320;
const GAP = 40;

type CardData = { card: Card; share: boolean; pending: boolean };
type LabelData = { text: string; num: string };

function CardNode({ data }: NodeProps<Node<CardData>>) {
  const { card, share, pending } = data;
  return (
    <div className={`net-card${share ? " share" : ""}${pending ? " pending" : ""}`} style={{ ["--kind" as string]: KIND_COLOR[card.kind] ?? "#a0a49a" }}>
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Left} id="l" />
      <div className="net-top">
        <span className="net-kind">{card.kind}</span>
        <span className="net-part">{card.part === "unplaced" ? "–" : card.part}</span>
      </div>
      <strong>{card.title}</strong>
      {!share && card.body && <p>{card.body}</p>}
      {!share && <span className="net-meta">{[card.who, card.minutes ? `${card.minutes} min` : "", card.show].filter(Boolean).join(" · ")}</span>}
    </div>
  );
}

function LabelNode({ data }: NodeProps<Node<LabelData>>) {
  return <div className="net-label"><span>{data.num}</span>{data.text}</div>;
}

const nodeTypes = { card: CardNode, label: LabelNode };

// A card's height with its words showing, near enough to stack cards without overlap: title and body lines at the
// node's width (about 30 and 40 characters a line).
function cardHeight(card?: Card) {
  if (!card) return 120;
  return 64 + Math.ceil(card.title.length / 30) * 21 + (card.body ? Math.ceil(card.body.length / 38) * 19 + card.body.split("\n").length * 4 : 0);
}

// Part clusters: one column per part (0–5, then unplaced), cards stacked in the board's order.
function clusterLayout(board: Board) {
  const byId = new Map(board.cards.map((c) => [c.id, c]));
  const pos: Record<string, { x: number; y: number }> = {};
  ORDER.forEach((col, ci) => {
    let y = 80;
    for (const id of board.columns[col]) {
      pos[id] = { x: ci * COL_W, y };
      y += cardHeight(byId.get(id)) + GAP;
    }
  });
  return pos;
}

function labelNodes(labels: Record<string, string>): Node<LabelData>[] {
  return ORDER.map((col, ci) => ({
    id: `label-${col}`, type: "label", position: { x: ci * COL_W, y: 0 }, draggable: false, selectable: false, deletable: false,
    data: { text: labels[col] ?? col, num: col === "unplaced" ? "–" : col },
  }));
}

function toEdge(l: { id: string; source: string; target: string; label: string }, share: boolean): Edge {
  return {
    id: l.id, source: l.source, target: l.target, label: l.label || undefined, data: { label: l.label },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#bbb" }, style: { stroke: "#bbb", strokeWidth: share ? 3 : 2 },
    labelStyle: { fill: "#ecece6", fontSize: share ? 18 : 13, fontWeight: 600 }, labelBgStyle: { fill: "#20231f" }, labelBgPadding: [6, 3], labelBgBorderRadius: 4,
  };
}

export default function NetworkBoard({ board, network, labels, initialShare }: { board: Board; network: Network; labels: Record<string, string>; initialShare: boolean }) {
  const [share, setShare] = useState(initialShare);
  const [showLabels, setShowLabels] = useState(Object.keys(network.positions).length === 0);
  const [pending, setPending] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const cards = useMemo(() => new Map(board.cards.map((c) => [c.id, c])), [board]);

  const initialNodes = useMemo(() => {
    const cluster = clusterLayout(board);
    return board.cards.map<Node<CardData>>((card) => ({
      id: card.id, type: "card", position: network.positions[card.id] ?? cluster[card.id], deletable: false,
      data: { card, share: initialShare, pending: false },
    }));
  }, [board, network, initialShare]);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(network.links.map((l) => toEdge(l, initialShare)));
  const latest = useRef({ nodes, edges });
  latest.current = { nodes, edges };
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Save positions and links to network.json, half a second after the last change.
  const save = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setStatus("Saving…");
    timer.current = setTimeout(async () => {
      const { nodes, edges } = latest.current;
      const positions = Object.fromEntries(nodes.filter((n) => n.type === "card").map((n) => [n.id, n.position]));
      const links = edges.map((e) => ({ source: e.source, target: e.target, label: (e.data?.label as string) ?? "" }));
      try {
        const res = await fetch("/api/stories/network", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ positions, links }) });
        if (!res.ok) throw new Error(await res.text());
        setStatus(`Saved ${new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`);
      } catch (error) {
        setStatus(`Not saved: ${(error as Error).message}`);
      }
    }, 500);
  }, []);

  // Screen-share mode and the pending link start are drawn by the card nodes.
  useEffect(() => {
    setNodes((ns) => ns.map((n) => (n.type === "card" ? { ...n, data: { ...n.data, share, pending: n.id === pending } } : n)));
    setEdges((es) => es.map((e) => toEdge({ id: e.id, source: e.source, target: e.target, label: (e.data?.label as string) ?? "" }, share)));
  }, [share, pending, setNodes, setEdges]);

  useEffect(() => {
    setNodes((ns) => [...ns.filter((n) => n.type === "card"), ...(showLabels ? labelNodes(labels) : [])]);
  }, [showLabels, labels, setNodes]);

  const link = useCallback((source: string, target: string) => {
    if (source === target) return;
    const id = `${source}->${target}`;
    setEdges((es) => (es.some((e) => e.id === id) ? es : [...es, toEdge({ id, source, target, label: "" }, share)]));
    save();
  }, [setEdges, save, share]);

  const selectedEdge = edges.find((e) => e.selected);
  const setLabel = (label: string) => {
    if (!selectedEdge) return;
    setEdges((es) => es.map((e) => (e.id === selectedEdge.id ? { ...toEdge({ id: e.id, source: e.source, target: e.target, label }, share), selected: true } : e)));
    save();
  };

  function group() {
    const cluster = clusterLayout(board);
    setNodes((ns) => ns.map((n) => (n.type === "card" && cluster[n.id] ? { ...n, position: cluster[n.id] } : n)));
    setShowLabels(true);
    save();
  }

  return (
    <main id="main" className={`network${share ? " share" : ""}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={(changes) => {
          onEdgesChange(changes);
          if (changes.some((c) => c.type === "remove")) save();
        }}
        onConnect={(c: Connection) => c.source && c.target && link(c.source, c.target)}
        onNodeDragStop={save}
        onNodeClick={(event, node) => {
          if (node.type !== "card") return;
          if (!event.shiftKey) return setPending(null);
          if (pending && pending !== node.id) {
            link(pending, node.id);
            setPending(null);
          } else setPending(pending === node.id ? null : node.id);
        }}
        onPaneClick={() => setPending(null)}
        connectionMode={ConnectionMode.Loose}
        deleteKeyCode={["Backspace", "Delete"]}
        colorMode="dark"
        minZoom={0.1}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={28} color="#2c2f2b" />
        <Controls />
        {!share && <MiniMap pannable zoomable nodeColor={(n) => (n.type === "card" ? KIND_COLOR[(n.data as CardData).card.kind] ?? "#888" : "transparent")} maskColor="rgba(0,0,0,.6)" />}
        <Panel position="top-left" className="net-panel">
          {!share && <Link href="/stories">← Board</Link>}
          <strong>{share ? "Organizing ideas" : "Story network"}</strong>
          {!share && <span className="net-status">{status || `${cards.size} cards · ${edges.length} links`}</span>}
        </Panel>
        <Panel position="top-right" className="net-panel">
          {!share && <button type="button" onClick={group}>Group by part</button>}
          {!share && <button type="button" onClick={() => setShowLabels((v) => !v)}>{showLabels ? "Hide" : "Show"} part labels</button>}
          <button type="button" className={share ? "on" : ""} onClick={() => setShare((v) => !v)}>Screen share {share ? "on" : "off"}</button>
        </Panel>
        {!share && (
          <Panel position="bottom-center" className="net-panel net-help">
            {selectedEdge ? (
              <>
                <span>Link label:</span>
                {LABELS.map((l) => <button key={l} type="button" className={selectedEdge.data?.label === l ? "on" : ""} onClick={() => setLabel(l)}>{l}</button>)}
                <button type="button" onClick={() => { const v = window.prompt("Link label", (selectedEdge.data?.label as string) ?? ""); if (v !== null) setLabel(v); }}>other…</button>
                <button type="button" onClick={() => setLabel("")}>no label</button>
                <button type="button" onClick={() => { setEdges((es) => es.filter((e) => e.id !== selectedEdge.id)); save(); }}>delete link</button>
              </>
            ) : pending ? (
              <span>Shift-click another card to link “{cards.get(pending)?.title}” to it · click empty space to cancel</span>
            ) : (
              <span>Drag cards anywhere · drag from a dot on a card’s edge to another card, or shift-click two cards, to link them · click a link to label or delete it</span>
            )}
          </Panel>
        )}
      </ReactFlow>
    </main>
  );
}
