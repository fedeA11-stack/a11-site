"use client";

interface PhoneVideoProps {
  src: string;
  /** Background color of the outer container */
  bg?: string;
  /** Border-radius of the outer container */
  radius?: string;
}

export default function PhoneVideo({ src, bg = "#F0EBE5", radius }: PhoneVideoProps) {
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
          src={src}
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
