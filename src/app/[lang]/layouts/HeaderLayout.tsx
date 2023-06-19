import "@/app/[lang]/globals.css";
import { Header } from "@/app/[lang]/components/Header";
import { isLanguageValid } from "@/app/[lang]/utils";
import { defaultLanguage } from "@/app/[lang]/constants";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/database.types";
import type { ReactNode } from "react";
import { ValidLanguageType } from "@/app/[lang]/types";

type HeaderLayoutProps = {
  children: ReactNode;
  lang: ValidLanguageType;
};

export const HeaderLayout = async ({ children, lang }: HeaderLayoutProps) => {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <>
      <Header
        lang={isLanguageValid(lang) ? lang : defaultLanguage}
        session={session}
      />
      {children}
    </>
  );
};
