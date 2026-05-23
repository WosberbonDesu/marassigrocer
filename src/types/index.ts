export interface PricingTier {
  minQty: number;
  casePrice?: number;
  unitPrice?: number;
}

export interface NutritionRow {
  label: string;
  value: string;
  per?: string;
}

export type ProductStatus = "DRAFT" | "PUBLISHED" | "HIDDEN";

export interface Product {
  id: string;
  slug: string;
  name: string;
  sku?: string;
  brand: Brand;
  category: Category;
  originCountries: string[];
  packaging?: {
    unitType?: "case" | "pallet";
    caseSize?: string;
    casesPerLayer?: number;
    casesPerPallet?: number;
  } | null;
  packDescription?: string;
  unitWeight?: string;
  weight?: string;
  dimensions?: string;
  caseSize?: number | null;
  unitUpc?: string;
  caseUpc?: string;
  variants?: string[];
  cartonDetails?: string;
  loadingInfo?: string;
  exportSuitability?: string;
  relatedProductIds?: string[];
  pricingTiers?: PricingTier[];
  longDescription?: string;
  ingredients?: string;
  allergens?: string[];
  storage?: string;
  nutrition?: NutritionRow[];
  shelfLifeDaysMin?: number;
  shelfLifeDaysMax?: number;
  availability: "in_stock" | "on_request" | "seasonal" | "discontinued";
  images: string[];
  imageAlts?: string[];
  documents?: ProductDocument[];
  moqHint?: string;
  moqQuantity?: number | null;
  moqUnit?: string;
  hazmat?: boolean;
  reeferRequired?: boolean;
  description?: string;
  specs?: Record<string, string>;
  seo?: { title: string; description: string };
  featured?: boolean;
  status?: ProductStatus;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  logo: string;
  origin: string;
  description: string;
}

export interface ProductDocument {
  id: string;
  title: string;
  type: "COO" | "COA" | "spec_sheet" | "other";
  fileUrl: string;
  language: string;
}

export interface Market {
  id: string;
  slug: string;
  name: string;
  description: string;
  featuredCategories: string[];
  regulatoryNotes: string;
  caseSnippet: string;
  image: string;
}

export interface Office {
  id: string;
  city: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  mapLink: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  tags: ("logistics" | "private_label" | "products" | "general")[];
}

export interface Insight {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  publishedAt: string;
  image: string;
  readTime: string;
}

export interface RFQItem {
  productId: string;
  productName: string;
  quantity: number;
  notes: string;
}

export interface RFQFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  buyerType: "distributor" | "retail" | "small_business" | "brand_owner" | "partner";
  categories: string[];
  containerEstimate: "20ft" | "40ft" | "not_sure";
  targetPrice?: string;
  notes: string;
  items: RFQItem[];
  source: "home" | "products" | "catalog" | "private_label" | "contact";
}

export interface CatalogLeadFormData {
  email: string;
  company: string;
  country: string;
  buyerType: string;
}

export interface PrivateLabelFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  targetCountry: string;
  productCategory: string;
  expectedQuantity: string;
  packagingLanguage: string;
  targetPriceRange?: string;
  timeline: string;
  notes: string;
}
