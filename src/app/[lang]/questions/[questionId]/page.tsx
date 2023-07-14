import type { Database } from "@/database.types";
import type {
  ValidLanguageType,
  QuestionType,
  NotesType,
} from "@/app/[lang]/types";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Header } from "@/app/[lang]/components/Header";
import { notFound } from "next/navigation";
import { isLanguageValid } from "@/app/[lang]/utils";
import { QuestionShow } from "@/app/[lang]/components/QuestionShow";

const getQuestion = async (id: string): Promise<QuestionType> => {
  const supabase = createServerComponentClient<Database>({ cookies });
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

const getNotes = async (questionId: string): Promise<NotesType | null> => {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: notes, error } = await supabase
    .from("notes")
    .select()
    .eq("question_id", questionId)
    .maybeSingle();
  if (error) {
    throw error;
  }
  return notes as NotesType | null;
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
  params: { lang, questionId },
}: {
  params: {
    lang: ValidLanguageType;
    questionId: string;
  };
}) => {
  if (!isLanguageValid(lang)) {
    return notFound();
  }

  const question = await getQuestion(questionId);
  const notes = await getNotes(questionId);
  const session = await getUserSession();

  if (!question) {
    return notFound();
  }

  return (
    <>
      <Header lang={lang} session={session} />
      <QuestionShow
        question={question}
        notes={notes}
        lang={lang}
        session={session}
      />
    </>
  );
};

export default Page;
