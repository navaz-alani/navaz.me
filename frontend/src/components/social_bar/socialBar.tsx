import {FC, useEffect, useState} from "react";

import {ThemeContext as ThemeContextT} from "@contexts/theme/theme";

import styles from "./socialBar.module.css";
import webpSupported from "@utils/webpSupport";

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
  let [webpSupport, setWebpSupport] = useState<boolean>(false);
  useEffect(() => setWebpSupport(webpSupported()), []);

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
              <img className={styles["logo"]}
                src={`${smi.assetsDir}/logo_${p.theme}.${webpSupport ? "webp" : "png"}`}
                alt={smi.alt}
              />
            </a>
          );
        })
      }
    </div>
  );
};
export default SocialBar;
