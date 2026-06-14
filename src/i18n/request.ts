import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { hasLocale } from "next-intl";

const messageImports = {
  en: () => import("../messages/en.json"),
  tr: () => import("../messages/tr.json"),
  ar: () => import("../messages/ar.json"),
  ru: () => import("../messages/ru.json"),
  es: () => import("../messages/es.json"),
  de: () => import("../messages/de.json"),
  it: () => import("../messages/it.json"),
  pt: () => import("../messages/pt.json"),
  fr: () => import("../messages/fr.json"),
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? (requested as keyof typeof messageImports)
    : routing.defaultLocale;

  const messages = (await messageImports[locale as keyof typeof messageImports]()).default;

  return {
    locale,
    messages,
  };
});
