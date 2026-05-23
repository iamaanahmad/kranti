import { SignIn } from "@clerk/nextjs";

interface Props {
  searchParams: Promise<{ redirect_url?: string }>;
}

export default async function SignInPage({ searchParams }: Props) {
  const { redirect_url } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f1ea] px-6 py-12 dark:bg-slate-950">
      <SignIn
        path="/sign-in"
        routing="path"
        // After sign-in, redirect back to the page the user came from
        forceRedirectUrl={redirect_url || "/dashboard"}
        fallbackRedirectUrl="/dashboard"
      />
    </div>
  );
}
