// Single source of truth for the studio's external/social links. Previously each
// surface (NavMenu overlay, FooterBanner, contact page + form) hard-coded its own
// list — they drifted in both membership (Cosmos vs Medium) and labels
// ("Twitter" / "Twitter/X" / "X(Twitter)"). Import this everywhere so the set and
// the labels can never diverge again. Hrefs are placeholders ("#") until the real
// profiles exist — update them here once and every surface follows.
export type SocialLink = { label: string; href: string };

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "X (Twitter)", href: "https://x.com/a11studiox" },
  { label: "LinkedIn",    href: "https://www.linkedin.com/company/a11studio/" },
  { label: "Cosmos",      href: "#" },
];
