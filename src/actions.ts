import { action, query, redirect } from "@solidjs/router";
import { db } from "./db";
import * as schema from "@/db/schema";
import { eq, inArray, not } from "drizzle-orm";
import { type Tracker } from "@/db/schema";
import { auth } from "./lib/auth";
import { getHeaders } from "vinxi/http";

export const trackerById = query(async (id: string) => {
  "use server";
  const tracker = await db.query.trackers.findFirst({
    where: eq(schema.trackers.id, id),
    with: {
      attendees: { with: { user: true } },
      creator: true,
    },
  });
  if (!tracker) throw redirect("/");
  return tracker;
}, "trackerById");

export const toggleClosedTrackerAction = action(
  async (trackerIds: Tracker["id"][]) => {
    "use server";
    await db
      .update(schema.trackers)
      .set({ closed: not(schema.trackers.closed) })
      .where(inArray(schema.trackers.id, trackerIds));
    throw redirect("/");
  },
);

export const renameTrackerAction = action(
  async (trackerId: Tracker["id"], formData: FormData) => {
    "use server";
    const name = String(formData.get("name") as string);
    await db
      .update(schema.trackers)
      .set({ name })
      .where(eq(schema.trackers.id, trackerId));
  },
);

export const getSession = query(async (redirectUrl: string) => {
  "use server";

  const headers = new Headers(getHeaders() as HeadersInit);
  const session = await auth.api.getSession({ headers });

  if (!session) throw redirect(`/auth/login?redirect=${redirectUrl}`);

  return session;
}, "getSession");

export const getSessionAdmin = query(async (redirectUrl: string) => {
  "use server";

  const headers = new Headers(getHeaders() as HeadersInit);
  const session = await auth.api.getSession({ headers });

  if (!session) throw redirect(`/auth/login?redirect=${redirectUrl}`);

  const adminEmails = process.env.ADMIN_EMAILS!.split(",");
  if (!adminEmails.includes(session.user.email)) {
    throw redirect("/");
  }

  return session;
}, "getSession");
