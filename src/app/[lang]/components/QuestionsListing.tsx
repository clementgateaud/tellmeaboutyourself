"use client";

import type { FunctionComponent } from "react";
import type { LocalQuestionType, ValidLanguageType } from "@/app/[lang]/types";
import { Container } from "@/app/[lang]/ui-kit/WidthContainer";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tag } from "@/app/[lang]/ui-kit/Tag";
import { t } from "@/app/[lang]/utils/translation";
import { Button } from "@/app/[lang]/ui-kit/Button";
import { BiSolidTimer } from "react-icons/bi";
import styles from "./QuestionsListing.module.css";

type QuestionsListingProps = {
  questions: LocalQuestionType[];
  lang: ValidLanguageType;
};

export const QuestionsListing: FunctionComponent<QuestionsListingProps> = ({
  questions,
  lang,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentTags = searchParams
    .get("tags")
    ?.split(",")
    .filter((tag) => tag !== "");

  const getNewTagsQueryParams = (tag: string) => {
    if (currentTags?.includes(tag)) {
      return currentTags.filter((currentTag) => currentTag !== tag).join(",");
    } else {
      return currentTags ? [...currentTags, tag].join(",") : tag;
    }
  };

  const TAGS = [
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
  return (
    <Container className={styles.main}>
      <h1 className={styles.listingTitle}>{t("listing_title", lang)}</h1>
      <div className={styles.tags}>
        <Tag
          label={t("tag_all", lang)}
          className={styles.tagAll}
          onClick={() => {
            router.push(`./questions`);
          }}
          active={!currentTags?.length}
        />
        {TAGS.map((tag) => (
          <Tag
            key={tag.value}
            label={tag.label}
            active={currentTags?.includes(tag.value)}
            onClick={() => {
              router.push(
                `./questions?tags=${getNewTagsQueryParams(tag.value)}`
              );
            }}
            className={styles.tag}
          />
        ))}
      </div>
      <div className={styles.questions}>
        {questions.map((question) => (
          <Link
            href={`./questions/${question.id}`}
            className={styles.questionLink}
            key={question.id}
          >
            <div className={styles.questionContainer}>{question.prompt}</div>
          </Link>
        ))}
      </div>
      <div className={styles.trainingModeContainer}>
        <Button
          color="accent"
          icon={<BiSolidTimer />}
          iconPosition="right"
          onClick={() => router.push("./questions/training")}
        >
          {t("training_mode", lang)}
        </Button>
      </div>
    </Container>
  );
};
