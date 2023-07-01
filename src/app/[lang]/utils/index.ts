import { languages } from "@/app/[lang]/constants";
import type {
  ValidLanguageType,
  RawQuestionType,
  LocalQuestionType,
} from "@/app/[lang]/types";

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
  return (languages as readonly string[]).includes(language);
};

export const getLocalQuestions = (
  rawQuestions: RawQuestionType[],
  lang: ValidLanguageType
): LocalQuestionType[] => {
  return rawQuestions.map(({ prompt, tips, ...rest }) => ({
    ...rest,
    prompt: prompt[lang],
    tips: tips[lang],
  }));
};

export const getLocalQuestion = (
  rawQuestion: RawQuestionType,
  lang: ValidLanguageType
): LocalQuestionType => {
  const { prompt, tips, ...rest } = rawQuestion;
  return {
    ...rest,
    prompt: prompt[lang],
    tips: tips[lang],
  };
};
