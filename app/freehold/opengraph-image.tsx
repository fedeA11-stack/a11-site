import { caseStudyOgImage, size, contentType } from "../og";

export { size, contentType };
export const alt = "Freehold · A11 Studio case study";

export default function Image() {
  return caseStudyOgImage("Freehold", "Invest and manage on the move");
}
