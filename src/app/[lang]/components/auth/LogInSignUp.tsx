"use client";

import type { ValidLanguageType } from "@/app/[lang]/types";
import type { Session } from "@supabase/supabase-js";
import type { FormEvent } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { Button } from "@/app/[lang]/ui-kit/Button";
import styles from "./LogInSignUp.module.css";
import { Modal } from "@/app/[lang]/ui-kit/Modal";
import { Input } from "@/app/[lang]/ui-kit/Input";
import { Link } from "@/app/[lang]/ui-kit/Link";
import { t } from "@/app/[lang]/utils/translation";
import { Database } from "@/database.types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GoogleIcon from "@/assets/google.svg";

type LogInSignUpProps = {
  lang: ValidLanguageType;
  session: Session | null;
};

export const LogInSignUp = ({ lang, session }: LogInSignUpProps) => {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLogIn, setIsLogIn] = useState(true);
  const [isSignUpPending, setIsSignUpPending] = useState(false);
  const [isLogInError, setIsLogInError] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsSignUp(false);
    setIsLogIn(true);
    setIsSignUpPending(false);
    setSignInEmail("");
    setSignInPassword("");
    setSignUpEmail("");
    setSignUpPassword("");
    setIsLogInError(false);
  };

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await supabase.auth.signUp({
      email: signUpEmail,
      password: signUpPassword,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    setIsSignUpPending(true);
  };

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email: signInEmail,
      password: signInPassword,
    });
    if (error) {
      setIsLogInError(true);
    } else {
      setIsLogInError(false);
      handleCloseModal();
      router.refresh();
    }
  };

  const handleSignInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    console.log("data", data);
    console.log("error", error);
  };

  const handleSignInWithGithub = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    console.log("data", data);
    console.log("error", error);
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
              <Button
                color="accent"
                onClick={handleSignInWithGoogle}
                icon={
                  <Image
                    className={styles.googleIcon}
                    src={GoogleIcon}
                    alt="Google Icon"
                    width="20"
                    height="20"
                  />
                }
              >
                Log in with Google
              </Button>
              <Button color="accent" onClick={handleSignInWithGithub}>
                Log in with GitHub
              </Button>
              <hr className={styles.separator} />
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
              {isLogInError && (
                <p className={styles.logInError}>
                  {t("invalid_credentials", lang)}
                </p>
              )}
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
            <div className={styles.signUpPending}>
              <p>{t("received_validation_email", lang)}</p>
              <Button
                onClick={handleCloseModal}
                className={styles.signUpPendingButton}
              >
                {t("ok", lang)}
              </Button>
            </div>
          )}
          {isSignUp && !isSignUpPending && (
            <form className={styles.signUpForm} onSubmit={handleSignUp}>
              <p className={styles.signUpTitle}>{t("sign_up", lang)}</p>
              <Button
                color="accent"
                onClick={handleSignInWithGoogle}
                icon={
                  <Image
                    className={styles.googleIcon}
                    src={GoogleIcon}
                    alt="Google Icon"
                    width="20"
                    height="20"
                  />
                }
              >
                Sign up with Google
              </Button>
              <hr className={styles.separator} />
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
