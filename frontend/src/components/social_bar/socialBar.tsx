import {FC} from "react";

import {ThemeContext as ThemeContextT} from "@contexts/theme/theme";

import styles from "./socialBar.module.css";

interface Props {
  theme: ThemeContextT;
};

interface SocialMediaInfo {
  // location of the logo assets (2 files named "logo_(light|dark).webp")
  assetsDir: string;
  // href of the link that clicking the logo should take the user to
  link: string;
};

// social media information to be rendered in the SocialBar
const socials: SocialMediaInfo[] = [
  {assetsDir: "/github_assets", link: "https://github.com/navaz-alani"},
  {assetsDir: "/linkedin_assets", link: "https://www.linkedin.com/in/navazalani/"},
  {assetsDir: "/twitter_assets", link: "https://twitter.com/alani_navaz"},
];

const SocialBar: FC<Props> = (p) => {
  return (
    <div className={styles["social-bar"]}>
      {
        socials.map((smi: SocialMediaInfo, key: number) => {
          return (
            <a key={key}
              href={smi.link}
              target="_blank" /* open link in new tab */
              rel="noopener noreferrer"
            >
              <img className={styles["logo"]}
                src={`${smi.assetsDir}/logo_${p.theme}.webp`}
              />
            </a>
          );
        })
      }
    </div>
  );
};
export default SocialBar;
