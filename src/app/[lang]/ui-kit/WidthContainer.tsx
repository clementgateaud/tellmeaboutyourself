import type { ReactNode } from "react";
import classNames from "classnames";
import styles from "./Container.module.css";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export const Container = ({ children, className }: ContainerProps) => {
  return <div className={classNames(styles.main, className)}>{children}</div>;
};
