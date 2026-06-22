import { caseStudyOgImage, size, contentType } from "../../og";

export { size, contentType };
export const alt = "World Money — A11 Product Studio case study";

export default function Image() {
  return caseStudyOgImage("World Money", "Designing no.1 wallet in the world");
}
