"use client";

interface PhoneVideoProps {
  src: string;
  /** Background color of the outer container */
  bg?: string;
  /** Border-radius of the outer container */
  radius?: string;
  /** Only fetch/play the video when true — parent sets this once the tile is in view */
  active?: boolean;
}

export default function PhoneVideo({ src, bg = "#F0EBE5", radius, active = true }: PhoneVideoProps) {
  return (
    <div
      style={{
        background: bg,
        borderRadius: radius,
        overflow: "hidden",
        aspectRatio: "1599 / 2700",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Phone shell */}
      <div
        style={{
          position: "relative",
          width: "66%",
          aspectRatio: "9 / 19.5",
          background: "transparent",
          borderRadius: "36px",
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          src={active ? src : undefined}
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}
