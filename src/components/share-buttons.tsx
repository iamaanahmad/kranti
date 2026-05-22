"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/issues/${slug}`;
    }
    return `https://kranti.org.in/issues/${slug}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handleWhatsApp = () => {
    const url = getShareUrl();
    const text = encodeURIComponent(
      `✊ *Civic Action Alert on Kranti* ✊\n\n*${title}*\n\nThis issue needs our collective backing. Please review the documented evidence, support this petition, and sign it here:\n👉 ${url}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="rounded-full gap-1.5 border-slate-900/10 bg-white/80 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-emerald-600 animate-in fade-in zoom-in-75 duration-200" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 text-slate-500" />
            <span>Copy Link</span>
          </>
        )}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleWhatsApp}
        className="rounded-full gap-1.5 border-emerald-300/40 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-950/20 dark:bg-emerald-950/20 dark:text-emerald-300"
      >
        {/* Simple inline SVG for WhatsApp logo */}
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.714-1.465L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.757-4.306 9.761-9.609.002-2.568-1.002-4.985-2.824-6.808C16.388 2.368 13.974 1.365 11.99 1.365c-5.404 0-9.76 4.307-9.764 9.61-.001 1.702.447 3.366 1.301 4.81l-.886 3.237 3.325-.868zm11.367-7.84c-.345-.172-2.039-1.002-2.35-.115c-.31.888-1.205 1.112-1.48 1.424-.275.313-.55.344-.895.172-1.485-.742-2.484-1.637-3.326-3.083-.223-.385.223-.357.638-1.18.415-.823-.207-1.515-.483-2.064c-.276-.55-.895-2.05-.12-2.112c.775-.062 1.483.47 1.483.47s.414 1.162.775 1.57c.362.41 1.485 2.196.223 3.376-1.262 1.18-.896 1.44-.07 2.268.827.828 2.24 1.83 3.204 1.636c.966-.192 1.207-1.11 1.655-1.393.448-.284.897-.14 1.24.03l1.933.955c.345.173.58.258.665.404.086.146.086.845-.258 1.833z" />
        </svg>
        <span>WhatsApp Share</span>
      </Button>
    </div>
  );
}
