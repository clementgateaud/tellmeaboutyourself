import { LANGUAGES } from "@/app/[lang]/constants";
import type { ValidLanguageType } from "@/app/[lang]/types";

export const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const isLanguageValid = (
  language: string | null
): language is ValidLanguageType => {
  if (!language) return false;
  return (LANGUAGES as readonly string[]).includes(language);
};
