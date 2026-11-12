// @ts-nocheck -- ported as-is from tdm155ai/tdm155ai-week-10 (JavaScript); not typed.
"use client";

// GestureCamera: the camera, the hand tracking loop, recording, and the page.
//
// Each camera frame is drawn into the "picture" canvas with the look applied
// (exposure, contrast, color, warmth); that canvas is what gets recorded.
// When a person effect is on (background blur, size, move, another
// background), lib/person.js cuts you out of the frame with MediaPipe's
// segmenter and draws the background and you separately. The same frame goes
// to MediaPipe's HandLandmarker, and lib/gestures.js turns the hands into
// actions: start or stop recording, slide a control, reset everything. A
// second canvas on top draws the hands and the REC light; it's on screen
// only. Per-frame work uses refs, not React state, so the page doesn't
// re-render 30–60 times a second.

import { useCallback, useEffect, useRef, useState } from "react";
import { drawStage } from "./lib/draw";
import { GESTURES, createGestureState, updateGestures } from "./lib/gestures";
import { loadHandTracker } from "./lib/hand-tracker";
import { fingerGaps, readHands } from "./lib/hands";
import { GROUP_IDS, LOOK_CONTROLS, NORMAL_LOOK, canFilterCanvas, drawPicture, resetGroup } from "./lib/look";
import { BACKGROUNDS, PersonLayer, personEffectsOn } from "./lib/person";
import { findPerson, loadSegmenter } from "./lib/segmenter";
import styles from "./gesture-camera.module.css";

// This copy (for the HILT examples page) records nothing: thumbs up and thumbs down light the REC light and run its
// clock, so you can see the gestures work, but no MediaRecorder, no microphone, no takes. The original
// (tdm155ai/tdm155ai-week-10) records takes in the tab for you to download.

const BACKGROUND_HINTS = {
  camera: "Your real background. Turn up Background blur to soften it.",
  plate:
    "What's behind you, learned as you move about, so you can be moved or shrunk without leaving yourself behind. For a clean one, step out of the picture and press Capture empty stage.",
  black: "Just you, on black.",
};

// After recording starts or stops, ignore another start/stop for this long,
// so two hands (or a pinch and a key) can't undo each other.
const RECORD_COOLDOWN_MS = 800;

function cameraErrorText(error) {
  if (!navigator.mediaDevices?.getUserMedia) {
    return "This browser can only use the camera on localhost or an https:// address.";
  }
  if (error?.name === "NotAllowedError") return "The browser didn't allow the camera. Allow it from the address bar, then press Start camera again.";
  if (error?.name === "NotFoundError") return "No camera found. Plug one in, then press Start camera again.";
  if (error?.name === "NotReadableError") return "The camera is busy in another app. Close that app, then press Start camera again.";
  return `The camera didn't start (${error?.message || error}).`;
}

