import type { ValidLanguageType } from "@/app/[lang]/types";
import type { Session } from "@supabase/supabase-js";
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
  const [otpSent, setOtpSent] = useState(false);
  const [emailToVerify, setEmailToVerify] = useState("");
  const [otpError, setOtpError] = useState(false);
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setOtpSent(false);
    setOtpError(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    handleCloseModal();
    router.refresh();
  };

  const handleOnEmailSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const email = event.currentTarget.email.value;
    const { error } = await supabase.auth.signInWithOtp({
      email,
    });
    if (error) {
      console.log(error);
    }
    setOtpSent(true);
    setEmailToVerify(email);
  };

  const handleOnOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const otp = event.currentTarget.otp.value;
    const { error } = await supabase.auth.verifyOtp({
      email: emailToVerify,
      token: otp,
      type: "email",
    });
    if (error) {
      setOtpError(true);
    } else {
      handleCloseModal();
      router.refresh();
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      className={styles.modal}
    >
      {!session && (
        <p className={styles.logInTitle}>{t("auth_modal_title", lang)}</p>
      )}
      {!session && !otpSent && (
        <form onSubmit={handleOnEmailSubmit}>
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
            {t("email_submit", lang)}
          </Button>
        </form>
      )}
      {!session && otpSent && (
        <form onSubmit={handleOnOtpSubmit}>
          <label htmlFor="otp" className={styles.otpLabel}>
            {t("otp_label", lang)}
          </label>
          <input
            id="otp"
            placeholder={t("otp_placeholder", lang)}
            className={styles.otpInput}
          />
          {otpError && (
            <p className={styles.otpError}>{t("otp_error", lang)}</p>
          )}
          <Button minor type="submit" className={styles.otpSubmitButton}>
            {t("otp_submit", lang)}
          </Button>
        </form>
      )}
      {session && (
        <>
          <p className={styles.loggedInAs}>
            {t("logged_in_as", lang)} {session.user.email}
          </p>
          <Button
            minor
            className={styles.signOutButton}
            onClick={handleSignOut}
          >
            {t("sign_out", lang)}
          </Button>
        </>
      )}
    </Modal>
  );
};
