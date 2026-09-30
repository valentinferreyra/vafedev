import { ImageResponse } from "next/og";

import { SITE_NAME } from "@/lib/site";

export const alt = `${SITE_NAME}, Software Developer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#f1f3f0",
        color: "#182123",
        padding: "72px",
      }}
    >
      <div style={{ display: "flex", fontSize: 24, letterSpacing: 2 }}>VF/DEV</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 500 }}>{SITE_NAME}</div>
        <div style={{ display: "flex", color: "#557477", fontSize: 30 }}>
          Software Developer
        </div>
      </div>
      <div style={{ display: "flex", color: "#557477", fontSize: 22 }}>
        vafedev.me
      </div>
    </div>,
    size,
  );
}
