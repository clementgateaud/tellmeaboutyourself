import type { FunctionComponent, ReactNode } from "react";
import classNamesMaker from "classnames";
import styles from "./Tooltip.module.css";

type TooltipProps = {
  children: ReactNode;
  text: string;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
};

export const Tooltip: FunctionComponent<TooltipProps> = ({
  children,
  text,
  position = "top",
  className,
}) => {
  return (
    <div
      className={classNamesMaker(className, styles.tooltip, {
        [styles["tooltip--top"]]: position === "top",
        [styles["tooltip--bottom"]]: position === "bottom",
        [styles["tooltip--left"]]: position === "left",
        [styles["tooltip--right"]]: position === "right",
      })}
    >
      {children}
      <span className={styles.tooltipText}>{text}</span>
    </div>
  );
};
