'use client';

import { useEffect } from 'react';

export default function SpectrogramShell() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // React's StrictMode (and dev-time double-invoke) would otherwise re-run
    // the legacy bootstrap, which builds a fresh AudioContext and binds
    // global listeners on every call. One-shot guard until the rewrite
    // makes those side effects properly cleanupable.
    if (window.__spectrogramBooted) return;
    window.__spectrogramBooted = true;

    let cancelled = false;

    (async () => {
      // jQuery first — the legacy modules expect window.$ / window.jQuery.
      const jq = (await import('jquery')).default;
      window.$ = window.jQuery = jq;

      // o3djs is loaded via <Script strategy="beforeInteractive"> in layout.js,
      // but in dev the script may still be in flight when this effect fires.
      // Poll briefly.
      const start = Date.now();
      while (!window.o3djs && Date.now() - start < 5000) {
        await new Promise((r) => setTimeout(r, 25));
      }
      if (cancelled) return;
      if (!window.o3djs) {
        console.error('o3djs failed to load');
        return;
      }

      // Boot the legacy app. main.js wraps its body in $(fn), so it
      // self-runs once jQuery's DOM-ready fires (DOM is already ready here).
      await import('@/legacy/main.js');
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <canvas id="spectrogram" />
      <canvas id="legend" />
      <div id="iosButton" />

      <div id="record" className="music-box__modal">
        <div className="music-box__modal__message">
          <div className="music-box__modal__record-rings" />
          <div className="music-box__modal__record-rings" />
          <div className="music-box__modal__icon icon-mic" />
        </div>
      </div>

      <div id="drawAnywhere" className="music-box__modal">
        <div className="music-box__modal__message">
          <div className="music-box__hand-animation-sprite" />
        </div>
      </div>

      <div id="loadingSound" className="music-box__modal">
        <div className="music-box__modal__message">
          <div id="loadingMessage" className="music-box__modal__message__text">Flute</div>
          <svg
            className="spinner"
            width="55px"
            height="55px"
            viewBox="0 0 66 66"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="circle"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              cx="33"
              cy="33"
              r="30"
            />
          </svg>
        </div>
      </div>

      <div className="music-box__buttons">
        <div className="music-box__buttons__button" data-mic="" data-name="mic">
          <div className="icon icon-mic" />
        </div>
        <div className="music-box__buttons__button" data-draw="" data-name="draw">
          <div className="icon icon-draw" />
        </div>
        <div
          className="music-box__buttons__button"
          data-name="Flute"
          data-src="/examples/vocal-spectrograms/live/bin/snd/160210_flute_new_cmajor_scale.mp3"
        >
          <div className="icon icon-flute" />
        </div>
        <div
          className="music-box__buttons__button"
          data-name="Harp"
          data-src="/examples/vocal-spectrograms/live/bin/snd/160211_spectrogram_harp_new.mp3"
        >
          <div className="icon icon-harp" />
        </div>
        <div
          className="music-box__buttons__button"
          data-name="Whistling"
          data-src="/examples/vocal-spectrograms/live/bin/snd/160113_whistling.mp3"
        >
          <div className="icon icon-guy" />
        </div>
        <div
          className="music-box__buttons__button"
          data-name="Trombone"
          data-src="/examples/vocal-spectrograms/live/bin/snd/160113_trombone.mp3"
        >
          <div className="icon icon-trombone" />
        </div>
        <div
          className="music-box__buttons__button"
          data-name="Drum machine"
          data-src="/examples/vocal-spectrograms/live/bin/snd/160113_808_loop.mp3"
        >
          <div className="icon icon-808" />
        </div>
        <div
          className="music-box__buttons__button"
          data-name="Birds"
          data-src="/examples/vocal-spectrograms/live/bin/snd/160113_birds.mp3"
        >
          <div className="icon icon-bird" />
        </div>
        <div
          className="music-box__buttons__button"
          data-name="Modem"
          data-src="/examples/vocal-spectrograms/live/bin/snd/160113_modem.mp3"
        >
          <div className="icon icon-computer" />
        </div>
        <div
          className="music-box__buttons__button"
          data-name="Wine glass"
          data-src="/examples/vocal-spectrograms/live/bin/snd/160113_wine_glass.mp3"
        >
          <div className="icon icon-wine" />
        </div>
        <div
          className="music-box__buttons__button"
          data-name="Adele — Someone Like You"
          data-src="/examples/vocal-spectrograms/live/bin/snd/adele_someone_like_you.mp3"
        >
          <div className="icon icon-photo icon-adele" />
        </div>
        <div
          className="music-box__buttons__button"
          data-name="Billie Eilish — What Was I Made For"
          data-src="/examples/vocal-spectrograms/live/bin/snd/billie_what_was_i_made_for.mp3"
        >
          <div className="icon icon-photo icon-billie" />
        </div>
      </div>

      <div id="fileDrop">
        <div className="file-overlay">
          <div className="file-overlay-description" />
        </div>
      </div>
    </>
  );
}
