"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Button } from "@/app/[lang]/ui-kit/Button";
import styles from "./LogInSignUp.module.css";
import { Modal } from "@/app/[lang]/ui-kit/Modal";
import { Input } from "@/app/[lang]/ui-kit/Input";
import { Link } from "@/app/[lang]/ui-kit/Link";
import { t } from "@/app/[lang]/utils/translation";
import type { ValidLanguageType } from "@/app/[lang]/types";
import { Database } from "@/database.types";

type LogInSignUpProps = {
  lang: ValidLanguageType;
  session: Session | null;
};

export const LogInSignUp = ({ lang, session }: LogInSignUpProps) => {
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLogIn, setIsLogIn] = useState(true);
  const [isSignUpPending, setIsSignUpPending] = useState(false);

  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsSignUp(false);
    setIsLogIn(true);
    setIsSignUpPending(false);
    setSignInEmail("");
    setSignInPassword("");
    setSignUpEmail("");
    setSignUpPassword("");
  };

  useEffect(() => {
    console.log(session);
    if (session) {
      handleCloseModal();
    }
  }, [session]);

  const handleSignUp = async () => {
    await supabase.auth.signUp({
      email: signUpEmail,
      password: signUpPassword,
    });
    setIsSignUpPending(true);
    router.refresh();
  };

  const handleSignIn = async () => {
    await supabase.auth.signInWithPassword({
      email: signInEmail,
      password: signInPassword,
    });
    router.refresh();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div>
      {session && (
        <button className={styles.logInButton} onClick={handleSignOut}>
          {t("sign_out", lang)}
        </button>
      )}
      {!session && (
        <button
          className={styles.logInButton}
          onClick={() => setIsModalOpen(true)}
        >
          {t("log_in", lang)}
        </button>
      )}

      {!session && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          className={styles.modal}
        >
          {isLogIn && (
            <form className={styles.logInForm} onSubmit={handleSignIn}>
              <p className={styles.logInTitle}>{t("log_in", lang)}</p>
              <Input
                id="email"
                type="email"
                placeholder={t("email", lang)}
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                required
              />
              <Input
                id="password"
                type="password"
                placeholder={t("password", lang)}
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                required
              />
              <Button type="submit">{t("log_in", lang)}</Button>
              <Link
                onClick={() => {
                  setIsSignUp(true);
                  setIsLogIn(false);
                }}
                className={styles.signUpLink}
              >
                {t("no_account_yet", lang)}
              </Link>
            </form>
          )}
          {isSignUp && isSignUpPending && (
            <p>{t("received_validation_email", lang)}</p>
          )}
          {isSignUp && !isSignUpPending && (
            <form className={styles.signUpForm} onSubmit={handleSignUp}>
              <p className={styles.signUpTitle}>{t("sign_up", lang)}</p>
              <Input
                id="email"
                type="email"
                placeholder={t("email", lang)}
                onChange={(e) => setSignUpEmail(e.target.value)}
                required
              />
              <Input
                id="password"
                type="password"
                placeholder={t("password", lang)}
                onChange={(e) => setSignUpPassword(e.target.value)}
                required
                minLength={8}
              />
              <Button type="submit">{t("sign_up", lang)}</Button>
              <Link
                onClick={() => {
                  setIsSignUp(false);
                  setIsLogIn(true);
                }}
                className={styles.logInLink}
              >
                {t("already_have_account", lang)}
              </Link>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};
