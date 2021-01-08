import {FC, useEffect, useState} from "react";

import styles from "./panel.module.css";

import Repo from "@components/github/repository";
import {getProjects, Repository} from "@utils/github/utils";

const ProjectsPanel: FC = () => {
  // project repositories state
  let [repos, setRepos] = useState<Repository[]>([]);
  let [repoErr, setRepoErr] = useState<string>("");
  useEffect(() => {
    getProjects()
      .then((repos: Repository[]) => setRepos(repos))
      .catch(() => setRepoErr("An error occurred."))
  }, [])

  return (
    <div className={styles["projects-panel"]}>
      <h2>Projects</h2>
      <div className={styles["projects"]}>
        {
          (repoErr !== "")
            ? repoErr
            : repos.map((repo: Repository, key: number) => {
              return <Repo repo={repo} key={key} />
            })
        }
      </div>
    </div>
  );
}

export default ProjectsPanel;
