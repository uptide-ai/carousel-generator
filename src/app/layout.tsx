import "./globals.css";
import type { Metadata } from "next";
import {
  Inter,
  PT_Serif,
  Roboto,
  Roboto_Condensed,
  Syne,
  Ultra,
  Archivo_Black,
  Montserrat,
  DM_Sans,
  DM_Serif_Display,
  Open_Sans,
  Lato,
  Oswald,
  Raleway,
  Poppins,
  Playfair_Display,
  Nunito,
  Rubik,
  Work_Sans,
  Lora,
  Bebas_Neue,
  Quicksand,
  Space_Grotesk,
  Libre_Baskerville,
  Josefin_Sans,
  Cabin,
  Karla,
  Bitter,
  Merriweather,
  Roboto_Slab,
  Barlow,
  Nunito_Sans,
  Fira_Sans,
  Anton,
} from "next/font/google";
import { GeistSans, GeistMono } from "geist/font";
import { Toaster } from "@/components/ui/toaster";

const dm_sans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: "variable",
});

const dm_serif_display = DM_Serif_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-serif-display",
  weight: ["400"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: "variable",
});

const pt_serif = PT_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pt-serif",
  weight: ["400", "700"],
});

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
  weight: ["100", "300", "400", "500", "700", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: "variable",
});

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo-black",
  weight: ["400"],
});

const ultra = Ultra({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ultra",
  weight: ["400"],
});

const roboto_condensed = Roboto_Condensed({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-condensed",
  weight: "variable",
});

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-syne",
  weight: "variable",
});

const open_sans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: "variable",
});

const lato = Lato({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lato",
  weight: ["100", "300", "400", "700", "900"],
});

const oswald = Oswald({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-oswald",
  weight: "variable",
});

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-raleway",
  weight: "variable",
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const playfair_display = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair-display",
  weight: "variable",
});

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
  weight: "variable",
});

const rubik = Rubik({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-rubik",
  weight: "variable",
});

const work_sans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
  weight: "variable",
});

const lora = Lora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lora",
  weight: "variable",
});

const bebas_neue = Bebas_Neue({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bebas-neue",
  weight: ["400"],
});

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-quicksand",
  weight: "variable",
});

const space_grotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
  weight: "variable",
});

const libre_baskerville = Libre_Baskerville({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-libre-baskerville",
  weight: ["400", "700"],
});

const josefin_sans = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-josefin-sans",
  weight: "variable",
});

const cabin = Cabin({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cabin",
  weight: "variable",
});

const karla = Karla({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-karla",
  weight: "variable",
});

const bitter = Bitter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bitter",
  weight: "variable",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-merriweather",
  weight: ["300", "400", "700", "900"],
});

const roboto_slab = Roboto_Slab({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-slab",
  weight: "variable",
});

const barlow = Barlow({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-barlow",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const nunito_sans = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito-sans",
  weight: "variable",
});

const fira_sans = Fira_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fira-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const anton = Anton({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-anton",
  weight: ["400"],
});

const allFontVars = [
  dm_sans, dm_serif_display, montserrat, pt_serif, roboto, inter,
  archivoBlack, ultra, roboto_condensed, syne, open_sans, lato,
  oswald, raleway, poppins, playfair_display, nunito, rubik,
  work_sans, lora, bebas_neue, quicksand, space_grotesk,
  libre_baskerville, josefin_sans, cabin, karla, bitter,
  merriweather, roboto_slab, barlow, nunito_sans, fira_sans,
  anton,
].map((f) => f.variable).join(" ");

export const metadata: Metadata = {
  ...(process.env.NEXT_PUBLIC_APP_URL && {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL),
  }),
  title: "Carousel Generator",
  description: "An open source carousel maker for LinkedIn",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${allFontVars} ${GeistSans.variable} flex flex-col min-h-screen items-stretch justify-between antialiased`}
      >
        <div className="flex-1 h-full flex flex-col justify-stretch ">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
