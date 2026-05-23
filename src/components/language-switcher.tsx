"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export function LanguageSwitcher() {
  const [locale, setLocale] = useState<"en" | "hi">("en");

  useEffect(() => {
    // Read current locale from cookie
    const currentLocale = getCookie("NEXT_LOCALE") || "en";
    setLocale(currentLocale as "en" | "hi");
  }, []);

  const toggleLanguage = () => {
    const newLocale = locale === "en" ? "hi" : "en";
    
    // Set cookie for language preference
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Update state
    setLocale(newLocale);
    
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
