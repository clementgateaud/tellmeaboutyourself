import type { FunctionComponent } from "react";
import type { LocalQuestionType } from "@/app/[lang]/types";
import { WidthContainer } from "@/app/[lang]/ui-kit/WidthContainer";
import Link from "next/link";
import styles from "./QuestionsListing.module.css";

type QuestionsListingProps = {
  questions: LocalQuestionType[];
};

export const QuestionsListing: FunctionComponent<QuestionsListingProps> = ({
  questions,
}) => {
  return (
    <WidthContainer className={styles.main}>
      <div className={styles.questions}>
        {questions.map((question) => (
          <Link
            href={`./questions/${question.id}`}
            className={styles.questionLink}
          >
            <div className={styles.questionContainer}>{question.prompt}</div>
          </Link>
        ))}
      </div>
    </WidthContainer>
  );
};
