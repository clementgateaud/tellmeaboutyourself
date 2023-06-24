import "@/app/[lang]/globals.css";
import { Poppins } from "next/font/google";
import Head from "next/head";

const font = Poppins({
  weight: ["400", "500", "600", "800"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Tell me about yourself",
  description: "Get ready for your next interview",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        ></meta>
      </Head>
      <html className={font.className}>
        <body>{children}</body>
      </html>
    </>
  );
};

export default RootLayout;
