import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLanguage } from "@/app/[lang]/constants";
import { isLanguageValid } from "@/app/[lang]/utils";

export const config = {
  // do not localize Next.js paths
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"],
};

export function middleware(req: NextRequest) {
  const getURLLanguage = () => {
    return req.nextUrl.pathname.split("/")[1] || null;
  };

  const getI18nextCookieValue = () => {
    const i18nextCookie = req.cookies.get("i18next");
    if (i18nextCookie) {
      return i18nextCookie.value;
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
  const i18nextCookieValue = getI18nextCookieValue();
  const acceptLanguageHeader = getAcceptLanguageHeader();

  // if this is a next.js path, do not localize
  if (!new RegExp(config.matcher[0]).test(req.nextUrl.pathname))
    return NextResponse.next();

  if (isLanguageValid(urlLanguage)) {
    return NextResponse.next();
  } else if (isLanguageValid(i18nextCookieValue)) {
    return NextResponse.redirect(new URL(`/${i18nextCookieValue}`, req.url));
  } else if (isLanguageValid(acceptLanguageHeader)) {
    return NextResponse.redirect(new URL(`/${acceptLanguageHeader}`, req.url));
  } else {
    return NextResponse.redirect(new URL(`/${defaultLanguage}`, req.url));
  }
}
