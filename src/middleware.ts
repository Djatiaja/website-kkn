import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except:
  // - api routes
  // - admin routes (admin panel doesn't use i18n prefix)
  // - _next (internal Next.js)
  // - static files
  matcher: ["/((?!api|admin|_next|.*\\..*).*)"],
};
