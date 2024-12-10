import { action, query, redirect } from "@solidjs/router";
import { db } from "./db";
import * as schema from "@/db/schema";
import { eq, inArray, not } from "drizzle-orm";
import { Tracker } from "@/db/schema";

export const trackerById = query(async (id: string) => {
  "use server";
  const tracker = await db.query.trackers.findFirst({
    where: eq(schema.trackers.id, id),
    with: { attendees: true },
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
    const name = String(formData.get("name"));
    console.log("name", { name });
    await db
      .update(schema.trackers)
      .set({ name })
      .where(eq(schema.trackers.id, trackerId));
  },
);
