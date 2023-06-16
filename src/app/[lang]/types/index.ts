import { languages } from "@/app/[lang]/constants";

export type ValidLanguageType = (typeof languages)[number];

export type RawQuestionType = {
  id: number;
  attributes: {
    prompt: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;
    locale: ValidLanguageType;
  };
};

export type QuestionType = {
  prompt: string;
  id: number;
};
