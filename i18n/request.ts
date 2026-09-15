import { notFound } from "next/navigation";

import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { locale as localeParam } from "next/root-params";

import { routing } from "./routing";

export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    const paramValue = await localeParam();
    if (hasLocale(routing.locales, paramValue)) {
      locale = paramValue;
    } else if (paramValue) {
      notFound();
    } else {
      locale = routing.defaultLocale;
    }
  }

  return {
    locale,
    timeZone: "Asia/Kuala_Lumpur",
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
