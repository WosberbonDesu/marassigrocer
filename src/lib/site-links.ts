// Shared site-wide links and constants.
// Update here, propagates to every CTA / button / footer.

export const WHATSAPP_PHONE = "201508557741";

export const WHATSAPP_URL = (
  message = "Hi! I'm interested in your FMCG products. Can I get a catalog and pricing?"
) => `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;

export const CATALOG_PDF = "/marassi-catalog.pdf";

export const SOCIAL_URLS = {
  instagram: "https://www.instagram.com/marassigroup/",
  facebook: "https://www.facebook.com/marassigida",
  linkedin: "https://www.linkedin.com/in/marassi-group-fmcg-95739793/",
} as const;
