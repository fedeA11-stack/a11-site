import { caseStudyOgImage, size, contentType } from "../og";

export { size, contentType };
export const alt = "Districts — A11 Product Studio case study";

export default function Image() {
  return caseStudyOgImage("Districts", "Designing a world you can own");
}
