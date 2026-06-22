import { caseStudyOgImage, size, contentType } from "../../og";

export { size, contentType };
export const alt = "World Chat — A11 Product Studio case study";

export default function Image() {
  return caseStudyOgImage("World Chat", "Built for humans to talk to humans");
}
