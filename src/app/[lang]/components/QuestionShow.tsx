"use client";

import type { FunctionComponent } from "react";
import type { LocalQuestionType } from "@/app/[lang]/types";
import { Container } from "@/app/[lang]/ui-kit/WidthContainer";
import styles from "./QuestionShow.module.css";

type QuestionShowProps = {
  question: LocalQuestionType;
};

export const QuestionShow: FunctionComponent<QuestionShowProps> = ({
  question,
}) => {
  return (
    <Container className={styles.pageContainer}>
      <h1>{question.prompt}</h1>
    </Container>
  );
};
