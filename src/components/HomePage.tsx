import type { FunctionComponent } from "react";
import type { ValidLanguageType } from "@/types";
import classNames from "classnames";
import { useState, useEffect } from "react";
import { Container } from "@/ui-kit/Container";
import { t } from "@/utils/translation";
import { FaList } from "react-icons/fa";
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import { BiTimer } from "react-icons/bi";
import { PiNoteDuotone } from "react-icons/pi";
import { useRouter } from "next/router";
import styles from "./HomePage.module.css";
import { Button } from "@/ui-kit/Button";

type HomePageProps = {
  lang: ValidLanguageType;
};

export const HomePage: FunctionComponent<HomePageProps> = ({ lang }) => {
  type TitleWordColored = 1 | 2 | 3;
  const [titleWordColored, setTitleWordColored] = useState<TitleWordColored>(1);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleWordColored((prevWord) =>
        prevWord < 3 ? ((prevWord + 1) as TitleWordColored) : 1
      );
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [titleWordColored]);

  return (
    <Container className={styles.main}>
      <div className={styles.heroBanner}>
        <h1 className={styles.heroTitle}>
          <span
            className={classNames(styles.heroTitleWord, {
              [styles.heroTitleWordColored]: titleWordColored === 1,
            })}
          >
            {t("home_page_title_1", lang)}
          </span>
          <span
            className={classNames(styles.heroTitleWord, {
              [styles.heroTitleWordColored]: titleWordColored === 2,
            })}
          >
            {t("home_page_title_2", lang)}
          </span>
          <span
            className={classNames(styles.heroTitleWord, {
              [styles.heroTitleWordColored]: titleWordColored === 3,
            })}
          >
            {t("home_page_title_3", lang)}
          </span>
        </h1>
        <p className={styles.heroSubTitle}>{t("home_page_sub_title", lang)}</p>
        <div className={styles.callToActions}>
          <Button onClick={() => router.push(`/${lang}/questions`)}>
            {t("home_page_cta_1", lang)}
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push(`/${lang}/training`)}
          >
            {t("home_page_cta_2", lang)}
          </Button>
        </div>
      </div>
      <div className={styles.cards}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            <FaList
              className={classNames(
                styles.cardTitleIcon,
                styles.cardTitleIconList
              )}
            />
            {t("home_page_card_1_title", lang)}
          </h3>
          <p className={styles.cardContent}>
            {t("home_page_card_1_content", lang)}
          </p>
        </div>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            <MdOutlineTipsAndUpdates
              className={classNames(
                styles.cardTitleIcon,
                styles.cardTitleIconTips
              )}
            />
            {t("home_page_card_2_title", lang)}
          </h3>
          <p className={styles.cardContent}>
            {t("home_page_card_2_content", lang)}
          </p>
        </div>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            <PiNoteDuotone
              className={classNames(
                styles.cardTitleIcon,
                styles.cardTitleIconNote
              )}
            />
            {t("home_page_card_3_title", lang)}
          </h3>
          <p className={styles.cardContent}>
            {t("home_page_card_3_content", lang)}
          </p>
        </div>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            <BiTimer
              className={classNames(
                styles.cardTitleIcon,
                styles.cardTitleIconTimer
              )}
            />
            {t("home_page_card_4_title", lang)}
          </h3>
          <p className={styles.cardContent}>
            {t("home_page_card_4_content", lang)}
          </p>
        </div>
      </div>
    </Container>
  );
};
