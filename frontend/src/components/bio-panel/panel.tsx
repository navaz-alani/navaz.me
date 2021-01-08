import {FC} from "react";

import styles from "./panel.module.css";

const bioEntries: string[] = [
  `I have always had an interest in Mathematics that ripened around the last two
  years of high school. This led me to matriculate as an undergraduate in the
  Faculty of Mathematics at the University of Waterloo.`,
  `It was as an undergraduate that I was first exposed to the realm of Computer
  Science, which I was immediately seduced by. I started exploring on my own by
  working on small Python projects.`,
  `At my first job, I was exposed to frontend and backend web development and I
  learnt how to write webservers, design APIs and construct frontends over these
  backend services.`,
  `After experimenting more, I realised a deeper interest in backend development
  (writing servers, designing APIs etc.). I still do frontend projects to keep up
  with the rate at which new technologies are being developed.`,
  `Of late, I have gained an interest in networking and how the internet works.
  I continue to chase my curiosity, excited to see where it takes me next...`,
];

const BioPanel: FC = () => {
  return (
    <div className={styles["panel"]}>
      <h2>More about me</h2>
      <div className={styles["bio"]}>
        {
          bioEntries.map((entry: string, key: number) => {
            return (
              <div className={styles["bio-entry"]} key={key}>
                {entry}
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

export default BioPanel;
