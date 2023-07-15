import type { FunctionComponent } from "react";
import type {
  NoteType,
  QuestionType,
  ValidLanguageType,
} from "@/app/[lang]/types";
import type { Session } from "@supabase/supabase-js";
import classNamesMaker from "classnames";
import { useEffect, useState, ChangeEvent } from "react";
import { Button } from "@/app/[lang]/ui-kit/Button";
import { Modal } from "@/app/[lang]/ui-kit/Modal";
import { AuthModal } from "@/app/[lang]/components/AuthModal";
import { t } from "@/app/[lang]/utils/translation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import styles from "./Note.module.css";

type NoteProps = {
  session: Session | null;
  question: QuestionType;
  lang: ValidLanguageType;
  serverFetchedNote?: NoteType | null;
  className?: string;
};

export const Note: FunctionComponent<NoteProps> = ({
  session,
  question,
  lang,
  serverFetchedNote,
  className,
}) => {
  const supabase = createClientComponentClient();

  const getNote = async (questionId: number): Promise<NoteType> => {
    setIsNoteLoading(true);
    const supabase = createClientComponentClient();
    const { data: note, error } = await supabase
      .from("notes")
      .select()
      .eq("question_id", questionId)
      .maybeSingle();
    if (error) {
      throw error;
    }
    setIsNoteLoading(false);
    return note as NoteType;
  };

  const [questionNote, setQuestionNote] = useState<NoteType | null>(
    serverFetchedNote || null
  );
  const [noteEditMode, setNoteEditMode] = useState(false);
  const [noteCreationMode, setNoteCreationMode] = useState(false);
  const [questionNoteEditionContent, setQuestionNoteEditionContent] = useState(
    questionNote?.content || ""
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNoteLoading, setIsNoteLoading] = useState(false);
  const [isNoteTooShort, setIsNoteTooShort] = useState(false);

  useEffect(() => {
    if (!session) {
      setQuestionNote(null);
    } else {
      if (serverFetchedNote) {
        setQuestionNote(serverFetchedNote);
      } else {
        getNote(question.id).then((fetchedNote) =>
          setQuestionNote(fetchedNote)
        );
      }
    }
    setNoteEditMode(false);
    setNoteCreationMode(false);
  }, [session, serverFetchedNote, question.id]);

  useEffect(() => {
    setQuestionNoteEditionContent(questionNote?.content || "");
  }, [questionNote]);

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
    setIsNoteTooShort(false);
  };

  const handleCreateCancel = () => {
    setQuestionNoteEditionContent("");
    setNoteCreationMode(false);
    setIsNoteTooShort(false);
  };

  const handleEditValidation = async () => {
    if (questionNoteEditionContent === "") {
      setIsNoteTooShort(true);
    } else {
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
        setIsNoteTooShort(false);
      }
    }
  };

  const handleCreateValidation = async () => {
    if (questionNoteEditionContent === "") {
      setIsNoteTooShort(true);
    } else {
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
        setIsNoteTooShort(false);
      }
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
    }
  };

  if (isNoteLoading) {
    return null;
  }

  return (
    <div className={classNamesMaker(className, styles.main)}>
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
        <div className={styles.noteContentTextAreaContainer}>
          <textarea
            className={styles.noteContentTextArea}
            value={questionNoteEditionContent}
            onChange={handleTextAreaChange}
            placeholder={t("question_show_note_placeholder", lang)}
            minLength={1}
          />
          {isNoteTooShort && (
            <p className={styles.tooShortError}>
              {t("question_show_note_too_short_error", lang)}
            </p>
          )}
        </div>
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
    </div>
  );
};
