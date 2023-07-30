import type { NextPage, GetServerSideProps } from "next";
import type { Session } from "@supabase/supabase-js";
import type { ValidLanguageType } from "@/types";
import { Header } from "@/components/Header";
import Head from "next/head";
import { t } from "@/utils/translation";
import { isLanguageValid } from "@/utils";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { HomePage as HomePageComponent } from "@/components/HomePage";

type HomePageServerSideProps = {
  session: Session | null;
  lang: ValidLanguageType;
};

// eslint-disable-next-line react/prop-types
const HomePage: NextPage<HomePageServerSideProps> = ({ session, lang }) => {
  return (
    <>
      <Head>
        <title>{t("meta_title", lang)}</title>
        <meta name="description" content={t("meta_description", lang)} />
      </Head>
      <Header lang={lang} session={session} />
      <HomePageComponent lang={lang} />
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
