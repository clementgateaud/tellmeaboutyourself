"use client";

import styles from "./Header.module.css";
import Link from "next/link";
import { WidthContainer } from "@/app/[lang]/components/WidthContainer";
import { useEffect } from "react";
import { ValidLanguageType } from "@/app/[lang]/types";
import { LanguageSelector } from "@/app/[lang]/components/LanguageSelector";
import { LogInSignUp } from "@/app/[lang]/components/auth/LogInSignUp";
import type { Session } from "@supabase/supabase-js";

type HeaderProps = {
  lang: ValidLanguageType;
  session: Session | null;
};

export const Header = ({ lang, session }: HeaderProps) => {
  useEffect(() => {
    document.cookie = `language=${lang}`;
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <WidthContainer className={styles.main}>
      <Link href={`/${lang}`} className={styles.logoLink}>
        <div className={styles.tellMeAbout}>
          <p>
            <span className={styles.tell}>Tell </span>
            <span className={styles.me}>me</span>
          </p>
          <p className={styles.about}>about</p>
        </div>
        <p className={styles.yourself}>yourself</p>
      </Link>
      <div className={styles.navbar}>
        <LanguageSelector lang={lang} />
        <LogInSignUp lang={lang} session={session} />
      </div>
    </WidthContainer>
  );
};
