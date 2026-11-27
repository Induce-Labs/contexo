import { auth } from "@/lib/auth/server";

export default auth.middleware({
  loginUrl: "/auth/sign-in",
});

export const config = {
  matcher: [
    "/categories",
    "/categories/:path*",
    "/recents",
    "/recents/:path*",
    "/connections",
    "/connections/:path*",
  ],
};
