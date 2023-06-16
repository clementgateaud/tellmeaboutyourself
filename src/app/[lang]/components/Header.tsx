"use client";

import styles from "./Header.module.css";
import Link from "next/link";
import { WidthContainer } from "@/app/[lang]/components/WidthContainer";
import { Poppins } from "next/font/google";
import classNames from "classnames";
import { useEffect } from "react";
import { ValidLanguageType } from "@/app/[lang]/types";
import { useRouter, usePathname } from "next/navigation";
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
    document.cookie = `i18next=${lang}`;
    document.documentElement.lang = lang;
  }, [lang]);

  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (lang: ValidLanguageType) => {
    const languageRegExp = new RegExp(`^\\/(${languages.join("|")})\\b`);

    // Remove existing language prefix from the path
    const pathWithoutLanguage = pathname.replace(languageRegExp, "");

    // Redirect to the new language version of the page
    router.push(`/${lang}${pathWithoutLanguage}`);
  };

  return (
    <WidthContainer className={styles.main}>
      <Link href="/" className={classNames(styles.logoLink, font.className)}>
        {t("app_name", lang)}
      </Link>
      <div>
        <span className={styles.flag} onClick={() => changeLanguage("en")}>
          🇺🇸
        </span>
        <span className={styles.flag} onClick={() => changeLanguage("fr")}>
          🇫🇷
        </span>
      </div>
    </WidthContainer>
  );
};
