"use client";

import type { LocalQuestionType, ValidLanguageType } from "@/app/[lang]/types";
import { useEffect, useState } from "react";
import classnames from "classnames";
import { Container } from "@/app/[lang]/ui-kit/WidthContainer";
import styles from "@/app/[lang]/components/QuestionRoulette.module.css";
import { MdPlayArrow, MdPause } from "react-icons/md";
import { IoMdRefresh } from "react-icons/io";
import { HiArrowRight } from "react-icons/hi";

type QuestionPromptProps = {
  questions: LocalQuestionType[];
  lang: ValidLanguageType;
};

export const QuestionRoulette = ({ questions, lang }: QuestionPromptProps) => {
  const [question, setQuestion] = useState(questions[0]);
  const [questionChanging, setQuestionChanging] = useState(false);
  console.log(question.duration);
  const [countdown, setCountdown] = useState(question.duration * 1000);
  const [isPaused, setIsPaused] = useState(false);

  // Go to next question (or start over if at the end)
  const handleQuestionChange = () => {
    setQuestionChanging(true);
    setIsPaused(true);
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
      setIsPaused(false);
    }, 500);
  };

  const togglePause = () => {
    setIsPaused((prevPaused) => !prevPaused);
  };

  useEffect(() => {
    setCountdown(question.duration * 1000);
  }, [question]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setCountdown((prevCountdown) => prevCountdown - 50);
      }
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, [isPaused]);

  useEffect(() => {
    if (countdown <= 0) {
      handleQuestionChange();
    }
  }, [countdown]);

  if (!question) {
    return null;
  }

  return (
    <Container className={styles.main}>
      <h1
        className={classnames(styles.prompt, {
          [styles["prompt--changing"]]: questionChanging,
        })}
      >
        {question.prompt}
      </h1>
      <div className={styles.timer}>
        <div className={styles.timerBar}>
          <div
            className={styles.timerBarFill}
            style={{
              width: `${100 - (countdown / (question.duration * 1000)) * 100}%`,
            }}
          />
        </div>
        <div className={styles.timerActions}>
          {isPaused ? (
            <MdPlayArrow
              onClick={togglePause}
              className={styles.playPauseIcon}
            />
          ) : (
            <MdPause onClick={togglePause} className={styles.playPauseIcon} />
          )}
          <IoMdRefresh
            className={styles.restartIcon}
            onClick={() => {
              setCountdown(question.duration * 1000);
              setIsPaused(false);
            }}
          />
          <HiArrowRight
            className={styles.nextIcon}
            onClick={() => {
              handleQuestionChange();
            }}
          />
        </div>
      </div>
    </Container>
  );
};
