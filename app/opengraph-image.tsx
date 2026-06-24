import { ImageResponse } from "next/og";

// Open Graph / Twitter share image — rendered at build time.
// Next.js wires this up automatically via the file convention; the same
// image is reused for the Twitter card.
export const alt = "A11 Studio of the Ambitious";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The A11 mark (from public/assets/logo.svg), recolored white for the dark canvas.
const A11_MARK =
  "M35.1116 38.4191C32.9945 38.2461 31.9929 37.5422 31.9929 35.5301V7.99237C31.9929 7.83986 31.8734 7.71667 31.7254 7.71667H24.9728C24.8249 7.71667 24.7053 7.59349 24.7053 7.44097V0.2757C24.7053 0.123185 24.5858 0 24.4379 0H11.1148C10.9669 0 10.8474 0.123185 10.8474 0.2757V7.43804C10.8474 7.59056 10.7278 7.71374 10.5799 7.71374H3.82446C3.67649 7.71374 3.55698 7.83693 3.55698 7.98944V35.5272C3.55698 37.5392 2.55533 38.2431 0.43822 38.4162C0.190654 38.4367 0 38.6479 0 38.906V39.9971H14.41V38.906C14.41 38.6479 14.2194 38.4367 13.9718 38.4162C11.8519 38.2431 10.8502 37.5392 10.8502 35.5272V10.4502C10.9299 8.46458 12.0767 7.83693 14.4129 7.71667H21.1398C23.5586 7.83986 24.7025 8.50858 24.7053 10.6673V35.5301C24.7053 37.5422 23.7009 38.2461 21.5837 38.4191C21.3362 38.4397 21.1427 38.6508 21.1427 38.9089V40H35.5556V38.9089C35.5556 38.6508 35.3621 38.4397 35.1145 38.4191H35.1116Z";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#282328",
          padding: "90px 100px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <svg width="108" height="120" viewBox="0 0 36 40" fill="none">
          <path d={A11_MARK} fill="#ffffff" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.05 }}>
            A11 Studio
          </div>
          <div style={{ fontSize: 40, color: "rgba(255,255,255,0.6)", marginTop: 16 }}>
            Of the Ambitious
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
