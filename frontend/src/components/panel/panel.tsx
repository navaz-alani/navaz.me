import {FC, useState, useEffect} from "react";

import styles from "./panel.module.css";
import patterns from "./pattern";

import {ThemeContext as ThemeContextT} from "@contexts/theme/theme";

// Props definition for Panel component.
interface Props {
  bgPattern?: string;
  fgPattern?: string;
  theme: ThemeContextT;
};

/*
* Panel is a responsive component which covers the entire width of the parent
* element, sets the background and foreground of the panel component.
 * */
const Panel: FC<Props> = (p) => {
  let theme: ThemeContextT = p.theme;
  // default panel patterns (dependent on theme)
  let [defaults, setDefaults] = useState<{bg: string; fg: string;}>({bg: "", fg: ""});
  useEffect(() => {
    setDefaults({
      bg: "isometric",
      fg: "polka",
    });
  }, [theme])
  // generate the classes for the panel
  let [classes, setClasses] = useState<{bg: string; fg: string;}>({bg: "", fg: ""});
  useEffect(() => {
    setClasses({
      bg: `
        ${styles["background"]} ${patterns.get(`_base-${theme}`)}
        ${patterns.get(`${(p.bgPattern === undefined || p.bgPattern === "")
        ? defaults.bg : p.bgPattern}-${theme}`)}
      `,
      fg: `
        ${styles["foreground"]} ${patterns.get(`_base-${theme}`)}
        ${styles["slide-in__disabled"]}
        ${patterns.get(`${(p.fgPattern === undefined || p.fgPattern === "")
        ? defaults.fg : p.fgPattern}-${theme}`)}
      `,
    });
  }, [defaults, theme]);

  return (
    <div className={classes.bg}>
      <div className={classes.fg}>
        {p.children}
      </div>
    </div>
  );
}

export default Panel;
