"use client";

import { useState } from "react";
import Image from "next/image";
import refreshIcon from "@/app/[lang]/assets/refreshIcon.svg";
import classnames from "classnames";
import { Poppins } from "next/font/google";
import styles from "@/app/[lang]/components/Question.module.css";
import type { LocalQuestionType, ValidLanguageType } from "@/app/[lang]/types";
import { WidthContainer } from "@/app/[lang]/components/WidthContainer";

const font = Poppins({
  weight: "900",
  style: "italic",
  subsets: ["latin"],
});

type QuestionPromptProps = {
  questions: LocalQuestionType[];
  lang: ValidLanguageType;
};

export const Question = ({ questions }: QuestionPromptProps) => {
  const [question, setQuestion] = useState(questions[0]);
  const [questionChanging, setQuestionChanging] = useState(false);

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

  if (!question) {
    return null;
  }

  return (
    <WidthContainer
      className={classnames(styles.main, {
        [styles.questionChanging]: questionChanging,
      })}
    >
      <button className={styles.newQuestionButton}>
        <Image
          src={refreshIcon}
          alt="next question"
          onClick={handleQuestionChange}
          className={styles.newQuestionIcon}
          width={35}
          height={35}
        />
      </button>
      <h1 className={classnames(font.className, styles.prompt)}>
        {question.prompt}
      </h1>
    </WidthContainer>
  );
};
