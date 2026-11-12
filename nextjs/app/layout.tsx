import "@fontsource-variable/inter";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { SiteFooter, SiteHeader } from "./components/Chrome";

export const metadata: Metadata = {
  title: { default: "What We Learned Teaching Harvard Faculty to Build with AI", template: "%s · HILT Encore 2026" },
  description: "The Learning Lab at the 2026 HILT Encore Event, November 12, 2026.",
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#121412",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
