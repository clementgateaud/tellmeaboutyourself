import type { ValidLanguageType } from "@/app/[lang]/types";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Header } from "@/app/[lang]/components/Header";
import { isLanguageValid } from "@/app/[lang]/utils";
import { Container } from "@/app/[lang]/ui-kit/WidthContainer";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

const getUserSession = async () => {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  return session;
};

const Page = async ({
  params: { lang },
}: {
  params: {
    lang: ValidLanguageType;
  };
}) => {
  const session = await getUserSession();

  if (!isLanguageValid(lang)) {
    return notFound();
  }

  return (
    <>
      <Header lang={lang} session={session} />
      <Container className={styles.main}>
        <h1>Home page 🏗️</h1>
      </Container>
    </>
  );
};

export default Page;
