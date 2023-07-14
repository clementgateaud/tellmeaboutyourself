import type { Database } from "@/database.types";
import type {
  ValidLanguageType,
  QuestionType,
  NoteType,
} from "@/app/[lang]/types";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Header } from "@/app/[lang]/components/Header";
import { isLanguageValid } from "@/app/[lang]/utils";
import { QuestionsListing } from "@/app/[lang]/components/QuestionsListing";
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

const getNotes = async (): Promise<NoteType[]> => {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: notes, error } = await supabase.from("notes").select();
  if (error) {
    throw error;
  }
  return notes as NoteType[];
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
  const notes = await getNotes();
  const session = await getUserSession();

  if (!isLanguageValid(lang)) {
    return notFound();
  }

  return (
    <>
      <Header lang={lang} session={session} />
      <QuestionsListing questions={questions} lang={lang} notes={notes} />
    </>
  );
};

export default Page;
