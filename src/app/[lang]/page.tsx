import { Header } from "@/app/[lang]/components/Header";
import { Question } from "@/app/[lang]/components/Question";
import { shuffleArray } from "@/app/[lang]/utils";
import { isLanguageValid } from "@/app/[lang]/utils";
import { defaultLanguage } from "@/app/[lang]/constants";
import rawQuestions from "@/data/questions.json";
import type {
  ValidLanguageType,
  RawQuestionType,
  LocalQuestionType,
} from "@/app/[lang]/types";

const getLocalQuestions = (
  rawQuestions: RawQuestionType[],
  lang: ValidLanguageType
): LocalQuestionType[] => {
  return rawQuestions.map(({ id, prompt }) => ({
    id,
    prompt: prompt[lang],
  }));
};

const Page = ({
  params: { lang },
}: {
  params: {
    lang: ValidLanguageType;
  };
}) => {
  const localQuestions = shuffleArray(getLocalQuestions(rawQuestions, lang));
  return (
    <>
      <Header lang={isLanguageValid(lang) ? lang : defaultLanguage} />
      <Question questions={localQuestions} lang={lang} />
    </>
  );
};

export default Page;
