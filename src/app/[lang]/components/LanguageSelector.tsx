import Link from "next/link";
import type { ValidLanguageType } from "@/app/[lang]/types";
import { usePathname } from "next/navigation";
import { languages } from "@/app/[lang]/constants";
import styles from "./LanguageSelector.module.css";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { LanguageIcon } from "@heroicons/react/24/solid";
import classnames from "classnames";
import { t } from "@/app/[lang]/utils/translation";

type LanguageSelectorProps = {
  lang: ValidLanguageType;
};

export const LanguageSelector = ({ lang }: LanguageSelectorProps) => {
  const pathname = usePathname();
  const getLocalizedPath = (lang: ValidLanguageType) => {
    const languageRegExp = new RegExp(`^\\/(${languages.join("|")})\\b`);
    const pathWithoutLanguage = pathname.replace(languageRegExp, "");
    return `/${lang}${pathWithoutLanguage}`;
  };

  const LANGUAGES: {
    value: ValidLanguageType;
    label: string;
    href: string;
  }[] = [
    {
      value: "en",
      label: t("language_en", "en"),
      href: getLocalizedPath("en"),
    },
    {
      value: "fr",
      label: t("language_fr", "fr"),
      href: getLocalizedPath("fr"),
    },
  ];

  return (
    <div className={styles.main}>
      <Menu as="div" className={styles.menu}>
        <div>
          <Menu.Button className={styles.menuButton}>
            <LanguageIcon className={styles.languageIcon} aria-hidden="true" />
            {t(`language_${lang}`, lang)}
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className={styles.menuItems}>
            {LANGUAGES.map((language) => (
              <Menu.Item key={language.value}>
                {({ active }) => (
                  <Link
                    href={language.href}
                    className={classnames(styles.menuItem, {
                      [styles["menuItem--active"]]: active,
                    })}
                  >
                    {language.label}
                  </Link>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};
