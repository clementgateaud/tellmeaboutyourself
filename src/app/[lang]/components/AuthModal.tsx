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
import { useRouter } from "next/navigation";
import { Button } from "@/app/[lang]/ui-kit/Button";
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

  const AUTH_PROVIDERS: {
    id: Provider;
    label: string;
    iconSrc: string;
  }[] = [
    {
      id: "google",
      label: "Google",
      iconSrc: "/assets/google.svg",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      iconSrc: "/assets/linkedin.svg",
    },
    {
      id: "github",
      label: "GitHub",
      iconSrc: "/assets/github.svg",
    },
  ];

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      className={styles.modal}
    >
      {!session && (
        <>
          <p className={styles.logInTitle}>{t("log_in_with", lang)}</p>
          <div className={styles.authProviders}>
            {AUTH_PROVIDERS.map((provider) => (
              <button
                className={styles.authProviderButton}
                onClick={() => handleSignIn(provider.id)}
                key={provider.id}
              >
                <Image
                  src={provider.iconSrc}
                  alt={provider.label}
                  width="40"
                  height="40"
                  priority
                />
              </button>
            ))}
          </div>
        </>
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
