"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const [locale, setLocale] = useState<"en" | "hi">("en");

  const toggleLanguage = () => {
    const newLocale = locale === "en" ? "hi" : "en";
    setLocale(newLocale);
    
    // Set cookie for language preference
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    
    // Reload page to apply new language
    window.location.reload();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2"
      title={locale === "en" ? "Switch to Hindi" : "अंग्रेजी में बदलें"}
    >
      <Globe className="h-4 w-4" />
      <span className="text-sm font-medium">{locale === "en" ? "हिन्दी" : "English"}</span>
    </Button>
  );
}
