"use client";

import type { LocalQuestionType, ValidLanguageType } from "@/app/[lang]/types";
import { useEffect, useState } from "react";
import classnames from "classnames";
import { Container } from "@/app/[lang]/ui-kit/WidthContainer";
import styles from "@/app/[lang]/components/QuestionRoulette.module.css";
import { MdPlayCircleFilled, MdPauseCircleFilled } from "react-icons/md";

type QuestionPromptProps = {
  questions: LocalQuestionType[];
  lang: ValidLanguageType;
};

export const QuestionRoulette = ({ questions, lang }: QuestionPromptProps) => {
  const [question, setQuestion] = useState(questions[0]);
  const [questionChanging, setQuestionChanging] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [isPaused, setIsPaused] = useState(false);

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

  const togglePause = () => {
    setIsPaused((prevPaused) => !prevPaused);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isPaused]);

  useEffect(() => {
    if (countdown === 0) {
      handleQuestionChange();
      setCountdown(30);
    }
  }, [countdown]);

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
      <div className={styles.timerContainer}>
        <p className={styles.countDown}>{countdown}</p>
        {isPaused ? (
          <MdPlayCircleFilled onClick={togglePause} />
        ) : (
          <MdPauseCircleFilled onClick={togglePause} />
        )}
      </div>
    </Container>
  );
};
