import QRCode from "qrcode";

// Until Marlon deploys and CX puts the short link in content/home.md (`url`), the QR code opens this site's public repo.
export const FALLBACK_URL = "https://github.com/ll-26-27/hilt-encore-20261112-public";

export async function qrSvg(url: string) {
  return QRCode.toString(url || FALLBACK_URL, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#121412", light: "#ffffff" } });
}

export function displayUrl(url: string) {
  return (url || FALLBACK_URL).replace(/^https?:\/\//, "").replace(/\/$/, "");
}
