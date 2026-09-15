import { getTranslations } from "next-intl/server";

import { MarketingHeader } from "@/components/marketing-header";

type Props = {
  children: React.ReactNode;
};

export default async function MarketingLayout({ children }: Props) {
  const t = await getTranslations("HomePage");

  return (
    <div className="flex min-h-svh flex-col">
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t px-6 py-4 text-xs text-muted-foreground">
        {t("title")}
      </footer>
    </div>
  );
}
