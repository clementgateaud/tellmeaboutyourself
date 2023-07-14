import type { Database } from "@/database.types";
import type { ValidLanguageType, QuestionType } from "@/app/[lang]/types";
import { shuffleArray } from "@/app/[lang]/utils";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { TrainingMode } from "@/app/[lang]/components/TrainingMode";
import styles from "./page.module.css";
import { Header } from "@/app/[lang]/components/Header";
import { isLanguageValid } from "@/app/[lang]/utils";
import { notFound } from "next/navigation";

const getQuestions = async (): Promise<QuestionType[]> => {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: questions, error } = await supabase
    .from("questions")
    .select("*")
    .eq("isPublished", true);
  if (error) {
    throw error;
  }
  return questions as QuestionType[];
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
  const questions = await getQuestions();
  const session = await getUserSession();

  if (!isLanguageValid(lang)) {
    return notFound();
  }

  return (
    <>
      <Header lang={lang} session={session} />
      <div className={styles.main}>
        <TrainingMode questions={shuffleArray(questions)} lang={lang} />
      </div>
    </>
  );
};

export default Page;
