"use client";

import type { Session } from "@supabase/supabase-js";
import styles from "./Header.module.css";
import { NextLink } from "@/ui-kit/NextLink";
import Image from "next/image";
import { Container } from "@/ui-kit/Container";
import { useEffect, useState } from "react";
import { ValidLanguageType } from "@/types";
import { AuthModal } from "@/components/AuthModal";
import { FaList } from "react-icons/fa";
import { BiTimer } from "react-icons/bi";
import { AiOutlineUser } from "react-icons/ai";
import { MdLanguage } from "react-icons/md";
import { LanguageModal } from "@/components/LanguageModal";

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
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  return (
    <Container className={styles.main}>
      <NextLink href={`/${lang}`} className={styles.logoLink}>
        <Image
          src="/assets/transparent-logo-tmay-cropped-min.png"
          alt="Logo"
          width="40"
          height="40"
          priority
        />
        <div>
          <p>Tell me</p>
          <p>about yourself</p>
        </div>
      </NextLink>
      <div className={styles.navbar}>
        <NextLink href={`/${lang}/questions`} className={styles.navbarLink}>
          <FaList className={styles.listIcon} />
        </NextLink>
        <NextLink href={`/${lang}/training`} className={styles.navbarLink}>
          <BiTimer className={styles.trainingIcon} />
        </NextLink>
        <button
          className={styles.navBarButton}
          onClick={() => setIsAuthModalOpen(true)}
        >
          <AiOutlineUser className={styles.accountIcon} />
        </button>
        <button
          className={styles.navBarButton}
          onClick={() => setIsLanguageModalOpen(true)}
        >
          <MdLanguage className={styles.languageIcon} />
        </button>
      </div>
      <AuthModal
        lang={lang}
        session={session}
        isModalOpen={isAuthModalOpen}
        setIsModalOpen={setIsAuthModalOpen}
      />
      <LanguageModal
        lang={lang}
        isModalOpen={isLanguageModalOpen}
        setIsModalOpen={setIsLanguageModalOpen}
      />
    </Container>
  );
};
