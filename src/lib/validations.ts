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
  promoCode: z.string().optional(),
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
  phone: z.string().min(5, "Phone is required"),
  company: z.string().min(2, "Company name is required"),
  country: z.string().min(2, "Country is required"),
  inquiryType: z.string().min(1, "Please select an inquiry type"),
  productCategory: z.string().optional(),
  subject: z.string().optional(),
  buyerType: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const quoteRequestSchema = z.object({
  // Company information
  fullName: z.string().min(2, "Full name is required"),
  companyName: z.string().min(2, "Company name is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().optional(),
  email: z.string().email("Valid email is required"),
  phoneCountry: z.string().optional(),
  phone: z.string().min(5, "Phone is required"),
  buyerType: z.string().min(1, "Buyer type is required"),
  buyerRole: z.string().optional(),

  // Product requirements
  productCategories: z.string().optional(),
  productNames: z.string().optional(),
  brandPreference: z.string().optional(),
  quantityMoq: z.string().optional(),
  packagingType: z.string().optional(),
  privateLabel: z.enum(["yes", "no"]).optional(),
  targetPrice: z.string().optional(),

  // Export details
  destinationCountry: z.string().min(1, "Destination country is required"),
  shippingMethod: z.string().optional(),
  mixedContainer: z.enum(["yes", "no"]).optional(),
  requiredDocuments: z.string().optional(),
  timeline: z.string().optional(),

  // Notes
  notes: z.string().optional(),
});

export type RFQFormValues = z.infer<typeof rfqFormSchema>;
export type CatalogLeadValues = z.infer<typeof catalogLeadSchema>;
export type PrivateLabelValues = z.infer<typeof privateLabelSchema>;
export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type QuoteRequestValues = z.infer<typeof quoteRequestSchema>;
