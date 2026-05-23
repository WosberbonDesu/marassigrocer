import { cache } from "react";
import { db } from "@/lib/db";

export type SiteConfigData = {
  whatsapp: string | null;
  email: string | null;
  companyName: string | null;
  offices: unknown;
  showPricesPublicly: boolean;
  siteTitle: string | null;
  siteDescription: string | null;
  ogImage: string | null;
  gtmId: string | null;
  metaPixelId: string | null;
  ga4Id: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  youtubeUrl: string | null;
};

const EMPTY: SiteConfigData = {
  whatsapp: null,
  email: null,
  companyName: null,
  offices: null,
  showPricesPublicly: false,
  siteTitle: null,
  siteDescription: null,
  ogImage: null,
  gtmId: null,
  metaPixelId: null,
  ga4Id: null,
  facebookUrl: null,
  instagramUrl: null,
  tiktokUrl: null,
  linkedinUrl: null,
  twitterUrl: null,
  youtubeUrl: null,
};

// Per-request memoization. SiteConfig is small and changes rarely;
// each request hits the DB once.
export const getSiteConfig = cache(async (): Promise<SiteConfigData> => {
  try {
    const config = await db.siteConfig.findUnique({ where: { id: "default" } });
    if (!config) return EMPTY;
    return {
      whatsapp: config.whatsapp,
      email: config.email,
      companyName: config.companyName,
      offices: config.offices,
      showPricesPublicly: config.showPricesPublicly,
      siteTitle: config.siteTitle,
      siteDescription: config.siteDescription,
      ogImage: config.ogImage,
      gtmId: config.gtmId,
      metaPixelId: config.metaPixelId,
      ga4Id: config.ga4Id,
      facebookUrl: config.facebookUrl,
      instagramUrl: config.instagramUrl,
      tiktokUrl: config.tiktokUrl,
      linkedinUrl: config.linkedinUrl,
      twitterUrl: config.twitterUrl,
      youtubeUrl: config.youtubeUrl,
    };
  } catch {
    return EMPTY;
  }
});
