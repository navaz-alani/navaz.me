import React, {useState} from "react";
import {AppProps} from 'next/app';

import ThemeCtx, {ThemeContext} from "@contexts/theme/theme";

import "./global.css";

const MyApp = ({Component, pageProps}: AppProps) => {
  // default theme is set here
  let [theme, setTheme] = useState<ThemeContext>("dark");

  return (
    <ThemeCtx.Provider value={theme}>
      <Component {...pageProps} setTheme={setTheme} />
    </ThemeCtx.Provider>
  );
};

export default MyApp;
