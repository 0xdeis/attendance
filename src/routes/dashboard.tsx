// import { authClient } from "@/lib/auth-client";
import { auth } from "@/lib/auth";
import { createAsync, query, redirect } from "@solidjs/router";
import { getHeaders } from "vinxi/http";

const getSession = query(async () => {
  "use server";

  const headers = new Headers(getHeaders() as HeadersInit);
  const session = await auth.api.getSession({ headers });

  // const session = await authClient.getSession();
  console.log({ session });

  if (!session) throw redirect("/auth/login");

  return session;
}, "getUser");

export default function DashboardPage() {
  const session = createAsync(() => getSession(), { deferStream: true });
  // const session = authClient.useSession();
  return (
    <div>
      <p>dashboard</p>

      <pre>{JSON.stringify(session(), null, 2)}</pre>
    </div>
  );
}
