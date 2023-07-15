import en from "@/locales/en.json";
import fr from "@/locales/fr.json";
import { ValidLanguageType } from "@/types";

type Translations = typeof en;

const translations: Record<ValidLanguageType, Translations> = {
  en,
  fr,
};

export function t(key: keyof Translations, lng: ValidLanguageType): string {
  const translation = translations[lng][key];
  if (!translation) {
    console.warn(`Missing translation for key "${key}" in language "${lng}"`);
    return key;
  }
  return translation;
}
