import type { FunctionComponent } from "react";
import classNamesMaker from "classnames";
import styles from "./Tag.module.css";

type TagProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  color?: "dark" | "accent";
};

export const Tag: FunctionComponent<TagProps> = ({
  label,
  onClick,
  active = false,
  className,
  color = "dark",
  ...restProps
}) => {
  return (
    <div
      onClick={onClick}
      className={classNamesMaker(className, styles.main, {
        [styles["main--active"]]: active,
        [styles["main--dark"]]: color === "dark",
        [styles["main--accent"]]: color === "accent",
      })}
      {...restProps}
    >
      {label}
    </div>
  );
};