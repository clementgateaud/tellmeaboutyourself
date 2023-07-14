import { LANGUAGES } from "@/app/[lang]/constants";

export type ValidLanguageType = (typeof LANGUAGES)[number];

export type QuestionTagType =
  | "motivation"
  | "salary"
  | "profile"
  | "experience"
  | "project";

export type QuestionType = {
  id: number;
  created_at: string;
  isPublished: boolean;
  prompt_en: string;
  prompt_fr: string;
  tips_en: string[];
  tips_fr: string[];
  duration: number;
  tag: string;
};

export type NotesType = {
  id: number;
  created_at: string;
  content: string;
  question_id: number;
  user_id: string;
};
