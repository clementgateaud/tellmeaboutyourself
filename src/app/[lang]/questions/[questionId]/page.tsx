import type { Database } from "@/database.types";
import type {
  ValidLanguageType,
  QuestionType,
  NoteType,
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

const getNote = async (questionId: string): Promise<NoteType | null> => {
  const supabase = createServerComponentClient<Database>({ cookies });
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
  const note = await getNote(questionId);
  const session = await getUserSession();

  if (!question) {
    return notFound();
  }

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

export default Page;
