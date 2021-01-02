import {FC, useContext} from "react";

import styles from "./repository.module.css";

import getConfig from "next/config";
const {publicRuntimeConfig} = getConfig();

import {Repository as RepositoryT} from "@utils/github/utils";
import ThemeCtx, {ThemeContext} from "@contexts/theme/theme";

interface Props {
  repo: RepositoryT;
};

const Repo: FC<Props> = ({repo}) => {
  let theme: ThemeContext = useContext<ThemeContext>(ThemeCtx);

  return (
    <div className={styles["repo"]}>
      <p className={`${styles["name"]} ${styles[theme]}`}>
        <strong>
          <a href={`https://github.com/${publicRuntimeConfig.GHUser}/${repo.name}`}>
            {repo.name}
          </a>
        </strong>
      </p>
      <p className={`${styles["description"]} ${styles[theme]}`}>
        {repo.description}
      </p>
    </div>
  );
}

export default Repo;
