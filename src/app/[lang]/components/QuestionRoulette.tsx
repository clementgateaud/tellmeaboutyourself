"use client";

import type { LocalQuestionType, ValidLanguageType } from "@/app/[lang]/types";
import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import classnames from "classnames";
import { Container } from "@/app/[lang]/ui-kit/WidthContainer";
import { Button } from "@/app/[lang]/ui-kit/Button";
import { t } from "@/app/[lang]/utils/translation";
import styles from "@/app/[lang]/components/QuestionRoulette.module.css";

type QuestionPromptProps = {
  questions: LocalQuestionType[];
  lang: ValidLanguageType;
  session: Session | null;
};

export const QuestionRoulette = ({
  questions,
  lang,
  session,
}: QuestionPromptProps) => {
  const [question, setQuestion] = useState(questions[0]);
  const [questionChanging, setQuestionChanging] = useState(false);

  const router = useRouter();

  // Go to next question (or start over if at the end)
  const handleQuestionChange = () => {
    setQuestionChanging(true);
    // wait for the animation to be halfway done before changing the question
    setTimeout(() => {
      const currentIndex = questions.indexOf(question);
      setQuestion(
        currentIndex === questions.length - 1
          ? questions[0]
          : questions[currentIndex + 1]
      );
    }, 250);
    // wait for the animation to be done before removing the class
    setTimeout(() => {
      setQuestionChanging(false);
    }, 500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleQuestionChange();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [question]);

  if (!question) {
    return null;
  }

  return (
    <Container
      className={classnames(styles.main, {
        [styles.questionChanging]: questionChanging,
      })}
    >
      <h1 className={classnames(styles.prompt)}>{question.prompt}</h1>
      <Button
        variant="ghost"
        color="accent"
        onClick={() => {
          router.push(`/${lang}/questions`);
        }}
        className={styles.ctaButton}
      >
        {t("see_all_questions", lang)}
      </Button>
      {/* {session && (
        <>
          <p>{session.user.email}</p>
          <p>{session.user.id}</p>
        </>
      )} */}
    </Container>
  );
};
