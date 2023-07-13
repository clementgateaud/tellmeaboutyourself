import type { ValidLanguageType } from "@/app/[lang]/types";
import type { Provider, Session } from "@supabase/supabase-js";
import type { Dispatch, FunctionComponent, SetStateAction } from "react";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Modal } from "@/app/[lang]/ui-kit/Modal";
import { t } from "@/app/[lang]/utils/translation";
import { Database } from "@/database.types";
import { useRouter } from "next/navigation";
import { Button } from "@/app/[lang]/ui-kit/Button";
import styles from "./AuthModal.module.css";

type AuthModalProps = {
  lang: ValidLanguageType;
  session: Session | null;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const AuthModal: FunctionComponent<AuthModalProps> = ({
  lang,
  session,
  isModalOpen,
  setIsModalOpen,
}) => {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSignIn = async (authProviderName: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: authProviderName,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.log(error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    handleCloseModal();
    router.refresh();
  };

  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleOnEmailSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const email = event.currentTarget.email.value;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.log(error);
    }
    setMagicLinkSent(true);
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      className={styles.modal}
    >
      {!session && !magicLinkSent && (
        <>
          <p className={styles.logInTitle}>{t("auth_modal_title", lang)}</p>
          <form className={styles.emailForm} onSubmit={handleOnEmailSubmit}>
            <label htmlFor="email" className={styles.emailLabel}>
              {t("email", lang)}
            </label>
            <input
              type="email"
              id="email"
              className={styles.emailInput}
              placeholder={t("email_placeholder", lang)}
            />
            <Button minor type="submit" className={styles.emailSubmitButton}>
              Receive a magic link
            </Button>
          </form>
        </>
      )}
      {!session && magicLinkSent && (
        <p className={styles.magicLinkSentDescription}>
          {t("auth_modal_magic_link_sent", lang)}
        </p>
      )}
      {session && (
        <>
          {t("logged_in_as", lang)} {session.user.email}
          <Button className={styles.signOutButton} onClick={handleSignOut}>
            {t("sign_out", lang)}
          </Button>
        </>
      )}
    </Modal>
  );
};
