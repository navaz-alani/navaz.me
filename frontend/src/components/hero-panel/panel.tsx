import {FC, useContext, useEffect, useState} from "react";

import styles from "./panel.module.css";

import SocialBar from "@components/social_bar/socialBar";
import ThemeSetter from "@components/theme_setter/themeSetter";
import ThemeCtx, {ThemeContext} from "@contexts/theme/theme";
import webpSupported from "@utils/webpSupport";


interface Props {
  setTheme: (theme: ThemeContext) => void
}

const HeroPanel: FC<Props> = ({setTheme}) => {
  let [webpSupport, setWebpSupport] = useState<boolean>(false);
  useEffect(() => setWebpSupport(webpSupported()), []);

  const themeCtx = useContext(ThemeCtx);

  return (
    <div className={styles["about-me-panel"]}>
      <img className={styles["about-me-img"]}
        src={`/me.${webpSupport ? "webp" : "jpg"}`}
        alt="Image of Navaz Alani"
      />
      <h1>Welcome!</h1>
      <div>
        <p>I'm <i>Navaz Alani.</i></p>
        <p>
          Mathematics Undergrad @UWaterloo <br />
                Programmer
        </p>
        <p className={styles["scroll-prompt"]}>
          <i>Scroll down, or check out these links</i>
        </p>
      </div>
      <SocialBar theme={themeCtx} />
      <ThemeSetter setTheme={setTheme} />
    </div>
  );
}

export default HeroPanel;
