"use client";

import type { FunctionComponent, ChangeEvent } from "react";
import type {
  QuestionType,
  NoteType,
  ValidLanguageType,
} from "@/app/[lang]/types";
import { Session } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { Container } from "@/app/[lang]/ui-kit/WidthContainer";
import { t } from "@/app/[lang]/utils/translation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/app/[lang]/ui-kit/Button";
import { useRouter } from "next/navigation";
import { Modal } from "@/app/[lang]/ui-kit/Modal";
import { AuthModal } from "@/app/[lang]/components/AuthModal";
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
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [questionNote, setQuestionNote] = useState<NoteType | null>(note);
  const [noteEditMode, setNoteEditMode] = useState(false);
  const [noteCreationMode, setNoteCreationMode] = useState(false);
  const [questionNoteEditionContent, setQuestionNoteEditionContent] = useState(
    questionNote?.content || ""
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const getNote = async (questionId: number): Promise<NoteType> => {
    const supabase = createClientComponentClient();
    const { data: note, error } = await supabase
      .from("notes")
      .select()
      .eq("question_id", questionId)
      .maybeSingle();
    if (error) {
      throw error;
    }
    return note as NoteType;
  };

  useEffect(() => {
    if (!session) {
      setQuestionNote(null);
    } else {
      getNote(question.id).then((note) => setQuestionNote(note));
    }
  }, [session]);

  const handleCreateButtonClick = () => {
    if (!session) {
      setIsAuthModalOpen(true);
    } else {
      setNoteCreationMode(true);
    }
  };

  const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setQuestionNoteEditionContent(event.target.value);
  };

  const handleEditCancel = () => {
    setQuestionNoteEditionContent((questionNote as NoteType).content);
    setNoteEditMode(false);
  };

  const handleCreateCancel = () => {
    setQuestionNoteEditionContent("");
    setNoteCreationMode(false);
  };

  const handleEditValidation = async () => {
    const { data, error } = await supabase
      .from("notes")
      .update({ content: questionNoteEditionContent })
      .eq("question_id", question.id)
      .select();
    if (error) {
      console.log(error);
    } else {
      setQuestionNote(data[0]);
      setNoteEditMode(false);
      router.refresh();
    }
  };

  const handleCreateValidation = async () => {
    const { data, error } = await supabase
      .from("notes")
      .insert({
        question_id: question.id,
        content: questionNoteEditionContent,
        user_id: (session as Session).user.id,
      })
      .select();
    if (error) {
      console.log(error);
    } else {
      setQuestionNote(data[0]);
      setNoteCreationMode(false);
      router.refresh();
    }
  };

  const handleShowDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteNote = async () => {
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("question_id", question.id);
    if (error) {
      console.log(error);
    } else {
      setQuestionNote(null);
      setQuestionNoteEditionContent("");
      setIsDeleteModalOpen(false);
      router.refresh();
    }
  };

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
      {!questionNote && !noteEditMode && !noteCreationMode && (
        <div className={styles.noteEmptyState}>
          <p className={styles.noteEmptyStateText}>
            {t("question_show_note_empty_state", lang)}
          </p>
          <Button onClick={handleCreateButtonClick}>
            {t("question_show_note_create_button", lang)}
          </Button>
        </div>
      )}
      {questionNote && !noteEditMode && (
        <div className={styles.noteContent}>
          {questionNote.content
            .split("\n")
            .map((line, index) =>
              line !== "" ? (
                <p key={index}>{line}</p>
              ) : (
                <p key={index}>&nbsp;</p>
              )
            )}
        </div>
      )}
      {(noteEditMode || noteCreationMode) && (
        <textarea
          className={styles.noteContentTextArea}
          value={questionNoteEditionContent}
          onChange={handleTextAreaChange}
          placeholder={t("question_show_note_placeholder", lang)}
        />
      )}
      <div className={styles.noteButtons}>
        {questionNote && !noteEditMode && (
          <>
            <Button onClick={() => setNoteEditMode(true)}>
              {t("question_show_note_edit_button", lang)}
            </Button>
            <Button variant="ghost" onClick={handleShowDeleteModal}>
              {t("question_show_note_delete_button", lang)}
            </Button>
          </>
        )}
        {noteEditMode && (
          <>
            <Button onClick={handleEditValidation}>
              {t("question_show_note_save_button", lang)}
            </Button>
            <Button variant="ghost" onClick={handleEditCancel}>
              {t("question_show_note_cancel_button", lang)}
            </Button>
          </>
        )}
        {noteCreationMode && (
          <>
            <Button onClick={handleCreateValidation}>
              {t("question_show_note_save_button", lang)}
            </Button>
            <Button variant="ghost" onClick={handleCreateCancel}>
              {t("question_show_note_cancel_button", lang)}
            </Button>
          </>
        )}
      </div>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        className={styles.deleteModal}
      >
        <p className={styles.deleteModalTitle}>
          {t("question_show_note_delete_modal_title", lang)}
        </p>
        <div className={styles.deleteModalButtons}>
          <Button
            onClick={handleDeleteNote}
            className={styles.deleteModalButton}
          >
            {t("question_show_note_delete_modal_delete_button", lang)}
          </Button>
          <Button
            variant="ghost"
            onClick={handleCloseDeleteModal}
            className={styles.deleteModalButton}
          >
            {t("question_show_note_delete_modal_cancel_button", lang)}
          </Button>
        </div>
      </Modal>
      <AuthModal
        lang={lang}
        session={session}
        isModalOpen={isAuthModalOpen}
        setIsModalOpen={setIsAuthModalOpen}
      />
    </Container>
  );
};
