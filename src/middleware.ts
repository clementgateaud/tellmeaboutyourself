import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLanguage } from "@/app/[lang]/constants";
import { isLanguageValid } from "@/app/[lang]/utils";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/database.types";

export const config = {
  // do not localize Next.js paths and auth routes
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|icon.ico|apple-icon.png|sw.js|auth).*)",
  ],
};

export async function middleware(req: NextRequest) {
  // ensure the user's auth session remains active. Since the user's session is tracked in a cookie, we need to read this cookie and update it if necessary
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });
  await supabase.auth.getSession();

  const getURLLanguage = () => {
    return req.nextUrl.pathname.split("/")[1] || null;
  };
  const getLanguageCookieValue = () => {
    const languageCookie = req.cookies.get("language");
    if (languageCookie) {
      return languageCookie.value;
    }
    return null;
  };
  const getAcceptLanguageHeader = () => {
    const acceptLanguageHeader = req.headers.get("Accept-Language");
    if (acceptLanguageHeader) {
      return acceptLanguageHeader.split(",")[0]?.trim().split("-")[0];
    }
    return null;
  };
  const urlLanguage = getURLLanguage();
  const languageCookieValue = getLanguageCookieValue();
  const acceptLanguageHeader = getAcceptLanguageHeader();
  // if this is a next.js path, do not localize
  if (!new RegExp(config.matcher[0]).test(req.nextUrl.pathname))
    return NextResponse.next();
  if (isLanguageValid(urlLanguage)) {
    return NextResponse.next();
  } else if (isLanguageValid(languageCookieValue)) {
    return NextResponse.redirect(new URL(`/${languageCookieValue}`, req.url));
  } else if (isLanguageValid(acceptLanguageHeader)) {
    return NextResponse.redirect(new URL(`/${acceptLanguageHeader}`, req.url));
  } else {
    return NextResponse.redirect(new URL(`/${defaultLanguage}`, req.url));
  }
}
