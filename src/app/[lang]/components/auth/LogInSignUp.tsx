"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/app/[lang]/ui-kit/Button";
import styles from "./LogInSignUp.module.css";
import { Modal } from "@/app/[lang]/ui-kit/Modal";
import { Input } from "@/app/[lang]/ui-kit/Input";
import { Link } from "@/app/[lang]/ui-kit/Link";
import { t } from "@/app/[lang]/utils/translation";
import type { ValidLanguageType } from "@/app/[lang]/types";

type LogInSignUpProps = {
  lang: ValidLanguageType;
};

export const LogInSignUp = ({ lang }: LogInSignUpProps) => {
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLogIn, setIsLogIn] = useState(true);
  const [isSignUpPending, setIsSignUpPending] = useState(false);

  const supabase = createClientComponentClient();

  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setUser(user);
  };

  useEffect(() => {
    fetchUser();
  }, [user]);

  const handleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signUpEmail,
        password: signUpPassword,
      });
    } catch (error) {
      console.error("Sign up error:", error);
    }
    setIsSignUpPending(true);
    fetchUser();
  };

  const handleSignIn = async () => {
    try {
      await supabase.auth.signInWithPassword({
        email: signInEmail,
        password: signInPassword,
      });
    } catch (error) {
      console.error("Sign in error:", error);
    }
    handleCloseModal();
    setSignInEmail("");
    setSignInPassword("");
    fetchUser();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsSignUp(false);
    setIsLogIn(true);
    setIsSignUpPending(false);
  };

  return (
    <div>
      {user && (
        <button
          className={styles.logInButton}
          onClick={() => supabase.auth.signOut()}
        >
          {t("sign_out", lang)}
        </button>
      )}
      {!user && (
        <button
          className={styles.logInButton}
          onClick={() => setIsModalOpen(true)}
        >
          {t("log_in", lang)}
        </button>
      )}

      {!user && (
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
