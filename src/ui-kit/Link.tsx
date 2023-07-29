import classNames from "classnames";
import styles from "./Link.module.css";

type LinkProps = {
  href: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
};

export const Link = ({ href, children, className, ...props }: LinkProps) => {
  return (
    <a href={href} className={classNames(className, styles.main)} {...props}>
      {children}
    </a>
  );
};
