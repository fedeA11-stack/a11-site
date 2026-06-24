import { caseStudyOgImage, size, contentType } from "../og";

export { size, contentType };
export const alt = "Relai · A11 Studio case study";

export default function Image() {
  return caseStudyOgImage("Relai", "Making Bitcoin saving feel simple");
}
