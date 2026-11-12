# Embedded spectrogram

Source: https://github.com/ll-26-27/spectrogram-next at 059ffc1e44f6dbd9b05de06260ef81288546f3a7.

Adaptations: static export with basePath /examples/vocal-spectrograms/live; asset URLs prefixed to match; Strict Mode disabled for the upstream one-shot bootstrap; English sound labels supplied locally instead of requesting external localization. Upstream source copyright notices remain intact.

Rebuild in this folder with Node 22: `npm ci`, then `npm run build`. Copy the contents of `out/` to `../../public/examples/vocal-spectrograms/live/`. Do not commit node_modules or .next. Upstream has a missing ESLint dependency; compilation and export succeed, but that lint step is not available.
