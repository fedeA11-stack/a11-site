import ProjectImage from "./ProjectImage";
import NavMenu from "./NavMenu";
import FooterBanner from "./FooterBanner";

const projects = [
  {
    image: "/assets/World.png",
    title: "World",
    subtitle: "9 People. One of the largest mobile wallets in the World.",
    aspectW: 760,
    aspectH: 423,
    href: "/world",
  },
  {
    image: "/assets/Freehold.png",
    title: "Freehold",
    subtitle: "A non-custodial, multi-chain\nDeFi wallet app",
    aspectW: 760,
    aspectH: 423,
  },
  {
    image: "/assets/Realio.png",
    title: "Realio",
    subtitle: "RWA tokenization platform for real-world assets.",
    aspectW: 760,
    aspectH: 423,
  },
  {
    image: "/assets/Tokenisation.png",
    title: "Token Studio",
    subtitle: "RWA tokenization platform for launching and managing on-chain assets.",
    aspectW: 760,
    aspectH: 423,
  },
  {
    image: "/assets/Atlans.png",
    title: "Atlans",
    subtitle: "Discovery platform for places, communities, and real-world perks.",
    aspectW: 760,
    aspectH: 423,
  },
  {
    image: "/assets/Relai.png",
    title: "Relai",
    subtitle: "Bitcoin-only savings app focused on simple self-custody.",
    aspectW: 760,
    aspectH: 423,
  },
];

export default function WorkPage() {
  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>

      {/* ─── Navbar ─── */}
      <NavMenu />

      {/* ─── Project list ─── */}
      {/* Figma: header 115px, first project top 185px → paddingTop 70px   */}
      {/* Projects 613px apart (top-to-top), entry ~537px → gap ~76px      */}
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "70px",
          paddingBottom: "96px",
          gap: "76px",
        }}
      >
        {projects.map((p) => (
          <article
            key={p.title}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              width: "min(760px, calc(100vw - 64px))",
            }}
          >
            <ProjectImage
              image={p.image}
              title={p.title}
              aspectW={p.aspectW}
              aspectH={p.aspectH}
              href={"href" in p ? p.href : undefined}
            />

            {/* Title + subtitle */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                fontFamily: "'TWK Continental', serif",
                fontStyle: "normal",
                fontSize: "20px",
                lineHeight: 1.1,
                letterSpacing: "-0.4px",
                textTransform: "capitalize",
                wordBreak: "break-word",
              }}
            >
              <p style={{ margin: 0, fontWeight: 500, color: "#282328", maxWidth: "365px" }}>
                {p.title}
              </p>
              <p
                style={{
                  margin: 0,
                  fontWeight: 400,
                  color: "rgba(40,35,40,0.3)",
                  maxWidth: "365px",
                  whiteSpace: "pre-wrap",
                }}
              >
                {p.subtitle}
              </p>
            </div>
          </article>
        ))}
      </main>

      {/* ─── Footer banner ─── */}
      <div style={{ margin: "0 32px 32px" }}>
        <FooterBanner />
      </div>
    </div>
  );
}
