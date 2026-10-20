"use client";

import { useServerInsertedHTML } from "next/navigation";
import { CONSENT, DEFAULT_THEME_MODE, THEME_STORAGE_KEY } from "@/lib/preferences";

const themeInitScript = `(function(){try{var consent=(document.cookie.match(/(?:^|;\\s*)dndela-consent=([^;]+)/)||[])[1];var theme='${DEFAULT_THEME_MODE}';if(consent==='${CONSENT.accepted}'){var m=localStorage.getItem('${THEME_STORAGE_KEY}');if(m==='light'||m==='dark'||m==='system')theme=m;}document.documentElement.setAttribute('data-theme',theme);}catch(e){document.documentElement.setAttribute('data-theme','${DEFAULT_THEME_MODE}');}})();`;

/** Inséré uniquement dans le HTML du serveur. Pas de balise script dans le rendu client, donc le changement de langue ne la recrée pas. */
export default function ThemeInitScript() {
  useServerInsertedHTML(() => (
    <script dangerouslySetInnerHTML={{ __html: themeInitScript }} suppressHydrationWarning />
  ));

  return null;
}
