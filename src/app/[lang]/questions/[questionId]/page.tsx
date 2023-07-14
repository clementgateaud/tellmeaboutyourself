import type { Database } from "@/database.types";
import type {
  ValidLanguageType,
  RawQuestionType,
  NotesType,
} from "@/app/[lang]/types";
import { getLocalQuestion } from "@/app/[lang]/utils";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Header } from "@/app/[lang]/components/Header";
import { notFound } from "next/navigation";
import { isLanguageValid } from "@/app/[lang]/utils";
import { QuestionShow } from "@/app/[lang]/components/QuestionShow";

const getQuestion = async (id: string): Promise<RawQuestionType> => {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: rawQuestion, error } = await supabase
    .from("questions")
    .select()
    .eq("id", id)
    .eq("isPublished", true)
    .maybeSingle();
  if (error) {
    throw error;
  }
  return rawQuestion as RawQuestionType;
};

const getNotes = async (questionId: string): Promise<NotesType> => {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: notes, error } = await supabase
    .from("notes")
    .select()
    .eq("question_id", questionId)
    .maybeSingle();
  if (error) {
    throw error;
  }
  return notes as NotesType;
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

  const rawQuestion = await getQuestion(questionId);
  const notes = await getNotes(questionId);

  if (!rawQuestion) {
    return notFound();
  }

  const localQuestion = getLocalQuestion(rawQuestion, lang);
  const session = await getUserSession();

  return (
    <>
      <Header lang={lang} session={session} />
      <QuestionShow
        question={localQuestion}
        notes={notes}
        lang={lang}
        session={session}
      />
    </>
  );
};

export default Page;
