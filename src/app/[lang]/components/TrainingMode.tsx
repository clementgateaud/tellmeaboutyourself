"use client";

import type { QuestionType, ValidLanguageType } from "@/app/[lang]/types";
import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import classnames from "classnames";
import { Container } from "@/app/[lang]/ui-kit/WidthContainer";
import { MdPlayArrow, MdPause } from "react-icons/md";
import { IoMdRefresh } from "react-icons/io";
import { HiArrowRight } from "react-icons/hi";
import { Button } from "@/app/[lang]/ui-kit/Button";
import { t } from "@/app/[lang]/utils/translation";
import styles from "./TrainingMode.module.css";
import { Note } from "@/app/[lang]/components/Note";

type TrainingModeProps = {
  questions: QuestionType[];
  lang: ValidLanguageType;
  session: Session | null;
};

export const TrainingMode = ({
  questions,
  lang,
  session,
}: TrainingModeProps) => {
  const [question, setQuestion] = useState(questions[0]);
  const [questionChanging, setQuestionChanging] = useState(false);
  const [countdown, setCountdown] = useState(question.duration * 1000);
  const [isPaused, setIsPaused] = useState(false);

  const router = useRouter();
  useEffect(() => {
    router.refresh();
  }, []);

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
    if (countdown <= 0) {
      setCountdown(0);
    }
  }, [countdown]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && countdown > 0) {
        setCountdown((prevCountdown) => prevCountdown - 50);
      }
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, [isPaused]);

  if (!question) {
    return null;
  }

  return (
    <Container className={styles.main}>
      <div className={styles.timerContainer}>
        <h1
          className={classnames(styles.prompt, {
            [styles["prompt--changing"]]: questionChanging,
          })}
        >
          {question[`prompt_${lang}`]}
        </h1>
        <div className={styles.timer}>
          <div className={styles.timerBar}>
            <div
              className={styles.timerBarFill}
              style={{
                width: `${
                  100 - (countdown / (question.duration * 1000)) * 100
                }%`,
              }}
            />
          </div>
          <div className={styles.timerActions}>
            {countdown > 0 && (
              <>
                {isPaused ? (
                  <MdPlayArrow
                    onClick={togglePause}
                    className={styles.timerIcon}
                  />
                ) : (
                  <MdPause onClick={togglePause} className={styles.timerIcon} />
                )}
              </>
            )}
            <IoMdRefresh
              className={styles.timerIcon}
              onClick={() => {
                setCountdown(question.duration * 1000);
                setIsPaused(false);
              }}
            />
          </div>
        </div>
        <Button
          className={styles.nextQuestionButton}
          variant={countdown > 0 ? "ghost" : "primary"}
          color="accent"
          onClick={handleQuestionChange}
          icon={<HiArrowRight />}
          iconPosition="right"
        >
          {t("next_question", lang)}
        </Button>
      </div>
      <h2>{t("training_mode_note_title", lang)} ✍️</h2>
      <Note
        session={session}
        question={question}
        lang={lang}
        className={styles.questionNote}
      />
    </Container>
  );
};
