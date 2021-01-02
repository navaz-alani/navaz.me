import ThemeCtx, {ThemeContext} from "@contexts/theme/theme";
import {ChangeEvent, ReactElement, useContext, useState} from "react";

import styles from "./form.module.css";

export interface ValidationErr {
  name: string;
  msg: string;
};

export const emailRe = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// possible field types
export type fieldType =
  "input" |
  "textarea";
// event types for possible fields
type fieldTypeEvent =
  ChangeEvent<HTMLInputElement> |
  ChangeEvent<HTMLTextAreaElement>;

interface Props<T extends Object> {
  // initial values of the fields (also provides the "name" property of field)
  initialValues: T;
  // types of the fields to render for the keys in T (optional - defaut = input)
  fieldTypes?: Map<string, fieldType>;
  // placeholders of the fields to render for the keys in T (optional)
  fieldPlaceholders?: Map<string, string>;
  // what to call when submit is clicked
  submitHandler: (values: T) => any;
  // what to call to validate the values (optional)
  validateHandler?: (values: T) => ValidationErr[];
};

let defaultPlaceholders: Map<string, string> = new Map([
  ["name", "Name"],
  ["email", "Email Address"],
  ["password", "Password"],
]);

// Form bootstraps on a type `T`, which is ought to be an interface type and
// builds a form ontop of it. Currently, it only supports `input` and `textarea`
// input types.
const Form: <T, >(p: Props<T>) => ReactElement<Props<T>> = (props) => {
  let theme: ThemeContext = useContext(ThemeCtx);

  let [values, setValues] = useState(props.initialValues);
  let [submitting, setSubmitting] = useState<boolean>(false);
  let [validationErrs, setValidationErrs] = useState<ValidationErr[]>([]);

  const submit = () => {
    setSubmitting(true);
    if (props.validateHandler !== undefined) {
      let errs: ValidationErr[] = props.validateHandler(values);
      if (errs.length != 0) {
        setValidationErrs(errs);
        setSubmitting(false);
        return;
      }
      setValidationErrs(errs);
    }
    props.submitHandler(values);
    setSubmitting(false);
  }

  return (
    <div className={styles["form"]}>
      {
        Object.keys(props.initialValues).map((name: string, key: number) => {
          let errMsg: string = "";
          for (let err of validationErrs) {
            if (err.name == name) {errMsg = err.msg; break;}
          }
          let placeholder: string = defaultPlaceholders.get(name);
          if (props.fieldPlaceholders != undefined) {
            let ph: string = props.fieldPlaceholders.get(name)
            if (ph != undefined) placeholder = ph;
          }
          let contentType: string;
          switch (name) {
            case "password": {contentType = "password"; break;}
            case "email": {contentType = "email"; break}
            default: {contentType = "text";}
          }
          let InputType: fieldType = (props.fieldTypes != undefined) ?
            (props.fieldTypes.get(name) === undefined
              ? "input" : props.fieldTypes.get(name)) : "input";
          return (
            <div className={styles["field"]} key={key}>
              <InputType name={name}
                type={contentType}
                className={styles["input-field"]}
                value={values[name]}
                placeholder={placeholder}
                onChange={(e: fieldTypeEvent) => {
                  setValues({
                    ...values,
                    [name]: e.target.value
                  });
                }}
              />
              <p className={styles["input-err"] + " " + styles[`err-${theme}`]}>
                {errMsg}
              </p>
            </div>
          );
        })
      }
      <button onClick={submit}
        className={`
          ${styles["button"]} ${styles[`button-${theme}`]}
          ${styles[submitting ? "disabled" : "enabled"]}
      `}>
        Submit
      </button>
    </div>
  );
};

export default Form;
