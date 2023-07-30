import type { NextPage, GetServerSideProps } from "next";
import type { Session } from "@supabase/supabase-js";
import type { ValidLanguageType, QuestionType, NoteType } from "@/types";
import Head from "next/head";
import { t } from "@/utils/translation";
import { Header } from "@/components/Header";
import { QuestionsListing } from "@/components/QuestionsListing";
import { isLanguageValid } from "@/utils";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

type QuestionsPageServerSideProps = {
  session: Session | null;
  lang: ValidLanguageType;
  questions: QuestionType[];
  notes: NoteType[];
};

const QuestionsPage: NextPage<QuestionsPageServerSideProps> = ({
  // eslint-disable-next-line react/prop-types
  session,
  // eslint-disable-next-line react/prop-types
  lang,
  // eslint-disable-next-line react/prop-types
  questions,
  // eslint-disable-next-line react/prop-types
  notes,
}) => {
  return (
    <>
      <Head>
        <title>{t("meta_title", lang)}</title>
        <meta name="description" content={t("meta_description", lang)} />
      </Head>
      <Header lang={lang} session={session} />
      <QuestionsListing questions={questions} lang={lang} notes={notes} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  QuestionsPageServerSideProps
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

  const getNotes = async (): Promise<NoteType[]> => {
    const { data: notes, error } = await supabase.from("notes").select();
    if (error) {
      throw error;
    }
    return notes as NoteType[];
  };

  if (!isLanguageValid(lang)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const questions = await getQuestions();
  const notes = await getNotes();
  const session = await getUserSession();

  return {
    props: {
      session,
      questions,
      notes,
      lang,
    },
  };
};

export default QuestionsPage;
