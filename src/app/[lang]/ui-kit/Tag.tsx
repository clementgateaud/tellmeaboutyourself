import type { FunctionComponent } from "react";
import classNamesMaker from "classnames";
import styles from "./Tag.module.css";

type TagProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
};

export const Tag: FunctionComponent<TagProps> = ({
  label,
  onClick,
  active = false,
  className,
  ...restProps
}) => {
  return (
    <div
      onClick={onClick}
      className={classNamesMaker(className, styles.main, {
        [styles["main--active"]]: active,
      })}
      {...restProps}
    >
      {label}
    </div>
  );
};
