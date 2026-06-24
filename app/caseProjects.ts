import { type CSProject } from "./CaseStudy";

// Full project dataset. The "All projects" section at the bottom of each case
// study excludes the current page and shows 4 of the rest (see relatedProjects
// in CaseStudy). Previews come from /public/assets/All Projects, matched by title.
// Add new studies here — the section scales automatically.
const NP = "/assets/Next%20project";

export const ALL_PROJECTS: CSProject[] = [
  { name: "World Money",     href: "/world/money",     preview: "/assets/All%20Projects/Money.png",             nextImage: `${NP}/world%20money-case.png`,              logo: `${NP}/world%20money.svg`  },
  { name: "World ID",        href: "/world/id",        preview: "/assets/All%20Projects/ID.png",                nextImage: `${NP}/world%20id-case.png`,                 logo: `${NP}/world%20id.svg`     },
  { name: "World Chat",      href: "/world/chat",      preview: "/assets/All%20Projects/Chat.png",              nextImage: `${NP}/worldchat-case.png`,                  logo: `${NP}/world%20chat.svg`   },
  { name: "Orb App",         href: "/world/orb",       preview: "/assets/All%20Projects/Orb.png",               nextImage: `${NP}/orb%20app-case.png`,                  logo: `${NP}/orb%20app.svg`      },
  { name: "Atlans",          href: "/atlans",          preview: "/assets/All%20Projects/Atlans.png",             nextImage: `${NP}/atlans-case.png`,                     logo: `${NP}/altans.svg`         },
  { name: "Freehold",        href: "/freehold",        preview: "/assets/All%20Projects/Freehold%20Mobile.png", nextImage: `${NP}/freehold-case.png`,                   logo: `${NP}/freehold.svg`       },
  { name: "Relai",           href: "/relai",           preview: "/assets/All%20Projects/Relai.png",              nextImage: `${NP}/relai-case.png`,                      logo: `${NP}/relai.svg`          },
  { name: "Freehold Invest", href: "/freehold-invest", preview: "/assets/All%20Projects/Tokenization.png",      nextImage: `${NP}/freehold%20tokenisation%20-case.png`, logo: `${NP}/freehold.svg`       },
  { name: "Districts",       href: "/districts",       preview: "/assets/All%20Projects/District.png",           nextImage: `${NP}/district-case.png`,                   logo: `${NP}/district.svg`       },
  { name: "Nous",            href: "/nous",            preview: "/assets/All%20Projects/Nous.png",               nextImage: `${NP}/nous-case.png`,                       logo: `${NP}/nous.svg`           },
];
