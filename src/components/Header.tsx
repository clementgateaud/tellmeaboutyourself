"use client";

import type { Session } from "@supabase/supabase-js";
import styles from "./Header.module.css";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/ui-kit/Container";
import { useEffect, useState } from "react";
import { ValidLanguageType } from "@/types";
import { AuthModal } from "@/components/AuthModal";
import { FaList } from "react-icons/fa";
import { BiSolidTimer } from "react-icons/bi";
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
      <Link href={`/${lang}`} className={styles.logoLink}>
        <Image
          src="/assets/transparent-logo-tmay-cropped-min.png"
          alt="Logo"
          width="40"
          height="40"
          priority
        />
        <div className={styles.tellMeAboutYourself}>
          <p>Tell me</p>
          <p>about yourself</p>
        </div>
      </Link>
      <div className={styles.navbar}>
        <Link href={`/${lang}/questions`} className={styles.navbarLink}>
          <FaList className={styles.listIcon} />
        </Link>
        <Link href={`/${lang}/training`} className={styles.navbarLink}>
          <BiSolidTimer className={styles.trainingIcon} />
        </Link>
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
