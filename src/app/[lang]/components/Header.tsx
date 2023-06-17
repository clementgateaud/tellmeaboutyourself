"use client";

import styles from "./Header.module.css";
import Link from "next/link";
import { WidthContainer } from "@/app/[lang]/components/WidthContainer";
import { Poppins } from "next/font/google";
import classNames from "classnames";
import { useEffect } from "react";
import { ValidLanguageType } from "@/app/[lang]/types";
import { usePathname } from "next/navigation";
import { languages } from "@/app/[lang]/constants";
import { t } from "@/app/[lang]/utils/translation";

const font = Poppins({
  weight: "700",
  style: "italic",
  subsets: ["latin"],
});

type HeaderProps = {
  lang: ValidLanguageType;
};

export const Header = ({ lang }: HeaderProps) => {
  useEffect(() => {
    document.cookie = `language=${lang}`;
    document.documentElement.lang = lang;
  }, [lang]);

  const pathname = usePathname();

  const getLocalizedPath = (lang: ValidLanguageType) => {
    const languageRegExp = new RegExp(`^\\/(${languages.join("|")})\\b`);
    const pathWithoutLanguage = pathname.replace(languageRegExp, "");
    return `/${lang}${pathWithoutLanguage}`;
  };

  return (
    <WidthContainer className={styles.main}>
      <Link
        href={`/${lang}`}
        className={classNames(styles.logoLink, font.className)}
      >
        {t("app_name", lang)}
      </Link>
      <div>
        <Link href={getLocalizedPath("en")} className={styles.flagLink}>
          🇺🇸
        </Link>
        <Link href={getLocalizedPath("fr")} className={styles.flagLink}>
          🇫🇷
        </Link>
      </div>
    </WidthContainer>
  );
};
