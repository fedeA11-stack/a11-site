import Link from "next/link";
import NavMenu from "./NavMenu";

// Branded 404. Server Component (Next renders this for unmatched routes and
// explicit notFound() calls). Reuses the shared nav for consistency.
export default function NotFound() {
  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#fff" }}>
      <NavMenu />
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          padding: 24,
          color: "#282328",
          fontFamily: "var(--font-system), sans-serif",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: 0, fontWeight: 500, fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-0.02em" }}>
          Page not found
        </h1>
        <p style={{ margin: 0, maxWidth: 480, opacity: 0.7 }}>
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Link
          href="/"
          style={{
            fontFamily: "inherit", fontSize: 16, padding: "12px 24px",
            borderRadius: 999, border: "1px solid #282328", color: "#282328",
            textDecoration: "none",
          }}
        >
          Back to work
        </Link>
      </main>
    </div>
  );
}
