import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "StatusPass — F-1, CPT, OPT & STEM OPT compliance organizer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "#F7F4EE",
          color: "#1E3A5F",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#2A9D8F",
            marginBottom: 16,
            fontWeight: 600,
          }}
        >
          StatusPass
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.15 }}>
          One next action for F-1, CPT, OPT, and STEM clocks.
        </div>
        <div style={{ marginTop: 28, fontSize: 28, color: "#5C6773" }}>
          Compliance organizer · not a law firm or DSO · Founded by DINESH S
        </div>
      </div>
    ),
    { ...size },
  );
}
