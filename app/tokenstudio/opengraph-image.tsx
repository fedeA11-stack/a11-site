import { caseStudyOgImage, size, contentType } from "../og";

export { size, contentType };
export const alt = "TokenStudio — A11 Product Studio case study";

export default function Image() {
  return caseStudyOgImage("TokenStudio", "Invest across real-world assets");
}
