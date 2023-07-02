import type { ValidLanguageType } from "@/app/[lang]/types";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { Header } from "@/app/[lang]/components/Header";
import { isLanguageValid } from "@/app/[lang]/utils";
import { defaultLanguage } from "@/app/[lang]/constants";
import { Container } from "@/app/[lang]/ui-kit/WidthContainer";

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

  redirect(`./${lang}/questions`);

  return (
    <>
      <Header
        lang={isLanguageValid(lang) ? lang : defaultLanguage}
        session={session}
      />
      <Container>
        <p>Home</p>
      </Container>
    </>
  );
};

export default Page;
