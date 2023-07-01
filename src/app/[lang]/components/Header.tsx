"use client";

import styles from "./Header.module.css";
import Link from "next/link";
import { WidthContainer } from "@/app/[lang]/ui-kit/WidthContainer";
import { useEffect, useState } from "react";
import { ValidLanguageType } from "@/app/[lang]/types";
import { LanguageSelector } from "@/app/[lang]/components/LanguageSelector";
import { AuthModal } from "@/app/[lang]/components/AuthModal";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { t } from "@/app/[lang]/utils/translation";
import { Database } from "@/database.types";
import { useRouter } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/outline";
import { UserIcon as UserIconSolid } from "@heroicons/react/24/solid";
import type { Session } from "@supabase/supabase-js";

type HeaderProps = {
  lang: ValidLanguageType;
  session: Session | null;
};

export const Header = ({ lang, session }: HeaderProps) => {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  useEffect(() => {
    document.cookie = `language=${lang}`;
    document.documentElement.lang = lang;
  }, [lang]);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
        <Link href={`/${lang}/questions`} className={styles.navbarLink}>
          {t("questions", lang)}
        </Link>
        <button
          className={styles.navBarButton}
          onClick={() => setIsAuthModalOpen(true)}
        >
          {session ? (
            <UserIconSolid aria-hidden="true" />
          ) : (
            <UserIcon aria-hidden="true" />
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
    </WidthContainer>
  );
};
