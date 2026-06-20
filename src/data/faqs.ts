import { FAQ } from "@/types";

// FAQs only carry id + tags here. The question/answer text lives in
// src/messages/{locale}.json under `faqPage.items.{id}.{question|answer}`
// so every UI language renders natively.
export const faqs: FAQ[] = [
  { id: "faq-1", question: "", answer: "", tags: ["products", "general"] },
  { id: "faq-2", question: "", answer: "", tags: ["logistics"] },
  { id: "faq-3", question: "", answer: "", tags: ["logistics"] },
  { id: "faq-4", question: "", answer: "", tags: ["logistics"] },
  { id: "faq-5", question: "", answer: "", tags: ["logistics"] },
  { id: "faq-6", question: "", answer: "", tags: ["private_label"] },
  { id: "faq-7", question: "", answer: "", tags: ["private_label"] },
  { id: "faq-8", question: "", answer: "", tags: ["general"] },
  { id: "faq-9", question: "", answer: "", tags: ["general"] },
  { id: "faq-10", question: "", answer: "", tags: ["products"] },
];
