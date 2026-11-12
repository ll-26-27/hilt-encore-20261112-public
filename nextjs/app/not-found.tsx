import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="not-found">
      <p className="eyebrow">404 / Not found</p>
      <h1>This page isn’t here.</h1>
      <p>It may have moved, or it may not be written yet.</p>
      <Link href="/">Back to the talk →</Link>
    </main>
  );
}
