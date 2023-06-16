import type { FunctionComponent, ReactNode } from "react";
import styles from "./WidthContainer.module.css";
import classNames from "classnames";

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
