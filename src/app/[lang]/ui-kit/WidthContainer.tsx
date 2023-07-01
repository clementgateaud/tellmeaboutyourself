import type { ReactNode } from "react";
import classNames from "classnames";
import styles from "./WidthContainer.module.css";

type WidthContainerProps = {
  children: ReactNode;
  className?: string;
};

export const WidthContainer = ({
  children,
  className,
}: WidthContainerProps) => {
  return <div className={classNames(styles.main, className)}>{children}</div>;
};
