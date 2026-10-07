"use client";

import { useServerInsertedHTML } from "next/navigation";

const themeInitScript = `(function(){try{var m=localStorage.getItem('dndela-theme-mode')||'system';document.documentElement.setAttribute('data-theme',m);}catch(e){document.documentElement.setAttribute('data-theme','system');}})();`;

/** Inséré uniquement dans le HTML du serveur. Pas de balise script dans le rendu client, donc le changement de langue ne la recrée pas. */
export default function ThemeInitScript() {
  useServerInsertedHTML(() => (
    <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
  ));

  return null;
}
