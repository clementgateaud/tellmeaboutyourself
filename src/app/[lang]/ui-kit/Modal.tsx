import type { ReactNode } from "react";
import { MdClose } from "react-icons/md";
import classNamesMaker from "classnames";
import Image from "next/image";
import styles from "./Modal.module.css";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
};

export const Modal = ({ isOpen, onClose, children, className }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.main}>
      <div className={styles.backdrop} onClick={onClose}></div>
      <div className={classNamesMaker(styles.panel, className)}>
        <MdClose onClick={onClose} className={styles.xMarkIcon} />
        {children}
      </div>
    </div>
  );
};
