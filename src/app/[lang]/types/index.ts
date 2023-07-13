import { LANGUAGES } from "@/app/[lang]/constants";

export type ValidLanguageType = (typeof LANGUAGES)[number];

export type QuestionTagType =
  | "motivation"
  | "salary"
  | "profile"
  | "experience"
  | "project";

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
  duration: number;
  tag: string;
};

export type LocalQuestionType = Omit<RawQuestionType, "prompt" | "tips"> & {
  prompt: string;
  tips: string;
};
