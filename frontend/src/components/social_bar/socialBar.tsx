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
  // alt text for logo
  alt: string;
  // title of the link
  title: string;
};

// social media information to be rendered in the SocialBar
const socials: SocialMediaInfo[] = [
  {
    assetsDir: "/github_assets",
    link: "https://github.com/navaz-alani",
    alt: "GitHub logo",
    title: "Link to my GitHub page",
  },
  {
    assetsDir: "/linkedin_assets",
    link: "https://www.linkedin.com/in/navazalani/",
    alt: "LinkedIn logo",
    title: "Link to my LinkedIn page",
  },
  {
    assetsDir: "/twitter_assets",
    link: "https://twitter.com/alani_navaz",
    alt: "Twitter logo",
    title: "Link to my Twitter page",
  },
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
              title={smi.title}
            >
              <picture>
                <source srcSet={`${smi.assetsDir}/logo_${p.theme}.webp`} type="image/webp" />
                <img className={styles["logo"]}
                  src={`${smi.assetsDir}/logo_${p.theme}.png`}
                  alt={smi.alt}
                />
              </picture>
            </a>
          );
        })
      }
    </div>
  );
};
export default SocialBar;
