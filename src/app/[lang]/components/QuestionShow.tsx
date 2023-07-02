"use client";

import type { FunctionComponent } from "react";
import type { LocalQuestionType, ValidLanguageType } from "@/app/[lang]/types";
import { Container } from "@/app/[lang]/ui-kit/WidthContainer";
import { t } from "@/app/[lang]/utils/translation";
import styles from "./QuestionShow.module.css";
import { useRouter } from "next/navigation";

type QuestionShowProps = {
  question: LocalQuestionType;
  lang: ValidLanguageType;
};

export const QuestionShow: FunctionComponent<QuestionShowProps> = ({
  question,
  lang,
}) => {
  const router = useRouter();
  return (
    <Container className={styles.pageContainer}>
      <h1>{question.prompt}</h1>
    </Container>
  );
};
