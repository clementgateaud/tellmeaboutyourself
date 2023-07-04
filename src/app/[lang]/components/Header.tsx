"use client";

import type { Session } from "@supabase/supabase-js";
import styles from "./Header.module.css";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/app/[lang]/ui-kit/WidthContainer";
import { useEffect, useState } from "react";
import { ValidLanguageType } from "@/app/[lang]/types";
import { LanguageSelector } from "@/app/[lang]/components/LanguageSelector";
import { AuthModal } from "@/app/[lang]/components/AuthModal";
import { FaList } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";

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
        <Image
          src="/assets/transparent-logo-tmay-cropped-min.png"
          alt="Logo"
          width="40"
          height="40"
          priority
        />
        <div className={styles.tellMeAboutYourself}>
          <p>
            <span className={styles.tellMeAboutYourselfWord}>Tell</span>{" "}
            <span className={styles.tellMeAboutYourselfWord}>me</span>
          </p>
          <p>
            <span className={styles.tellMeAboutYourselfWord}>about</span>{" "}
            <span className={styles.tellMeAboutYourselfWord}>yourself</span>
          </p>
        </div>
      </Link>
      <div className={styles.navbar}>
        <Link href={`/${lang}/questions`} className={styles.navbarLink}>
          <FaList className={styles.listIcon} />
        </Link>

        <button
          className={styles.navBarButton}
          onClick={() => setIsAuthModalOpen(true)}
        >
          <AiOutlineUser className={styles.accountIcon} />
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
