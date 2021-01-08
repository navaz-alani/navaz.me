import {FC, useContext} from "react";

import styles from "./panel.module.css";

import SocialBar from "@components/social_bar/socialBar";
import ThemeSetter from "@components/theme_setter/themeSetter";
import ThemeCtx, {ThemeContext} from "@contexts/theme/theme";


interface Props {
  setTheme: (theme: ThemeContext) => void
}

const HeroPanel: FC<Props> = ({setTheme}) => {
  const themeCtx = useContext(ThemeCtx);

  return (
    <div className={styles["about-me-panel"]}>
      <picture>
        <source srcSet="/me.webp" type="image/webp" />
        <img className={styles["about-me-img"]}
          src={"me.jpg"}
          alt="Image of Navaz Alani"
        />
      </picture>
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
