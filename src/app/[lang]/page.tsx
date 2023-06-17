import { Header } from "@/app/[lang]/components/Header";
import { Question } from "@/app/[lang]/components/Question";
import { shuffleArray } from "@/app/[lang]/utils";
import { isLanguageValid, getLocalQuestions } from "@/app/[lang]/utils";
import { defaultLanguage } from "@/app/[lang]/constants";
import supabase from "@/supabase";
import type { ValidLanguageType, RawQuestionType } from "@/app/[lang]/types";

const getSupabaseQuestions = async (): Promise<RawQuestionType[]> => {
  const { data: rawQuestions, error } = await supabase
    .from("questions")
    .select("*")
    .eq("isPublished", true);
  if (error) {
    throw error;
  }
  return rawQuestions as RawQuestionType[];
};

const Page = async ({
  params: { lang },
}: {
  params: {
    lang: ValidLanguageType;
  };
}) => {
  const rawQuestions = await getSupabaseQuestions();
  const localQuestions = getLocalQuestions(rawQuestions, lang);
  return (
    <>
      <Header lang={isLanguageValid(lang) ? lang : defaultLanguage} />
      <Question questions={shuffleArray(localQuestions)} lang={lang} />
    </>
  );
};

export default Page;