function clock(ms) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export default function GestureCamera() {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const pictureRef = useRef(null);
  const overlayRef = useRef(null);
  const trackerRef = useRef(null);
  const segmenterRef = useRef(null);
  const personRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(0);
  const track = useRef({
    lastVideoTime: -1,
    hands: [],
    ui: [],
    gestures: createGestureState(),
    frames: 0,
    since: 0,
    flash: null,
    lastToggle: -Infinity,
    pictureLook: null,
    lookDirty: false,
    lookShownAt: 0,
  });

  const [settings, setSettings] = useState({ reach: 0.3, holdMs: 500, mirror: true, guide: true, sound: false, background: "camera" });
  const [look, setLookState] = useState(NORMAL_LOOK);
  const [model, setModel] = useState({ state: "loading", detail: "" });
  const [person, setPerson] = useState({ state: "off", detail: "" });
  const [camera, setCamera] = useState({ state: "off", error: "" });
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState("");
  const [aspect, setAspect] = useState(16 / 9);
  const [live, setLive] = useState({ hands: 0, fps: 0 });
  const [notice, setNotice] = useState("");
  const [rec, setRec] = useState({ on: false, startedAt: 0 });
  const [elapsed, setElapsed] = useState(0);
  const [support, setSupport] = useState({ filter: true });

  const settingsRef = useRef(settings);
  const lookRef = useRef(NORMAL_LOOK);
  const recRef = useRef(rec);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const set = (key, value) => setSettings((s) => ({ ...s, [key]: value }));

  useEffect(() => {
    setSupport({ filter: canFilterCanvas() });
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 5000);
    return () => clearTimeout(timer);
  }, [notice]);

  // ---------- look ----------

  const setLook = useCallback((next) => {
    lookRef.current = next;
    setLookState(next);
  }, []);

  // The ✌️ gesture turns background blur off, and back on to the last level you set.
  const blurLevelRef = useRef(0.5);
  useEffect(() => {
    if (look.blur > 0.005) blurLevelRef.current = look.blur;
  }, [look.blur]);

  const resetAll = useCallback(() => setLook(NORMAL_LOOK), [setLook]);

  // ---------- person finding (loaded the first time a person effect is on) ----------

  useEffect(() => {
    personRef.current = new PersonLayer();
  }, []);

  const personWanted = personEffectsOn(look, settings.background);
  useEffect(() => {
    if (!personWanted || person.state !== "off") return;
    setPerson({ state: "loading", detail: "" });
    loadSegmenter()
      .then((loaded) => {
        segmenterRef.current = loaded;
        setPerson({ state: "ready", detail: `${loaded.delegate}${loaded.offline ? "" : ", loaded from the internet"}` });
      })
      .catch((error) => setPerson({ state: "error", detail: String(error?.message || error) }));
  }, [personWanted, person.state]);

  // ---------- recording ----------

  // The REC light only: nothing is captured.
  const startRecording = useCallback(() => {
    if (!streamRef.current || recRef.current.on) return;
    const now = performance.now();
    recRef.current = { on: true, startedAt: now };
    setRec(recRef.current);
    setElapsed(0);
    track.current.flash = { t: now, color: "#e5484d" };
  }, []);

  const stopRecording = useCallback(() => {
    if (!recRef.current.on) return;
    recRef.current = { on: false, startedAt: 0 };
    setRec(recRef.current);
    track.current.flash = { t: performance.now(), color: "#ffffff" };
  }, []);

  // Starts (on = true) or stops recording, unless it just started or stopped.
  const setRecording = useCallback(
    (on) => {
      const now = performance.now();
      if (on === recRef.current.on || now - track.current.lastToggle < RECORD_COOLDOWN_MS) return;
      track.current.lastToggle = now;
      if (on) startRecording();
      else stopRecording();
    },
    [startRecording, stopRecording],
  );

  const toggleRecording = useCallback(() => setRecording(!recRef.current.on), [setRecording]);

  // The tracking loop and the keys call the latest version through this ref.
  const recordRef = useRef(setRecording);
  useEffect(() => {
    recordRef.current = setRecording;
  }, [setRecording]);

  // The clock on the Record button.
  useEffect(() => {
    if (!rec.on) return;
    const timer = setInterval(() => setElapsed(performance.now() - rec.startedAt), 250);
    return () => clearInterval(timer);
  }, [rec]);

  // ---------- keys ----------

  useEffect(() => {
    function onKey(event) {
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.target?.closest?.("select, textarea, input[type=text], input[type=number]")) return;
      const key = event.key.toLowerCase();
      if (key === "r") {
        event.preventDefault();
        recordRef.current(!recRef.current.on);
      } else if (key === "0") {
        event.preventDefault();
        resetAll();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [resetAll]);

  // ---------- hand model ----------

  useEffect(() => {
    let alive = true;
    loadHandTracker()
      .then((tracker) => {
        if (!alive) return;
        trackerRef.current = tracker;
        setModel({ state: "ready", detail: `${tracker.delegate}${tracker.offline ? "" : ", loaded from the internet"}` });
      })
      .catch((error) => alive && setModel({ state: "error", detail: String(error?.message || error) }));
    return () => {
      alive = false;
    };
  }, []);

  // ---------- the tracking loop (once per animation frame) ----------

  const resizeOverlay = useCallback(() => {
    const canvas = overlayRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver(resizeOverlay);
    observer.observe(overlayRef.current);
    return () => observer.disconnect();
  }, [resizeOverlay]);

  const step = useCallback(function frame() {
    rafRef.current = requestAnimationFrame(frame);
    const s = settingsRef.current;
    const state = track.current;
    const video = videoRef.current;
    const picture = pictureRef.current;
    const overlay = overlayRef.current;
    const landmarker = trackerRef.current?.landmarker;
    const now = performance.now();
    if (!video || video.readyState < 2) return;

    const newFrame = video.currentTime !== state.lastVideoTime;
    if (newFrame) {
      state.lastVideoTime = video.currentTime;
      let result = null;
      if (landmarker) {
        try {
          result = landmarker.detectForVideo(video, now);
        } catch (error) {
          console.warn("Hand tracking skipped a frame:", error);
        }
      }
      if (result) {
        const hands = readHands(result);
        const frameSize = { width: video.videoWidth, height: video.videoHeight };
        for (const hand of hands) hand.gaps = fingerGaps(hand, frameSize);
        const { events, ui } = updateGestures(state.gestures, hands, {
          now,
          frame: frameSize,
          reach: s.reach,
          holdMs: s.holdMs,
          look: lookRef.current,
          mirror: s.mirror,
          recording: recRef.current.on,
        });
        for (const event of events) {
          if (event.type === "record") recordRef.current(event.on);
          else if (event.type === "blur") {
            // Back to the last blur you set, or halfway.
            const blur = lookRef.current.blur > 0.005 ? 0 : blurLevelRef.current;
            lookRef.current = { ...lookRef.current, blur };
            state.lookDirty = true;
          } else if (event.type === "look" && lookRef.current[event.control] !== event.value) {
            lookRef.current = { ...lookRef.current, [event.control]: event.value };
            state.lookDirty = true;
          }
        }
        state.hands = hands;
        state.ui = ui;
        state.frames += 1;
      }
    }

    // Finding you in the picture, only while a person effect is on.
    const person = personRef.current;
    const segmenter = segmenterRef.current?.segmenter;
    const personOn = Boolean(segmenter && person) && personEffectsOn(lookRef.current, s.background);
    if (personOn && newFrame) {
      try {
        findPerson(segmenter, video, now, (values, w, h) => person.updateMask(values, w, h));
        if (person.hasMask) person.learnPlate(video);
      } catch (error) {
        console.warn("Person finding skipped a frame:", error);
      }
    }
    const showPerson = personOn && person.hasMask;

    // The recorded picture: redrawn for each new camera frame, or when the look changes.
    if (picture && (newFrame || state.pictureLook !== lookRef.current)) {
      const ctx = picture.getContext("2d");
      if (showPerson) person.draw(ctx, video, lookRef.current, { background: s.background, mirror: s.mirror });
      else drawPicture(ctx, video, lookRef.current);
      state.pictureLook = lookRef.current;
    }

    // Gestures move the look sliders below the stage too, ten times a second.
    if (state.lookDirty && now - state.lookShownAt >= 100) {
      state.lookDirty = false;
      state.lookShownAt = now;
      setLookState(lookRef.current);
    }

    if (overlay) {
      drawStage(overlay.getContext("2d"), {
        width: overlay.width,
        height: overlay.height,
        dpr: window.devicePixelRatio || 1,
        hands: state.hands,
        ui: state.ui,
        guide: s.guide,
        mirror: s.mirror,
        reach: s.reach,
        now,
        rec: recRef.current,
        flash: state.flash,
        look: lookRef.current,
        // Hands are drawn where they're shown, which moves when you do.
        place: showPerson ? (point) => person.place(point, lookRef.current, s.mirror) : null,
      });
    }

    if (now - state.since >= 500) {
      const fps = state.since ? Math.round((state.frames * 1000) / (now - state.since)) : 0;
      const handsInView = state.hands.length;
      state.frames = 0;
      state.since = now;
      setLive((old) => (old.fps === fps && old.hands === handsInView ? old : { hands: handsInView, fps }));
    }
  }, []);

  // ---------- camera ----------

  const stopCamera = useCallback(() => {
    if (recRef.current.on) stopRecording();
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    const state = track.current;
    state.hands = [];
    state.lastVideoTime = -1;
    state.ui = [];
    state.gestures = createGestureState();
    const overlay = overlayRef.current;
    overlay?.getContext("2d").clearRect(0, 0, overlay.width, overlay.height);
    if (videoRef.current) videoRef.current.srcObject = null;
  }, [stopRecording]);

  // On leaving the page, or when the code is edited and hot-reloads, turn the
  // camera and microphone off and show the Start button again.
  useEffect(
    () => () => {
      stopCamera();
      setCamera({ state: "off", error: "" });
      setLive({ hands: 0, fps: 0 });
    },
    [stopCamera],
  );

  async function startCamera(id = deviceId) {
    setCamera({ state: "starting", error: "" });
    stopCamera();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          ...(id ? { deviceId: { exact: id } } : { facingMode: "user" }),
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      streamRef.current = stream;
      const video = videoRef.current;
      video.srcObject = stream;
      await video.play();
      const picture = pictureRef.current;
      picture.width = video.videoWidth || 1280;
      picture.height = video.videoHeight || 720;
      personRef.current?.resize(picture.width, picture.height);
      setAspect(picture.width / picture.height);
      const cameras = (await navigator.mediaDevices.enumerateDevices()).filter((d) => d.kind === "videoinput");
      setDevices(cameras);
      setDeviceId(stream.getVideoTracks()[0]?.getSettings().deviceId || id);
      setCamera({ state: "on", error: "" });
      requestAnimationFrame(resizeOverlay);
      rafRef.current = requestAnimationFrame(step);
    } catch (error) {
      stopCamera();
      setCamera({ state: "error", error: cameraErrorText(error) });
    }
  }

  function turnOff() {
    stopCamera();
    setCamera({ state: "off", error: "" });
    setLive({ hands: 0, fps: 0 });
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else wrapRef.current?.requestFullscreen?.();
  }

  // ---------- page ----------

  let status = { kind: "wait", text: "Loading the hand model…" };
  if (notice) status = { kind: "warn", text: notice };
  else if (model.state === "error") status = { kind: "warn", text: `The hand model didn't load: ${model.detail}` };
  else if (camera.state === "on" && model.state === "loading") status = { kind: "wait", text: "Camera on. Loading the hand model…" };
  else if (camera.state === "on") {
    const handsText = live.hands === 0 ? "No hands in view" : live.hands === 1 ? "1 hand" : "2 hands";
    status = { kind: live.hands ? "live" : "idle", text: `${handsText} · ${live.fps} fps` };
  } else if (model.state === "ready") status = { kind: "idle", text: `Ready (${model.detail})` };

  const warnings = [];
  if (!support.filter) warnings.push("This browser can't change the picture's look, so the look controls won't show in the picture. Try Chrome, Edge or Firefox.");

  return (
    <div className={styles.root}>
    <div className="app">
      <header className="top">
        <div>
          <h2 className="gc-title">Gesture camera</h2>
          <p className="lede">Thumbs up lights REC, thumbs down stops it. Pinch to change the light. Pinch with both hands to grab yourself. A peace sign blurs the background.</p>
        </div>
        <p className={`status status-${status.kind}`} role="status">
          {status.text}
        </p>
      </header>

      <section ref={wrapRef} className="stage-wrap" style={{ "--ar": aspect }} aria-label="Camera">
        <div className="stage">
          <video ref={videoRef} className="source" playsInline muted />
          <canvas ref={pictureRef} className={`picture${settings.mirror ? " mirrored" : ""}`} />
          <canvas ref={overlayRef} className="overlay" />
          {camera.state !== "on" && (
            <div className="stage-cover">
              <button type="button" className="primary big" onClick={() => startCamera()} disabled={camera.state === "starting"}>
                {camera.state === "starting" ? "Starting…" : "Start camera"}
              </button>
              <p className={camera.error ? "error" : ""}>
                {camera.error || "The camera picture and the tracking stay in this browser. Nothing is recorded or sent anywhere."}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="controls" aria-label="Settings">
        <button
          type="button"
          className={`rec${rec.on ? " on" : ""}`}
          onClick={toggleRecording}
          disabled={camera.state !== "on"}
          title="Or press R. Lights the REC light; nothing is recorded here."
        >
          <span className="rec-dot" aria-hidden="true" />
          {rec.on ? `Stop ${clock(elapsed)}` : "Record"}
        </button>
        {camera.state === "on" && (
          <button type="button" onClick={turnOff}>
            Stop camera
          </button>
        )}
        {devices.length > 1 && (
          <label className="field">
            <span>Camera</span>
            <select
              value={deviceId}
              onChange={(e) => {
                setDeviceId(e.target.value);
                startCamera(e.target.value);
              }}
            >
              {devices.map((d, i) => (
                <option key={d.deviceId || i} value={d.deviceId}>
                  {d.label || `Camera ${i + 1}`}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="field" title="How close thumb and fingertip must get, as a share of the hand's size. Higher pinches sooner.">
          <span>Reach</span>
          <input type="range" min="0.15" max="0.5" step="0.01" value={settings.reach} onChange={(e) => set("reach", Number(e.target.value))} />
          <output>{Math.round(settings.reach * 100)}%</output>
        </label>
        <label className="field" title="How long to hold the record pinch before recording starts or stops.">
          <span>Hold</span>
          <input type="range" min="0.2" max="1.5" step="0.05" value={settings.holdMs / 1000} onChange={(e) => set("holdMs", Math.round(Number(e.target.value) * 1000))} />
          <output>{(settings.holdMs / 1000).toFixed(2)} s</output>
        </label>
        <label className="check" title="Flips the picture on screen like a mirror.">
          <input type="checkbox" checked={settings.mirror} onChange={(e) => set("mirror", e.target.checked)} />
          Mirror
        </label>
        <label className="check" title="A one-line guide to the gestures along the bottom of the stage.">
          <input type="checkbox" checked={settings.guide} onChange={(e) => set("guide", e.target.checked)} />
          Guide on stage
        </label>
        <button type="button" onClick={toggleFullscreen}>
          Full screen
        </button>
      </section>

      {warnings.length > 0 && (
        <div className="warnings">
          {warnings.map((w) => (
            <p key={w}>{w}</p>
          ))}
        </div>
      )}

      <section className="panel gestures-panel" aria-labelledby="gestures-title">
        <div className="panel-head">
          <h2 id="gestures-title">Gestures</h2>
          <p className="hint">Either hand. A pinch is your thumb touching your index fingertip.</p>
        </div>
        <ul className="gesture-list">
          {GESTURES.map((g) => (
            <li key={g.id}>
              <span className="gesture-icon" aria-hidden="true">
                {g.icon}
              </span>
              <strong>{g.does}</strong>
              <span>{g.name}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="panels">
        <section className="panel" aria-labelledby="look-title">
          <div className="panel-head">
            <h2 id="look-title">Look</h2>
            <button type="button" className="small" onClick={() => setLook(resetGroup(lookRef.current, "look"))}>
              Reset look
            </button>
          </div>
          <Sliders ids={GROUP_IDS.look} look={look} onChange={(id, value) => setLook({ ...lookRef.current, [id]: value })} />
        </section>

        <section className="panel" aria-labelledby="you-title">
          <div className="panel-head">
            <h2 id="you-title">You</h2>
            <button type="button" className="small" onClick={() => setLook(resetGroup(lookRef.current, "you"))}>
              Reset
            </button>
          </div>
          <div className="look">
            <label className="look-row" style={{ "--c": "var(--text)" }}>
              <span>Background</span>
              <select className="wide-select" value={settings.background} onChange={(e) => set("background", e.target.value)}>
                {Object.entries(BACKGROUNDS).map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <Sliders ids={GROUP_IDS.you} look={look} onChange={(id, value) => setLook({ ...lookRef.current, [id]: value })} />
          <p className="hint you-hint">{BACKGROUND_HINTS[settings.background]}</p>
          <div className="you-foot">
            <button
              type="button"
              className="small"
              disabled={camera.state !== "on" || person.state !== "ready"}
              onClick={() => personRef.current?.capturePlate(videoRef.current)}
              title="Takes the camera picture as it is now as the empty stage."
            >
              Capture empty stage
            </button>
            <span className={`person-state person-${person.state}`}>
              {person.state === "off" && "Finding you starts when you use one of these."}
              {person.state === "loading" && "Loading the person model…"}
              {person.state === "ready" && `Finding you (${person.detail})`}
              {person.state === "error" && `The person model didn't load: ${person.detail}`}
            </span>
          </div>
        </section>
      </div>

      <footer className="foot">
        <p>
          Keys: <kbd>R</kbd> turns the REC light on and off, <kbd>0</kbd> puts everything back to normal. In this copy nothing is
          recorded or saved: the REC light and its clock show the thumbs-up and thumbs-down gestures working. The original records
          takes in the browser tab for you to download.
        </p>
      </footer>
    </div>
    </div>
  );
}

// A slider for each control, which gestures move too.
function Sliders({ ids, look, onChange }) {
  return (
    <div className="look">
      {ids.map((id) => {
        const c = LOOK_CONTROLS[id];
        return (
          <label className="look-row" key={id} style={{ "--c": c.color }}>
            <span>{c.label}</span>
            <input type="range" min={c.min} max={c.max} step={c.step} value={look[id]} onChange={(e) => onChange(id, Number(e.target.value))} />
            <output>{c.format(look[id])}</output>
          </label>
        );
      })}
    </div>
  );
}
