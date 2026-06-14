import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "tr", "ar", "ru", "es", "de", "it", "pt", "fr"],
  defaultLocale: "en",
});
