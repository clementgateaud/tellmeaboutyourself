import { use } from "react";
import { Header } from "@/app/[lang]/components/Header";
import { Question } from "@/app/[lang]/components/Question";
import { shuffleArray } from "@/app/[lang]/utils";
import { isLanguageValid } from "@/app/[lang]/utils";
import { defaultLanguage } from "@/app/[lang]/constants";
import type { ValidLanguageType } from "@/app/[lang]/types";

type RawQuestion = {
  id: number;
  attributes: {
    prompt: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;
    locale: ValidLanguageType;
  };
};

type Question = {
  prompt: string;
  id: number;
};

const getQuestions = async (lang: ValidLanguageType): Promise<Question[]> => {
  const response = await fetch(
    `http://localhost:1337/api/questions?locale=${lang}`
  );
  const data = await response.json();
  const rawQuestions = data.data;
  const questions: Question[] = rawQuestions.map((question: RawQuestion) => {
    return {
      prompt: question.attributes.prompt,
      id: question.id,
    };
  });
  return shuffleArray(questions);
};

const Page = ({
  params: { lang },
}: {
  params: {
    lang: ValidLanguageType;
  };
}) => {
  const questions = use(getQuestions(lang));
  return (
    <>
      <Header lang={isLanguageValid(lang) ? lang : defaultLanguage} />
      <Question questions={questions} lang={lang} />
    </>
  );
};

export default Page;
