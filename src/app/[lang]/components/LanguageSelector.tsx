"use client";

import type { ValidLanguageType } from "@/app/[lang]/types";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { languages } from "@/app/[lang]/constants";
import styles from "./LanguageSelector.module.css";
import { MdLanguage } from "react-icons/md";
import { t } from "@/app/[lang]/utils/translation";

export const LanguageSelector = () => {
  const pathname = usePathname();
  const getLocalizedPath = (lang: ValidLanguageType) => {
    const languageRegExp = new RegExp(`^\\/(${languages.join("|")})\\b`);
    const pathWithoutLanguage = pathname.replace(languageRegExp, "");
    return `/${lang}${pathWithoutLanguage}`;
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as Node).contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className={styles.main} ref={dropdownRef}>
      <div className={styles.menu}>
        <button
          className={styles.menuButton}
          onClick={() => setIsDropdownOpen((prevState) => !prevState)}
        >
          <MdLanguage className={styles.navBarIcon} />
        </button>

        {isDropdownOpen && (
          <div className={styles.menuItems}>
            {LANGUAGES.map((language) => (
              <Link
                key={language.value}
                href={language.href}
                className={styles.menuItem}
                onClick={() => setIsDropdownOpen(false)}
              >
                {language.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
