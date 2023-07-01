"use client";

import type { FunctionComponent } from "react";
import type { LocalQuestionType } from "@/app/[lang]/types";
import { WidthContainer } from "@/app/[lang]/ui-kit/WidthContainer";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import styles from "./QuestionShow.module.css";
import { useRouter } from "next/navigation";

type QuestionShowProps = {
  question: LocalQuestionType;
};

export const QuestionShow: FunctionComponent<QuestionShowProps> = ({
  question,
}) => {
  const router = useRouter();
  return (
    <WidthContainer className={styles.pageContainer}>
      <h1 className={styles.titleContainer}>
        <ArrowLeftIcon
          className={styles.leftIcon}
          onClick={() => router.back()}
        />
        {question.prompt}
      </h1>
    </WidthContainer>
  );
};
