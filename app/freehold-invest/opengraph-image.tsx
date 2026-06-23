import { caseStudyOgImage, size, contentType } from "../og";

export { size, contentType };
export const alt = "Freehold Invest — A11 Product Studio case study";

export default function Image() {
  return caseStudyOgImage("Freehold Invest", "Invest across real-world assets");
}
