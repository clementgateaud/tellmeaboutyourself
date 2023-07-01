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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

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
        {session && (
          <button className={styles.navbarLink} onClick={handleSignOut}>
            {t("sign_out", lang)}
          </button>
        )}
        {!session && (
          <button
            className={styles.navbarLink}
            onClick={() => setIsModalOpen(true)}
          >
            {t("log_in", lang)}
          </button>
        )}
        <AuthModal
          lang={lang}
          session={session}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
        <LanguageSelector />
      </div>
    </WidthContainer>
  );
};
