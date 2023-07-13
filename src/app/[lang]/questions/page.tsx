import type { Database } from "@/database.types";
import type { ValidLanguageType, RawQuestionType } from "@/app/[lang]/types";
import { getLocalQuestions } from "@/app/[lang]/utils";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Header } from "@/app/[lang]/components/Header";
import { isLanguageValid } from "@/app/[lang]/utils";
import { DEFAULT_LANGUAGE } from "@/app/[lang]/constants";
import { QuestionsListing } from "@/app/[lang]/components/QuestionsListing";

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
        lang={isLanguageValid(lang) ? lang : DEFAULT_LANGUAGE}
        session={session}
      />
      <QuestionsListing
        questions={localQuestions}
        lang={isLanguageValid(lang) ? lang : DEFAULT_LANGUAGE}
      />
    </>
  );
};

export default Page;
