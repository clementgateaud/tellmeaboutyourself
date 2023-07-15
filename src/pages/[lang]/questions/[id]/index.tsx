import type { NextPage, GetServerSideProps } from "next";
import type { Session } from "@supabase/supabase-js";
import type { ValidLanguageType, QuestionType, NoteType } from "@/types";
import { Header } from "@/components/Header";
import { QuestionShow } from "@/components/QuestionShow";
import { isLanguageValid } from "@/utils";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

type QuestionPageServerSideProps = {
  session: Session | null;
  lang: ValidLanguageType;
  question: QuestionType;
  note: NoteType | null;
};

const QuestionPage: NextPage<QuestionPageServerSideProps> = ({
  // eslint-disable-next-line react/prop-types
  session,
  // eslint-disable-next-line react/prop-types
  lang,
  // eslint-disable-next-line react/prop-types
  question,
  // eslint-disable-next-line react/prop-types
  note,
}) => {
  return (
    <>
      <Header lang={lang} session={session} />
      <QuestionShow
        question={question}
        note={note}
        lang={lang}
        session={session}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  QuestionPageServerSideProps
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
  const questionId = context.query.id as string;

  const getQuestion = async (id: string): Promise<QuestionType> => {
    const { data: question, error } = await supabase
      .from("questions")
      .select()
      .eq("id", id)
      .eq("isPublished", true)
      .maybeSingle();
    if (error) {
      throw error;
    }
    return question as QuestionType;
  };

  const getNote = async (questionId: string): Promise<NoteType | null> => {
    const { data: note, error } = await supabase
      .from("notes")
      .select()
      .eq("question_id", questionId)
      .maybeSingle();
    if (error) {
      throw error;
    }
    return note as NoteType | null;
  };

  if (!isLanguageValid(lang)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const question = await getQuestion(questionId);
  const note = await getNote(questionId);
  const session = await getUserSession();

  if (!question) {
    return {
      redirect: {
        destination: `/${lang}/questions`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
      question,
      note,
      lang,
    },
  };
};

export default QuestionPage;
