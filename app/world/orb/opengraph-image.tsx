import { caseStudyOgImage, size, contentType } from "../../og";

export { size, contentType };
export const alt = "Orb App · A11 Studio case study";

export default function Image() {
  return caseStudyOgImage("Orb App", "Designing clarity at global scale");
}
