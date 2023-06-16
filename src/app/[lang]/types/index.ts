import { languages } from "@/app/[lang]/constants";

export type ValidLanguageType = (typeof languages)[number];

export type RawQuestionType = {
  id: number;
  prompt: {
    en: string;
    fr: string;
  };
};

export type LocalQuestionType = {
  id: number;
  prompt: string;
};
