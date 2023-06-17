import { QuestionRoulette } from "@/app/[lang]/components/QuestionRoulette";
import type { LocalQuestionType, ValidLanguageType } from "@/app/[lang]/types";
import styles from "./QuestionsPage.module.css";

type QuestionsPageProps = {
  lang: ValidLanguageType;
  questions: LocalQuestionType[];
};

export const QuestionsPage = ({ lang, questions }: QuestionsPageProps) => {
  return (
    <div className={styles.main}>
      <QuestionRoulette questions={questions} lang={lang} />
    </div>
  );
};
