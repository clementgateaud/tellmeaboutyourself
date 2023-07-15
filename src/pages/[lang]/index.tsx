import type { NextPage, GetServerSideProps } from "next";
import type { Session } from "@supabase/supabase-js";
import type { ValidLanguageType } from "@/types";
import { Header } from "@/components/Header";
import { t } from "@/utils/translation";
import { isLanguageValid } from "@/utils";
import { Container } from "@/ui-kit/Container";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import styles from "./index.module.css";

type HomePageServerSideProps = {
  session: Session | null;
  lang: ValidLanguageType;
};

// eslint-disable-next-line react/prop-types
const HomePage: NextPage<HomePageServerSideProps> = ({ session, lang }) => {
  return (
    <>
      <Header lang={lang} session={session} />
      <Container className={styles.main}>
        <h1>{t("home_page_title", lang)} 🏗️</h1>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  HomePageServerSideProps
> = async (context) => {
  const supabase = createPagesServerClient(context);

  const getUserSession = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }
    return session;
  };

  const lang = context.query.lang as ValidLanguageType;

  if (!isLanguageValid(lang)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const session = await getUserSession();

  return {
    props: {
      session,
      lang,
    },
  };
};

export default HomePage;
