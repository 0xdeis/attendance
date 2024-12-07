import { query, redirect } from "@solidjs/router";
import { db } from "./db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

export const trackerById = query(async (id: string) => {
  "use server";
  const tracker = await db.query.trackers.findFirst({
    where: eq(schema.trackers.id, id),
    with: { attendees: true },
  });
  if (!tracker) throw redirect("/");
  return tracker;
}, "trackerById");
