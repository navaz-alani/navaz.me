import {FC, useContext} from "react";

import styles from "./themeSetter.module.css";

import ThemeCtx, {ThemeContext as ThemeContextT} from "@contexts/theme/theme";

interface Props {
  setTheme: (theme: ThemeContextT) => void;
};

const ThemeSetter: FC<Props> = ({setTheme}) => {
  let theme: ThemeContextT = useContext<ThemeContextT>(ThemeCtx);
  return (
    <div className={styles["theme-setter"] + " " + styles[theme]}>
      <div className={styles["icon"]} onClick={() => setTheme("light")}>☀️ </div>
      <div className={styles["icon"]} onClick={() => setTheme("dark")}>🌙</div>
    </div>
  );
}

export default ThemeSetter;
