import getConfig from "next/config";
const {publicRuntimeConfig} = getConfig();

export interface MailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export interface MailError {
  error: boolean;
  message: string;
};

export const sendMail: (req: MailRequest) => Promise<MailError> = async (req) => {
  const url: string = publicRuntimeConfig.BE + "/send-mail";
  const resp = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    body: JSON.stringify(req) // body data type must match "Content-Type" header
  });
  let err: MailError = {error: false, message: ""};
  if (resp.status != 200) {
    err.error = true;
    err.message = await resp.text();
    return err;
  }
  return err;
}
