import type { FunctionComponent } from "react";
import classNames from "classnames";
import styles from "./Banner.module.css";

type BannerProps = {
  bannerText: string;
  children: React.ReactNode;
  className?: string;
};

export const Banner: FunctionComponent<BannerProps> = ({
  bannerText,
  children,
  className,
}) => {
  return (
    <div className={classNames(styles.main, className)}>
      <p className={styles.bannerText}>{bannerText}</p>
      {children}
    </div>
  );
};
