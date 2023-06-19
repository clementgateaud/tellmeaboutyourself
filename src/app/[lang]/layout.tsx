import "@/app/[lang]/globals.css";
import { Poppins } from "next/font/google";

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
    <html className={font.className}>
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
