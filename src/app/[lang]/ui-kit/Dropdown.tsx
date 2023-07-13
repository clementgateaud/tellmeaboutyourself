import type { FunctionComponent, ChangeEvent } from "react";
import classNamesMaker from "classnames";
import styles from "./Dropdown.module.css";

type DropdownProps = {
  options: {
    value: string;
    label: string;
  }[];
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
};

export const Dropdown: FunctionComponent<DropdownProps> = ({
  options,
  value,
  onChange,
  className,
}) => {
  return (
    <div className={classNamesMaker(className, styles.dropdownWrapper)}>
      <select value={value} className={styles.dropdown} onChange={onChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
