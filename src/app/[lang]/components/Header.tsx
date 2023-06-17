"use client";

import styles from "./Header.module.css";
import Link from "next/link";
import { WidthContainer } from "@/app/[lang]/components/WidthContainer";
import { Poppins } from "next/font/google";
import classNames from "classnames";
import { useEffect } from "react";
import { ValidLanguageType } from "@/app/[lang]/types";
import { LanguageSelector } from "@/app/[lang]/components/LanguageSelector";

const font = Poppins({
  weight: "500",
  style: "normal",
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

  return (
    <WidthContainer className={styles.main}>
      <Link
        href={`/${lang}`}
        className={classNames(styles.logoLink, font.className)}
      >
        <div className={styles.tellMeAbout}>
          <p>
            <span className={styles.tell}>Tell </span>
            <span className={styles.me}>me</span>
          </p>
          <p className={styles.about}>about</p>
        </div>
        <p className={styles.yourself}>yourself</p>
      </Link>
      <div>
        <LanguageSelector lang={lang} />
      </div>
    </WidthContainer>
  );
};
