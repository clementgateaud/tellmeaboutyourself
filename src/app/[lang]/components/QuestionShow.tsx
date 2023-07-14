"use client";

import type { FunctionComponent, ChangeEvent } from "react";
import type {
  QuestionType,
  NotesType,
  ValidLanguageType,
} from "@/app/[lang]/types";
import { Session } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { Container } from "@/app/[lang]/ui-kit/WidthContainer";
import { t } from "@/app/[lang]/utils/translation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/app/[lang]/ui-kit/Button";
import { Modal } from "@/app/[lang]/ui-kit/Modal";
import { AuthModal } from "@/app/[lang]/components/AuthModal";
import styles from "./QuestionShow.module.css";

type QuestionShowProps = {
  question: QuestionType;
  notes: NotesType | null;
  lang: ValidLanguageType;
  session: Session | null;
};

export const QuestionShow: FunctionComponent<QuestionShowProps> = ({
  question,
  lang,
  notes,
  session,
}) => {
  const supabase = createClientComponentClient();
  const [questionNotes, setQuestionNotes] = useState<NotesType | null>(notes);
  const [notesEditMode, setNotesEditMode] = useState(false);
  const [notesCreationMode, setNotesCreationMode] = useState(false);
  const [questionNotesEditionContent, setQuestionNotesEditionContent] =
    useState(questionNotes?.content || "");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const getNotes = async (questionId: number): Promise<NotesType> => {
    const supabase = createClientComponentClient();
    const { data: notes, error } = await supabase
      .from("notes")
      .select()
      .eq("question_id", questionId)
      .maybeSingle();
    if (error) {
      throw error;
    }
    return notes as NotesType;
  };

  useEffect(() => {
    if (!session) {
      setQuestionNotes(null);
    } else {
      getNotes(question.id).then((notes) => setQuestionNotes(notes));
    }
  }, [session]);

  const handleCreateButtonClick = () => {
    if (!session) {
      setIsAuthModalOpen(true);
    } else {
      setNotesCreationMode(true);
    }
  };

  const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setQuestionNotesEditionContent(event.target.value);
  };

  const handleEditCancel = () => {
    setQuestionNotesEditionContent((questionNotes as NotesType).content);
    setNotesEditMode(false);
  };

  const handleCreateCancel = () => {
    setQuestionNotesEditionContent("");
    setNotesCreationMode(false);
  };

  const handleEditValidation = async () => {
    const { data, error } = await supabase
      .from("notes")
      .update({ content: questionNotesEditionContent })
      .eq("question_id", question.id)
      .select();
    if (error) {
      console.log(error);
    } else {
      setQuestionNotes(data[0]);
    }
    setNotesEditMode(false);
  };

  const handleCreateValidation = async () => {
    const { data, error } = await supabase
      .from("notes")
      .insert({
        question_id: question.id,
        content: questionNotesEditionContent,
        user_id: (session as Session).user.id,
      })
      .select();
    if (error) {
      console.log(error);
    } else {
      setQuestionNotes(data[0]);
    }
    setNotesCreationMode(false);
  };

  const handleShowDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteNotes = async () => {
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("question_id", question.id);
    if (error) {
      console.log(error);
    } else {
      setQuestionNotes(null);
      setQuestionNotesEditionContent("");
    }
    setIsDeleteModalOpen(false);
  };

  useEffect(() => {
    console.log(JSON.stringify(questionNotesEditionContent));
  }, [questionNotesEditionContent]);

  return (
    <Container className={styles.pageContainer}>
      <h1 className={styles.questionPrompt}>{question[`prompt_${lang}`]}</h1>
      <h2 className={styles.tipsTitle}>
        {t("question_show_tips_title", lang)} ✨
      </h2>
      {!question[`tips_${lang}`] && (
        <p className={styles.tipsContent}>{t("question_show_no_tips", lang)}</p>
      )}
      {question[`tips_${lang}`] &&
        question[`tips_${lang}`]
          .split("\n")
          .map((line, index) =>
            line !== "" ? <p key={index}>{line}</p> : <p key={index}>&nbsp;</p>
          )}
      <h2 className={styles.notesTitle}>
        {t("question_show_notes_title", lang)} ✍️
      </h2>
      {!questionNotes && !notesEditMode && !notesCreationMode && (
        <div className={styles.notesEmptyState}>
          <p className={styles.notesEmptyStateText}>
            {t("question_show_notes_empty_state", lang)}
          </p>
          <Button minor onClick={handleCreateButtonClick}>
            {t("question_show_notes_create_button", lang)}
          </Button>
        </div>
      )}
      {questionNotes && !notesEditMode && (
        <div className={styles.notesContent}>
          {questionNotes.content
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
      {(notesEditMode || notesCreationMode) && (
        <textarea
          className={styles.notesContentTextArea}
          value={questionNotesEditionContent}
          onChange={handleTextAreaChange}
          placeholder={t("question_show_notes_placeholder", lang)}
        />
      )}
      <div className={styles.notesButtons}>
        {questionNotes && !notesEditMode && (
          <>
            <Button minor onClick={() => setNotesEditMode(true)}>
              {t("question_show_notes_edit_button", lang)}
            </Button>
            <Button minor variant="ghost" onClick={handleShowDeleteModal}>
              {t("question_show_notes_delete_button", lang)}
            </Button>
          </>
        )}
        {notesEditMode && (
          <>
            <Button minor onClick={handleEditValidation}>
              {t("question_show_notes_save_button", lang)}
            </Button>
            <Button minor variant="ghost" onClick={handleEditCancel}>
              {t("question_show_notes_cancel_button", lang)}
            </Button>
          </>
        )}
        {notesCreationMode && (
          <>
            <Button minor onClick={handleCreateValidation}>
              {t("question_show_notes_save_button", lang)}
            </Button>
            <Button minor variant="ghost" onClick={handleCreateCancel}>
              {t("question_show_notes_cancel_button", lang)}
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
          {t("question_show_notes_delete_modal_title", lang)}
        </p>
        <div className={styles.deleteModalButtons}>
          <Button
            minor
            onClick={handleDeleteNotes}
            className={styles.deleteModalButton}
          >
            {t("question_show_notes_delete_modal_delete_button", lang)}
          </Button>
          <Button
            minor
            variant="ghost"
            onClick={handleCloseDeleteModal}
            className={styles.deleteModalButton}
          >
            {t("question_show_notes_delete_modal_cancel_button", lang)}
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
