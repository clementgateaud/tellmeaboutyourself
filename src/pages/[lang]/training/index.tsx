import type { NextPage, GetServerSideProps } from "next";
import type { Session } from "@supabase/supabase-js";
import type { ValidLanguageType, QuestionType } from "@/types";
import Head from "next/head";
import { t } from "@/utils/translation";
import { Header } from "@/components/Header";
import { TrainingMode } from "@/components/TrainingMode";
import { isLanguageValid, shuffleArray } from "@/utils";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

type TrainingPageServerSideProps = {
  session: Session | null;
  lang: ValidLanguageType;
  questions: QuestionType[];
};

const TrainingPage: NextPage<TrainingPageServerSideProps> = ({
  // eslint-disable-next-line react/prop-types
  session,
  // eslint-disable-next-line react/prop-types
  lang,
  // eslint-disable-next-line react/prop-types
  questions,
}) => {
  return (
    <>
      <Head>
        <title>{t("meta_title", lang)}</title>
        <meta name="description" content={t("meta_description", lang)} />
      </Head>
      <Header lang={lang} session={session} />
      <TrainingMode questions={questions} lang={lang} session={session} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  TrainingPageServerSideProps
> = async (context) => {
  const supabase = createPagesServerClient(context);

  const getUserSession = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }
    return session;
  };

  const lang = context.query.lang as ValidLanguageType;

  const getQuestions = async (): Promise<QuestionType[]> => {
    const { data: questions, error } = await supabase
      .from("questions")
      .select("*")
      .eq("isPublished", true);
    if (error) {
      throw error;
    }
    return questions as QuestionType[];
  };

  if (!isLanguageValid(lang)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const questions = shuffleArray(await getQuestions());
  const session = await getUserSession();

  return {
    props: {
      session,
      questions,
      lang,
    },
  };
};

export default TrainingPage;
