"use client";

import { useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";

type SupportButtonProps = {
  slug: string;
  initialSupportCount: number;
};

export function SupportButton({ slug, initialSupportCount }: SupportButtonProps) {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const [supportCount, setSupportCount] = useState(initialSupportCount);
  const [isSupporting, setIsSupporting] = useState(false);

  async function handleSupport() {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    setIsSupporting(true);
    try {
      const response = await fetch(`/api/issues/${slug}/support`, { method: "POST" });
      const body = (await response.json()) as { error?: string; supportCount?: number };

      if (!response.ok) {
        throw new Error(body.error || "Failed to support the issue.");
      }

      startTransition(() => {
        if (typeof body.supportCount === "number") {
          setSupportCount(body.supportCount);
        }
      });
      router.refresh();
    } catch (error) {
      // Keep the button responsive; the page refresh can recover if needed.
      console.error(error);
    } finally {
      setIsSupporting(false);
    }
  }

  return (
    <Button
      onClick={handleSupport}
      disabled={!isLoaded || isSupporting}
      className="rounded-full bg-slate-950 px-5 text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
    >
      <Heart className="mr-1.5 h-4 w-4" />
      Support ({supportCount})
    </Button>
  );
}
