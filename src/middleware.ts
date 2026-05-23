import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/issue/new(.*)",
  "/petition/new(.*)",
  "/campaign/new(.*)",
  "/report/new(.*)",
  "/admin(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    const { userId } = await auth();

    if (!userId) {
      // Build the redirect URL: /sign-in?redirect_url=<current path>
      const { pathname, search } = request.nextUrl;
      const redirectUrl = new URL("/sign-in", request.url);
      redirectUrl.searchParams.set("redirect_url", `${pathname}${search}`);
      return NextResponse.redirect(redirectUrl);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
