import { createAuthClient } from "better-auth/solid";
import { DEV } from "solid-js"

export const authClient = createAuthClient({
  baseURL: DEV ? "http://localhost:3000" : process.env.URL!,
});
