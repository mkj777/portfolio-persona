import type { ReactNode } from "react";
import { LanguageProvider } from "@/lib/i18n";
import { ScrollProvider } from "@/lib/scroll";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <ScrollProvider>{children}</ScrollProvider>
    </LanguageProvider>
  );
}
