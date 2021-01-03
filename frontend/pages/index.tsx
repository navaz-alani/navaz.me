import {FC, useContext, useEffect, useState} from "react";

import Head from "next/head";

import styles from "./index.module.css";

import ThemeCtx, {ThemeContext} from "@contexts/theme/theme";

import SocialBar from "@components/social_bar/socialBar";
import ThemeSetter from "@components/theme_setter/themeSetter";
import Panel from "@components/panel/panel.tsx";
import Form, {emailRe, fieldType, ValidationErr} from "@components/form/form";
import Repo from "@components/github/repository";

import {getProjects, Repository} from "@utils/github/utils";
import {sendMail, MailRequest, MailError} from "@utils/mail/mail";

// Site's props list
interface Props {
  setTheme: (theme: ThemeContext) => void
}

const Home: FC<Props> = ({setTheme}) => {
  // current site theme
  const themeCtx = useContext(ThemeCtx);

  // obtain a list of pinned GitHub repositories
  let [repos, setRepos] = useState<Repository[]>([]);
  let [repoErr, setRepoErr] = useState<string>("");
  useEffect(() => {
    getProjects()
      .then((repos: Repository[]) => setRepos(repos))
      .catch(() => setRepoErr("An error occurred."))
  }, [])

  let [mailRequest, setMailRequest] = useState<MailRequest>({
    name: "", email: "", subject: "", message: ""
  });
  let [mailErr, setMailErr] = useState<MailError>({
    error: false, message: "",
  });

  return (
    <>
      <Head>
        <title>Navaz Alani</title>
      </Head>

      <div>
        {/* 1st panel - About Me */}
        <Panel theme={themeCtx}>
          <div className={styles["about-me-panel"]}>
            <img className={styles["about-me-img"]} src="/me.webp" />
            <h1>Welcome!</h1>
            <div>
              <p>I'm <i>Navaz Alani.</i></p>
              <p>
                Mathematics Undergrad @UWaterloo <br />
                Programmer
              </p>
            </div>
            <SocialBar theme={themeCtx} />
            <ThemeSetter setTheme={setTheme} />
          </div>
        </Panel>

        {/* 2nd Panel - Bio */}
        <Panel theme={themeCtx} bgPattern="wavy">
          <div>
            <h2>Bio</h2>
          </div>
        </Panel>

        {/* 3nd Panel - Pinned GitHub Projects*/}
        <Panel theme={themeCtx} bgPattern="rectangles">
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
        </Panel>

        {/* 4th Panel - Contact Form */}
        <Panel theme={themeCtx} bgPattern="cross">
          <div className={styles["contact-me-panel"]}>
            <h2>Contact Me</h2>
            <p>Use the following form to get in touch with me.</p>
            {/* genric form component */}
            <Form<MailRequest>
              initialValues={mailRequest}
              submitHandler={async (mr: MailRequest) => {
                // submit json to backend
                await sendMail(mr)
                  .then((err: MailError) => {
                    if (err.error) {
                      setMailErr(err);
                      console.error(err.message);
                    } else {
                      setMailErr({
                        error: false,
                        message: `Message successfully sent!
                        I'll get back to you as soon as possible!`,
                      });
                      setMailRequest({
                        name: "", email: "", subject: "", message: "",
                      });
                    }
                  })
                  .catch((err) => {
                    console.error(`An unexpected error occurred: ${err}`)
                    setMailErr({
                      error: true,
                      message: "An unexpected error occurred!",
                    });
                  });
              }}
              fieldPlaceholders={new Map<string, string>([
                ["subject", "Subject of Communication"],
                ["message", "Your Message"],
              ])}
              fieldTypes={new Map<string, fieldType>([
                ["message", "textarea"],
              ])}
              validateHandler={(values: MailRequest) => {
                let errs: ValidationErr[] = [];
                // validate name
                if (values.name === "")
                  errs.push({name: "name", msg: "Name cannot be empty."});
                else if (2 > values.name.trim().split(" ").length)
                  errs.push({name: "name", msg: "Provide first and last name."});
                // validate email
                if (!emailRe.test(values.email))
                  errs.push({name: "email", msg: "Invalid email."});
                if (values.message === "")
                  errs.push({name: "subject", msg: "Subject cannot be empty."});
                if (values.message === "")
                  errs.push({name: "message", msg: "Message cannot be empty."});
                return errs;
              }}
            />
            <p className={`${mailErr.error ? styles[`contact-me-err-${themeCtx}`] : ""}`}>
              {mailErr.message}
            </p>
          </div>
        </Panel>
      </div>
    </>
  );
}

export default Home;
