"use client";

import type { FunctionComponent } from "react";
import type {
  QuestionType,
  NoteType,
  ValidLanguageType,
} from "@/app/[lang]/types";
import { Note } from "@/app/[lang]/components/Note";
import { Session } from "@supabase/supabase-js";
import { Container } from "@/app/[lang]/ui-kit/WidthContainer";
import { t } from "@/app/[lang]/utils/translation";
import { TiTick } from "react-icons/ti";
import styles from "./QuestionShow.module.css";

type QuestionShowProps = {
  question: QuestionType;
  note: NoteType | null;
  lang: ValidLanguageType;
  session: Session | null;
};

export const QuestionShow: FunctionComponent<QuestionShowProps> = ({
  question,
  lang,
  note,
  session,
}) => {
  return (
    <Container className={styles.pageContainer}>
      <h1 className={styles.questionPrompt}>{question[`prompt_${lang}`]}</h1>
      <h2 className={styles.tipsTitle}>
        {t("question_show_tips_title", lang)} ✨
      </h2>
      <div className={styles.tipsContent}>
        {!question[`tips_${lang}`] && <p>{t("question_show_no_tips", lang)}</p>}
        {question[`tips_${lang}`] && (
          <ul className={styles.tipsList}>
            {question[`tips_${lang}`].map((line, index) => (
              <li key={index} className={styles.tipsListItem}>
                <TiTick className={styles.tipsIcon} />
                {line}
              </li>
            ))}
          </ul>
        )}
      </div>
      <h2 className={styles.noteTitle}>
        {t("question_show_note_title", lang)} ✍️
      </h2>
      <Note
        session={session}
        question={question}
        serverFetchedNote={note}
        lang={lang}
      />
    </Container>
  );
};
