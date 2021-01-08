import Form, {emailRe, fieldType, ValidationErr} from "@components/form/form";
import ThemeCtx from "@contexts/theme/theme";
import {MailError, MailRequest, sendMail} from "@utils/mail/mail";
import {FC, useContext, useState} from "react";

import styles from "./panel.module.css";

const ContactPanel: FC = () => {
  const themeCtx = useContext(ThemeCtx);
  // contact form state
  let [mailRequest, setMailRequest] = useState<MailRequest>({
    name: "", email: "", subject: "", message: ""
  });
  let [mailErr, setMailErr] = useState<MailError>({
    error: false, message: "",
  });

  return (
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
                        I'll try get back to you ASAP.`,
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
  );
}

export default ContactPanel;
