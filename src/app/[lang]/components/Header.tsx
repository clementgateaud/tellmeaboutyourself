"use client";

import type { Session } from "@supabase/supabase-js";
import styles from "./Header.module.css";
import Link from "next/link";
import { Container } from "@/app/[lang]/ui-kit/WidthContainer";
import { useEffect, useState } from "react";
import { ValidLanguageType } from "@/app/[lang]/types";
import { LanguageSelector } from "@/app/[lang]/components/LanguageSelector";
import { AuthModal } from "@/app/[lang]/components/AuthModal";
import { t } from "@/app/[lang]/utils/translation";
import { HiOutlineUser, HiUser } from "react-icons/hi";

type HeaderProps = {
  lang: ValidLanguageType;
  session: Session | null;
};

export const Header = ({ lang, session }: HeaderProps) => {
  useEffect(() => {
    document.cookie = `language=${lang}`;
    document.documentElement.lang = lang;
  }, [lang]);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <Container className={styles.main}>
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
        <Link href={`/${lang}/questions`} className={styles.navbarLink}>
          {t("questions", lang)}
        </Link>
        <button
          className={styles.navBarButton}
          onClick={() => setIsAuthModalOpen(true)}
        >
          {session ? (
            <HiUser className={styles.navBarIcon} />
          ) : (
            <HiOutlineUser className={styles.navBarIcon} />
          )}
        </button>
        <AuthModal
          lang={lang}
          session={session}
          isModalOpen={isAuthModalOpen}
          setIsModalOpen={setIsAuthModalOpen}
        />
        <LanguageSelector />
      </div>
    </Container>
  );
};
