import type { FunctionComponent, Dispatch, SetStateAction } from "react";
import type { ValidLanguageType } from "@/types";
import { useRouter } from "next/router";
import { LANGUAGES } from "@/constants";
import { t } from "@/utils/translation";
import { Modal } from "@/ui-kit/Modal";
import styles from "./LanguageModal.module.css";
import { Dropdown } from "@/ui-kit/Dropdown";

type LanguageModalProps = {
  lang: ValidLanguageType;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const LanguageModal: FunctionComponent<LanguageModalProps> = ({
  lang,
  isModalOpen,
  setIsModalOpen,
}) => {
  const handleOnClose = () => {
    setIsModalOpen(false);
  };

  const router = useRouter();

  const getLocalizedPath = (lang: ValidLanguageType) => {
    const languageRegExp = new RegExp(`^\\/(${LANGUAGES.join("|")})\\b`);
    const pathWithoutLanguage = location.pathname.replace(languageRegExp, "");
    return `/${lang}${pathWithoutLanguage}${location.search}`;
  };

  const LANGUAGES_OPTIONS: {
    value: ValidLanguageType;
    label: string;
  }[] = [
    {
      value: "en",
      label: t("language_en", "en"),
    },
    {
      value: "fr",
      label: t("language_fr", "fr"),
    },
  ];

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleOnClose}
      className={styles.modal}
    >
      <h2 className={styles.modalTitle}>{t("language_modal_title", lang)}</h2>
      <Dropdown
        value={lang}
        onChange={(event) => {
          router.push(
            getLocalizedPath(event.target.value as ValidLanguageType)
          );
          handleOnClose();
        }}
        options={LANGUAGES_OPTIONS.sort((a, b) =>
          a.label.localeCompare(b.label)
        )}
      />
    </Modal>
  );
};
