import { shuffleArray } from "@/app/[lang]/utils";
import { getLocalQuestions } from "@/app/[lang]/utils";
import type { ValidLanguageType, RawQuestionType } from "@/app/[lang]/types";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { QuestionRoulette } from "@/app/[lang]/components/QuestionRoulette";
import styles from "./page.module.css";
import { HeaderLayout } from "@/app/[lang]/layouts/HeaderLayout";
import { isLanguageValid } from "@/app/[lang]/utils";
import { defaultLanguage } from "@/app/[lang]/constants";

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
    <HeaderLayout lang={isLanguageValid(lang) ? lang : defaultLanguage}>
      <div className={styles.main}>
        <QuestionRoulette
          questions={shuffleArray(localQuestions)}
          lang={lang}
        />
      </div>
    </HeaderLayout>
  );
};

export default Page;
