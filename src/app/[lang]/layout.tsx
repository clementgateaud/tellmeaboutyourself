import "@/app/[lang]/globals.css";
import { Header } from "@/app/[lang]/components/Header";
import { isLanguageValid } from "@/app/[lang]/utils";
import { defaultLanguage } from "@/app/[lang]/constants";
import { Poppins } from "next/font/google";

const font = Poppins({
  weight: ["400", "600", "800"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Tell me about yourself",
  description: "Get ready for your next interview",
};

const RootLayout = ({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: {
    lang: string;
  };
}) => {
  return (
    <html className={font.className}>
      <body>
        <>
          <Header lang={isLanguageValid(lang) ? lang : defaultLanguage} />
          {children}
        </>
      </body>
    </html>
  );
};

export default RootLayout;
