import type { Database } from "@/database.types";
import type { ValidLanguageType, RawQuestionType } from "@/app/[lang]/types";
import { shuffleArray } from "@/app/[lang]/utils";
import { getLocalQuestions } from "@/app/[lang]/utils";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { QuestionRoulette } from "@/app/[lang]/components/QuestionRoulette";
import styles from "./page.module.css";
import { Header } from "@/app/[lang]/components/Header";
import { isLanguageValid } from "@/app/[lang]/utils";
import { defaultLanguage } from "@/app/[lang]/constants";

const getQuestions = async (): Promise<RawQuestionType[]> => {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: rawQuestions, error } = await supabase
    .from("questions")
    .select("*")
    .eq("isPublished", true);
  if (error) {
    throw error;
  }
  return rawQuestions as RawQuestionType[];
};

const getUserSession = async () => {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  return session;
};

const Page = async ({
  params: { lang },
}: {
  params: {
    lang: ValidLanguageType;
  };
}) => {
  const rawQuestions = await getQuestions();
  const localQuestions = getLocalQuestions(rawQuestions, lang);
  const session = await getUserSession();

  return (
    <>
      <Header
        lang={isLanguageValid(lang) ? lang : defaultLanguage}
        session={session}
      />
      <div className={styles.main}>
        <QuestionRoulette questions={shuffleArray(localQuestions)} />
      </div>
    </>
  );
};

export default Page;