import type { ReactNode, ButtonHTMLAttributes } from "react";
import classnames from "classnames";
import styles from "./Button.module.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "ghost";
  color?: "dark" | "accent";
  onClick?: () => void;
  minor?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
};

export const Button = ({
  children,
  variant = "primary",
  color = "dark",
  onClick,
  minor = false,
  icon,
  iconPosition = "left",
  className,
  ...restProps
}: ButtonProps) => {
  return (
    <button
      className={classnames(className, styles.main, {
        [styles["main--dark"]]: color === "dark",
        [styles["main--accent"]]: color === "accent",
        [styles["main--primary"]]: variant === "primary",
        [styles["main--ghost"]]: variant === "ghost",
        [styles["main--minor"]]: minor,
      })}
      onClick={onClick}
      {...restProps}
    >
      {icon && iconPosition === "left" && (
        <span className={classnames(styles.icon, styles.leftIcon)}>{icon}</span>
      )}
      {children}
      {icon && iconPosition === "right" && (
        <span className={classnames(styles.icon, styles.rightIcon)}>
          {icon}
        </span>
      )}
    </button>
  );
};
