import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectRoutes = createRouteMatcher(["/"]);

export default clerkMiddleware((auth, req) => {
  if (isProtectRoutes(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
