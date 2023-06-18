import { shuffleArray } from "@/app/[lang]/utils";
import { getLocalQuestions } from "@/app/[lang]/utils";
import type { ValidLanguageType, RawQuestionType } from "@/app/[lang]/types";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { QuestionRoulette } from "@/app/[lang]/components/QuestionRoulette";
import { LogInSignUp } from "@/app/[lang]/components/auth/LogInSignUp";
import styles from "./page.module.css";

const getSupabaseQuestions = async (): Promise<RawQuestionType[]> => {
  const supabase = createServerComponentClient({ cookies });
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
    <div className={styles.main}>
      <QuestionRoulette questions={shuffleArray(localQuestions)} lang={lang} />
    </div>
  );
};

export default Page;
