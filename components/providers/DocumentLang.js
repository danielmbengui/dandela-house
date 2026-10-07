"use client";

import { useLayoutEffect } from "react";

export default function DocumentLang({ locale }) {
  useLayoutEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
