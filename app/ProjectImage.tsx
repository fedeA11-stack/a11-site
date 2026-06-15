import Link from "next/link";

interface Props {
  image: string;
  title: string;
  aspectW: number;
  aspectH: number;
  href?: string;
}

export default function ProjectImage({ image, title, aspectW, aspectH, href }: Props) {
  const inner = (
    <div
      data-cursor="View project"
      style={{
        width: "100%",
        aspectRatio: `${aspectW} / ${aspectH}`,
        position: "relative",
        overflow: "hidden",
        cursor: href ? "none" : "default",
        display: "block",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={title}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "fill",
          display: "block",
        }}
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href} style={{ display: "block" }}>
        {inner}
      </Link>
    );
  }

  return inner;
}
