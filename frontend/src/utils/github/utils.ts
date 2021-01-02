import getConfig from "next/config";
const {publicRuntimeConfig} = getConfig();

export interface Repository {
  name: string;
  description: string;
};

export const getProjects: () => Promise<Repository[]> =
  async () => {
    const url: string = publicRuntimeConfig.BE + "/projects";
    let response: Response = await fetch(url);
    let parsed: {repos: Repository[]} = JSON.parse(await response.text());
    return parsed.repos;
  };
