import "@/app/[lang]/globals.css";
import { Poppins } from "next/font/google";

const font = Poppins({
  weight: "400",
  subsets: ["latin"],
});

export const metadata = {
  title: "Tell me about yourself",
  description: "Get ready for your next interview",
  icons: {
    icon: "/next.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={font.className}>
      <body>{children}</body>
    </html>
  );
}
