import { caseStudyOgImage, size, contentType } from "../og";

export { size, contentType };
export const alt = "Atlans — A11 Product Studio case study";

export default function Image() {
  return caseStudyOgImage("Atlans", "Bringing athletes, places and communities together");
}
