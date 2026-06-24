import type { Metadata } from "next";
import NavMenu from "../NavMenu";
import PageEnter from "../PageEnter";
import ContactForm from "./ContactForm";
import CopyEmail from "./CopyEmail";

export const metadata: Metadata = {
  title: "Let's Talk",
  description: "Got an idea we can help with? Want to join our team? Reach out to A11 Product Studio.",
  alternates: { canonical: "/contact" },
};

const BG = "#302424";
const FONT = "var(--font-system), sans-serif";

const SOCIALS = [
  { label: "X(Twitter)", href: "https://x.com/a11studiox" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/a11studio/posts/?feedView=all" },
  { label: "Cosmos", href: "#" },
];

export default function ContactPage() {
  return (
    <>
    <style>{`
      body { overflow-x: hidden; background: ${BG}; }
      .contact-form input::placeholder,
      .contact-form textarea::placeholder { color: rgba(255,255,255,0.35); }
      .contact-form input, .contact-form textarea { caret-color: #ffffff; }
    `}</style>

    <div className="relative w-full flex flex-col bg-[#302424] min-h-screen overflow-x-hidden md:h-screen md:overflow-hidden">
      <NavMenu theme="dark" />

      <PageEnter className="md:flex-1 md:min-h-0 relative z-[1]">
        <main className="flex flex-col md:flex-row md:h-full px-5 md:px-8 lg:px-10 pb-5 md:pb-0">

          {/* ── Left column: headline · address · social ── */}
          {/*
              Desktop: column padding-top (vw) pushes headline down from nav.
              As you shrink the window, vw shrinks → gaps compress proportionally.
              Social stays pinned to bottom via absolute.
          */}
          <div className="md:[flex:788_788_0] md:relative md:min-w-0 md:h-full md:pt-[clamp(60px,7.94vw,120px)]">

            {/* Headline */}
            <h1
              className="font-medium
                         leading-[0.95] md:leading-[1.1]
                         tracking-[-0.05em] md:tracking-[-0.03em]
                         whitespace-pre-line text-white m-0
                         mt-14 md:mt-0
                         text-[44px] lg:text-[clamp(44px,5.29vw,80px)]"
              style={{ fontFamily: FONT }}
            >
              {"We'd love to\nhear from you"}
            </h1>

            {/* Address — gap scales with vw so it compresses as window narrows */}
            <address
              className="not-italic mt-14 md:mt-[clamp(48px,6.35vw,96px)]"
            >
              {/* Worldwide presence copy */}
              <div className="flex flex-col gap-2">
                <p
                  className="font-normal leading-[1.4] m-0 text-[20px]"
                  style={{ fontFamily: FONT, color: "rgba(255,255,255,0.5)" }}
                >
                  Global product studio.
                </p>
                <p
                  className="text-white font-normal leading-[1.4] m-0 text-[20px]"
                  style={{ fontFamily: FONT }}
                >
                  San Francisco · Barcelona · Dubai
                </p>
              </div>

              {/* Email */}
              <p className="font-normal leading-[1.4] mt-10 text-[20px] m-0">
                <CopyEmail email="hello@a11.studio" fontFamily={FONT} />
              </p>
            </address>

            {/* Divider — mobile only */}
            <div className="block md:hidden mt-14 border-t border-white/20" />

            {/* Social — desktop only, pinned to bottom */}
            <div
              className="hidden md:flex gap-6 md:absolute md:left-0"
              style={{ bottom: "clamp(20px, 3.80vh, 41px)" }}
            >
              {SOCIALS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  style={{
                    fontFamily: FONT,
                    fontWeight: 400,
                    fontSize: 16,
                    lineHeight: 1,
                    color: "#a8a8a8",
                    textDecoration: "none",
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* ── Right column: subtitle · form (client) · mobile social ── */}
          {/*
              Desktop: column padding-top (vw) pushes subtitle down proportionally.
              Form margin-top is fixed px — so subtitle↔form gap stays constant
              even as the subtitle font or column padding changes.
          */}
          <div className="md:[flex:644_644_0] md:relative md:min-w-0 md:h-full md:pt-[clamp(100px,14.15vw,214px)]">

            {/* Subtitle */}
            <p
              className="text-white font-normal leading-[1.4] m-0
                         mt-14 md:mt-0
                         text-[20px]
                         w-full md:w-[clamp(300px,34.3vw,519px)]"
              style={{ fontFamily: FONT }}
            >
              Got an idea we can help with? Want to join our team?{" "}
              Here&apos;s how you can reach us.
            </p>

            {/* Form + mobile social (client component) */}
            <ContactForm />
          </div>
        </main>
      </PageEnter>
    </div>
    </>
  );
}
