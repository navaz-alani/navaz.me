import {FC, useContext} from "react";

import Head from "next/head";

import ThemeCtx, {ThemeContext} from "@contexts/theme/theme";

import Panel from "@components/panel/panel.tsx";
import ContactPanel from "@components/contact-panel/panel";
import ProjectsPanel from "@components/projects-panel/panel";
import BioPanel from "@components/bio-panel/panel";
import HeroPanel from "@components/hero-panel/panel";

// Site's props list
interface Props {
  setTheme: (theme: ThemeContext) => void
}

interface SitePanel {
  panel: FC<any>;
  bgPattern: string;
}

const Home: FC<Props> = ({setTheme}) => {
  // current site theme
  const themeCtx = useContext(ThemeCtx);

  const panels: SitePanel[] = (() => {
    let panels: SitePanel[] = [
      {panel: HeroPanel, bgPattern: ""},
      {panel: BioPanel, bgPattern: "wavy"},
      {panel: ProjectsPanel, bgPattern: "rectangles"},
      {panel: ContactPanel, bgPattern: "cross"},
    ]
    return panels;
  })();

  return (
    <>
      <Head>
        <title>Navaz Alani</title>
      </Head>

      {
        panels.map((Pan: SitePanel, key: number) => {
          return (
            <Panel theme={themeCtx} key={key} bgPattern={Pan.bgPattern}>
              <Pan.panel setTheme={setTheme} />
            </Panel>
          );
        })
      }
    </>
  );
}

export default Home;
