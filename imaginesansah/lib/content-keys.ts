export interface ContentField {
  key: string;
  label: string;
  section: string;
  type: "text" | "textarea";
  placeholder?: string;
}

/**
 * Every free-text copy block the public site reads from `site_content`.
 * Structured fields (WhatsApp number, email, social links, SEO) live in
 * `site_settings` instead and are edited on the Settings page — this list
 * is deliberately just prose the owner would want to rewrite without
 * touching code.
 */
export const CONTENT_FIELDS: ContentField[] = [
  {
    key: "intro.philosophy",
    label: "Homepage Introduction — Headline",
    section: "Homepage",
    type: "textarea",
    placeholder: "A Ghanaian graphic designer building visual identities that people actually remember.",
  },
  {
    key: "intro.difference",
    label: "Homepage Introduction — Body",
    section: "Homepage",
    type: "textarea",
    placeholder: "Every brief starts with a question: what does this brand look like when it's confident in itself?",
  },
  {
    key: "cta.closing_headline",
    label: "Closing CTA Headline",
    section: "Homepage",
    type: "text",
    placeholder: "Have an idea worth designing?",
  },
  {
    key: "about.biography",
    label: "Biography",
    section: "About",
    type: "textarea",
  },
  {
    key: "about.philosophy",
    label: "Creative Philosophy",
    section: "About",
    type: "textarea",
  },
  {
    key: "about.skills",
    label: "Skills",
    section: "About",
    type: "textarea",
    placeholder: "Brand Identity, Logo Design, Layout, Typography, Art Direction",
  },
  {
    key: "about.tools",
    label: "Software / Tools",
    section: "About",
    type: "text",
    placeholder: "Adobe Illustrator, Photoshop, InDesign, Figma",
  },
  {
    key: "about.experience",
    label: "Experience",
    section: "About",
    type: "textarea",
  },
  {
    key: "footer.tagline",
    label: "Footer Tagline",
    section: "Footer",
    type: "textarea",
    placeholder: "Bold, memorable, meaningful visual identities — for brands ready to look like themselves.",
  },
];
