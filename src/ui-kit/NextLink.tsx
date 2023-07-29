import classNames from "classnames";
import Link from "next/link";
import styles from "./NextLink.module.css";

type NextLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export const NextLink = ({
  href,
  children,
  className,
  ...props
}: NextLinkProps) => {
  return (
    <Link href={href} className={classNames(className, styles.main)} {...props}>
      {children}
    </Link>
  );
};
