import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { CONSENT, parseConsentCookie } from "./lib/preferences";

const handleI18n = createMiddleware(routing);

export function proxy(request, event) {
  const consent = parseConsentCookie(request.headers.get("cookie"));
  const response = handleI18n(request, event);

  if (consent !== CONSENT.accepted && response instanceof NextResponse) {
    response.cookies.set("NEXT_LOCALE", "", { path: "/", maxAge: 0 });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
