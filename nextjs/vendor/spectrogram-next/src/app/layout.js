import Script from 'next/script';
import './globals.scss';

export const metadata = {
  title: '3D Spectrogram',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/*
          Original `bundle.js` from gulp — concatenated o3djs/{base,math,quaternions,shader}.js.
          Loaded with `beforeInteractive` so window.o3djs exists before the spectrogram
          client component mounts.
        */}
        <Script src="/examples/vocal-spectrograms/live/legacy-libs/o3djs-bundle.js" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}
