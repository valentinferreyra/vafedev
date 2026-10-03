import type { Metadata } from "next";
import { ContactChannels } from "@/components/contact-channels";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Valentín Ferreyra.",
};

export default function ContactPage() {
  return (
    <section className="profile-page">
      <p className="eyebrow">Contact</p>
      <h1>Let’s talk</h1>
      <p>Have a question, an idea, or just want to say hello?</p>
      <ContactChannels />
    </section>
  );
}
