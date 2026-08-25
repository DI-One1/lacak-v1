import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const ALLOWED_EMAIL = "lacak.smktibazma@gmail.com";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/access-denied(.*)",
  "/api/v1/public(.*)",
]);

export const proxy = clerkMiddleware(async (auth, request) => {
  // ==========================================
  // PUBLIC ROUTES
  // ==========================================
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  // ==========================================
  // CEK LOGIN
  // ==========================================
  const { userId } = await auth();

  if (!userId) {
    return auth.protect();
  }

  // ==========================================
  // AMBIL USER DARI CLERK
  // ==========================================
  const client = await clerkClient();

  const user = await client.users.getUser(userId);

  if (!user) {
    return NextResponse.redirect(
      new URL("/access-denied?reason=unauthorized", request.url)
    );
  }

  // ==========================================
  // AMBIL EMAIL
  // ==========================================
  const emails = user.emailAddresses.map((email) =>
    email.emailAddress.trim().toLowerCase()
  );

  // ==========================================
  // CEK APAKAH EMAIL DIIZINKAN
  // ==========================================
  const isAllowed = emails.includes(ALLOWED_EMAIL);

  console.log("[LACAK AUTH]", {
    userId,
    emails,
    allowedEmail: ALLOWED_EMAIL,
    isAllowed,
    path: request.nextUrl.pathname,
  });

  // ==========================================
  // TOLAK USER LAIN
  // ==========================================
  if (!isAllowed) {
    return NextResponse.redirect(
      new URL("/access-denied?reason=not-allowed", request.url)
    );
  }

  // ==========================================
  // USER DIIZINKAN
  // ==========================================
  return NextResponse.next();
});

export default proxy;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};