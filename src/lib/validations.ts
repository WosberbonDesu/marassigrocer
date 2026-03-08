import { z } from "zod";

export const rfqFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(5, "Phone number is required"),
  company: z.string().min(2, "Company name is required"),
  country: z.string().min(2, "Country is required"),
  buyerType: z.enum(["distributor", "retail", "small_business", "brand_owner", "partner"]),
  categories: z.array(z.string()).optional(),
  containerEstimate: z.enum(["20ft", "40ft", "not_sure"]).optional(),
  targetPrice: z.string().optional(),
  notes: z.string().optional(),
  source: z.enum(["home", "products", "catalog", "private_label", "contact"]).optional(),
});

export const catalogLeadSchema = z.object({
  email: z.string().email("Valid email is required"),
  company: z.string().min(2, "Company name is required"),
  country: z.string().min(2, "Country is required"),
  buyerType: z.string().min(1, "Buyer type is required"),
});

export const privateLabelSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(5, "Phone number is required"),
  company: z.string().min(2, "Company name is required"),
  targetCountry: z.string().min(2, "Target country is required"),
  productCategory: z.string().min(1, "Product category is required"),
  expectedQuantity: z.string().min(1, "Expected quantity is required"),
  packagingLanguage: z.string().min(1, "Packaging language is required"),
  targetPriceRange: z.string().optional(),
  timeline: z.string().min(1, "Timeline is required"),
  notes: z.string().optional(),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  company: z.string().min(2, "Company name is required"),
  country: z.string().min(2, "Country is required"),
  buyerType: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type RFQFormValues = z.infer<typeof rfqFormSchema>;
export type CatalogLeadValues = z.infer<typeof catalogLeadSchema>;
export type PrivateLabelValues = z.infer<typeof privateLabelSchema>;
export type ContactFormValues = z.infer<typeof contactFormSchema>;
