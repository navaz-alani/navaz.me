import React from 'react';

export type ThemeContext = "light" | "dark";

let ThemeCtx = React.createContext<ThemeContext>("light");

export default ThemeCtx;
