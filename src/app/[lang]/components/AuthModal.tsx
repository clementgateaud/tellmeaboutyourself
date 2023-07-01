import type { ValidLanguageType } from "@/app/[lang]/types";
import type { Provider, Session } from "@supabase/supabase-js";
import type { Dispatch, SetStateAction } from "react";
import type { StaticImageData } from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Modal } from "@/app/[lang]/ui-kit/Modal";
import { t } from "@/app/[lang]/utils/translation";
import { Database } from "@/database.types";
import Image from "next/image";
import GoogleIcon from "@/assets/google.svg";
import LinkedInIcon from "@/assets/linkedin.svg";
import GitHubIcon from "@/assets/github.svg";
import styles from "./AccountAuth.module.css";

type AuthModalProps = {
  lang: ValidLanguageType;
  session: Session | null;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const AuthModal = ({
  lang,
  session,
  isModalOpen,
  setIsModalOpen,
}: AuthModalProps) => {
  const supabase = createClientComponentClient<Database>();

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

  const AUTH_PROVIDERS: {
    id: Provider;
    label: string;
    icon: StaticImageData;
  }[] = [
    {
      id: "google",
      label: "Google",
      icon: GoogleIcon,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      icon: LinkedInIcon,
    },
    {
      id: "github",
      label: "GitHub",
      icon: GitHubIcon,
    },
  ];

  if (session) {
    return null;
  }

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      className={styles.modal}
    >
      <>
        <p className={styles.logInTitle}>{t("log_in_with", lang)}</p>
        <div className={styles.authProviders}>
          {AUTH_PROVIDERS.map((provider) => (
            <button
              className={styles.authProviderButton}
              onClick={() => handleSignIn(provider.id)}
              key={provider.id}
            >
              <Image src={provider.icon} alt={provider.label} />
            </button>
          ))}
        </div>
      </>
    </Modal>
  );
};
