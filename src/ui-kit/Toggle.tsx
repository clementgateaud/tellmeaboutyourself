import type { FunctionComponent } from "react";
import classNames from "classnames";
import styles from "./Toggle.module.css";

type ToggleProps = {
  checked: boolean;
  onChange: () => void;
  className?: string;
};

export const Toggle: FunctionComponent<ToggleProps> = ({
  checked,
  onChange,
  className,
}) => {
  return (
    <label className={classNames(className, styles.switch)}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className={styles.slider}></span>
    </label>
  );
};
