import { caseStudyOgImage, size, contentType } from "../../og";

export { size, contentType };
export const alt = "World ID — A11 Product Studio case study";

export default function Image() {
  return caseStudyOgImage("World ID", "Are you real human?");
}
