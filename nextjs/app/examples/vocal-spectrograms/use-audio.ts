"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// One <audio> element per stem; progress is read every animation frame while playing so the playhead tracks the sound.
export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number>(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const tick = useCallback(function step() {
    const el = audioRef.current;
    if (!el) return;
    const t = el.currentTime;
    const d = el.duration;
    setCurrentTime(t);
    setProgress(d ? t / d : 0);
    if (!el.paused) rafRef.current = requestAnimationFrame(step);
  }, []);

  const load = useCallback((src: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      cancelAnimationFrame(rafRef.current);
    }
    const el = new Audio(src);
    el.preload = "metadata";
    audioRef.current = el;
    setPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    el.addEventListener("loadedmetadata", () => setDuration(el.duration));
    el.addEventListener("ended", () => {
      setPlaying(false);
      cancelAnimationFrame(rafRef.current);
      setProgress(1);
    });
  }, []);

  const play = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.play().catch(() => setPlaying(false));
    setPlaying(true);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const pause = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.pause();
    setPlaying(false);
    cancelAnimationFrame(rafRef.current);
  }, []);

  const seek = useCallback((fraction: number) => {
    const el = audioRef.current;
    if (!el || !el.duration) return;
    const f = Math.min(1, Math.max(0, fraction));
    el.currentTime = f * el.duration;
    setCurrentTime(el.currentTime);
    setProgress(f);
    if (!el.paused) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  useEffect(() => () => {
    cancelAnimationFrame(rafRef.current);
    audioRef.current?.pause();
  }, []);

  return { load, play, pause, seek, playing, progress, duration, currentTime };
}
