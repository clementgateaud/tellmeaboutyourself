"use client";

import type { FunctionComponent } from "react";
import type {
  QuestionType,
  QuestionTagType,
  ValidLanguageType,
  NoteType,
} from "@/types";
import { useState } from "react";
import { Container } from "@/ui-kit/Container";
import { useRouter } from "next/router";
import Link from "next/link";
import { Tag } from "@/ui-kit/Tag";
import { Tooltip } from "@/ui-kit/Tooltip";
import { t } from "@/utils/translation";
import { Button } from "@/ui-kit/Button";
import { BiSolidTimer } from "react-icons/bi";
import { PiNoteDuotone } from "react-icons/pi";
import styles from "./QuestionsListing.module.css";

type QuestionsListingProps = {
  questions: QuestionType[];
  notes: NoteType[];
  lang: ValidLanguageType;
};

export const QuestionsListing: FunctionComponent<QuestionsListingProps> = ({
  questions,
  notes,
  lang,
}) => {
  const router = useRouter();
  const TAGS: { value: QuestionTagType; label: string }[] = [
    {
      value: "motivation",
      label: t("tag_motivation", lang),
    },
    {
      value: "salary",
      label: t("tag_salary", lang),
    },
    {
      value: "profile",
      label: t("tag_profile", lang),
    },
    {
      value: "experience",
      label: t("tag_experience", lang),
    },
    {
      value: "project",
      label: t("tag_project", lang),
    },
  ];

  const initialTag = router.query.tag as QuestionTagType | null;

  const initialFilteredQuestions = initialTag
    ? questions.filter((question) => question.tag === initialTag)
    : questions;

  const [filteredQuestions, setFilteredQuestions] = useState(
    initialFilteredQuestions
  );
  const [activeTag, setActiveTag] = useState<QuestionTagType | "all">(
    initialTag || "all"
  );

  return (
    <Container className={styles.main}>
      <h1 className={styles.listingTitle}>{t("listing_title", lang)}</h1>
      <div className={styles.tags}>
        <Tag
          label={t("tag_all", lang)}
          className={styles.tagAll}
          active={activeTag === "all"}
          onClick={() => {
            setActiveTag("all");
            setFilteredQuestions(questions);
            router.push(`/${lang}/questions`, undefined, { shallow: true });
          }}
        />
        {TAGS.map((tag) => (
          <Tag
            key={tag.value}
            label={tag.label}
            active={activeTag === tag.value}
            onClick={() => {
              setActiveTag(tag.value);
              setFilteredQuestions(
                questions.filter((question) => question.tag === tag.value)
              );
              router.push(`/${lang}/questions?tag=${tag.value}`);
            }}
            className={styles.tag}
          />
        ))}
      </div>
      <div className={styles.questions}>
        {filteredQuestions.map((question) => (
          <Link
            href={`/${lang}/questions/${question.id}`}
            className={styles.questionLink}
            key={question.id}
          >
            <div className={styles.questionContainer}>
              {question[`prompt_${lang}`]}
              {notes.find((note) => note.question_id === question.id) && (
                <Tooltip
                  text={t("questions_listing_note_tooltip", lang)}
                  position="left"
                  className={styles.questionNoteIconTooltip}
                >
                  <PiNoteDuotone className={styles.questionNoteIcon} />
                </Tooltip>
              )}
            </div>
          </Link>
        ))}
      </div>
      <div className={styles.trainingModeContainer}>
        <Button
          color="accent"
          icon={<BiSolidTimer />}
          iconPosition="right"
          onClick={() => router.push(`/${lang}/training`)}
        >
          {t("training_mode", lang)}
        </Button>
      </div>
    </Container>
  );
};
