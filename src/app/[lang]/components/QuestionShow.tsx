"use client";

import type { FunctionComponent } from "react";
import type { LocalQuestionType, ValidLanguageType } from "@/app/[lang]/types";
import { WidthContainer } from "@/app/[lang]/ui-kit/WidthContainer";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
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
    <WidthContainer className={styles.pageContainer}>
      <p className={styles.backNav}>
        <ArrowLeftIcon
          className={styles.leftIcon}
          onClick={() => router.back()}
        />
        {t("questions", lang)}
      </p>
      <h1>{question.prompt}</h1>
    </WidthContainer>
  );
};
