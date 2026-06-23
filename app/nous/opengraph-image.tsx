import { caseStudyOgImage, size, contentType } from "../og";

export { size, contentType };
export const alt = "Nous — A11 Product Studio case study";

export default function Image() {
  return caseStudyOgImage("Nous", "Designing a shared intelligence layer");
}
