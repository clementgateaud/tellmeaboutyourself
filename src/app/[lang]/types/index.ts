import { languages } from "@/app/[lang]/constants";

export type ValidLanguageType = (typeof languages)[number];

export type RawQuestionType = {
  id: number;
  created_at: string;
  isPublished: boolean;
  prompt: {
    en: string;
    fr: string;
  };
  tips: {
    en: string;
    fr: string;
  };
};

export type LocalQuestionType = Omit<RawQuestionType, "prompt" | "tips"> & {
  prompt: string;
  tips: string;
};
