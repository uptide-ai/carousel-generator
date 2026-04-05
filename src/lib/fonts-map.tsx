type FontInfo = {
  name: string;
  className: string;
};

type FontMap = {
  [fontFamilyName: string]: FontInfo;
};

export const fontsMap: FontMap = {
  // Sans-serif
  Inter: { className: "font-inter", name: "Inter" },
  DM_Sans: { className: "font-dm-sans", name: "DM Sans" },
  Open_Sans: { className: "font-open-sans", name: "Open Sans" },
  Roboto: { className: "font-roboto", name: "Roboto" },
  Roboto_Condensed: { className: "font-roboto-condensed", name: "Roboto Condensed" },
  Lato: { className: "font-lato", name: "Lato" },
  Montserrat: { className: "font-montserrat", name: "Montserrat" },
  Poppins: { className: "font-poppins", name: "Poppins" },
  Raleway: { className: "font-raleway", name: "Raleway" },
  Nunito: { className: "font-nunito", name: "Nunito" },
  Nunito_Sans: { className: "font-nunito-sans", name: "Nunito Sans" },
  Rubik: { className: "font-rubik", name: "Rubik" },
  Work_Sans: { className: "font-work-sans", name: "Work Sans" },
  Quicksand: { className: "font-quicksand", name: "Quicksand" },
  Space_Grotesk: { className: "font-space-grotesk", name: "Space Grotesk" },
  Josefin_Sans: { className: "font-josefin-sans", name: "Josefin Sans" },
  Cabin: { className: "font-cabin", name: "Cabin" },
  Karla: { className: "font-karla", name: "Karla" },
  Barlow: { className: "font-barlow", name: "Barlow" },
  Fira_Sans: { className: "font-fira-sans", name: "Fira Sans" },
  Syne: { className: "font-syne", name: "Syne" },
  GeistSans: { className: "font-geist-sans", name: "Geist Sans" },

  // Serif
  DM_Serif_Display: { className: "font-dm-serif-display", name: "DM Serif Display" },
  PT_Serif: { className: "font-pt-serif", name: "PT Serif" },
  Playfair_Display: { className: "font-playfair-display", name: "Playfair Display" },
  Lora: { className: "font-lora", name: "Lora" },
  Libre_Baskerville: { className: "font-libre-baskerville", name: "Libre Baskerville" },
  Merriweather: { className: "font-merriweather", name: "Merriweather" },
  Bitter: { className: "font-bitter", name: "Bitter" },
  Roboto_Slab: { className: "font-roboto-slab", name: "Roboto Slab" },

  // Display
  Anton: { className: "font-anton", name: "Anton" },
  Oswald: { className: "font-oswald", name: "Oswald" },
  Bebas_Neue: { className: "font-bebas-neue", name: "Bebas Neue" },
  Ultra: { className: "font-ultra", name: "Ultra" },
  ArchivoBlack: { className: "font-archivo-black", name: "Archivo Black" },
};

export function fontIdToClassName(fontId: string) {
  return fontsMap[fontId].className;
}
