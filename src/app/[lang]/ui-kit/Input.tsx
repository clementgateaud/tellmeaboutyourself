import classNamesMaker from "classnames";
import type { InputHTMLAttributes } from "react";
import styles from "./Input.module.css";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

export const Input = ({
  label,
  id,
  onChange,
  className,
  ...props
}: InputProps) => {
  return (
    <div className={classNamesMaker(styles.main, className)}>
      {label && <label htmlFor={id}>{label}</label>}
      <input onChange={onChange} className={className} id={id} {...props} />
    </div>
  );
};
