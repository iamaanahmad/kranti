import { Client, ID, Storage } from "appwrite";

const browserEndpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? process.env.APPWRITE_ENDPOINT ?? "https://citorg.in/v1";
const browserProjectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? process.env.APPWRITE_PROJECT_ID ?? "kranti";

const client = new Client().setEndpoint(browserEndpoint).setProject(browserProjectId);

export const browserStorage = new Storage(client);
export { ID };
