import {
  action,
  createAsync,
  query,
  redirect,
  useAction,
} from "@solidjs/router";
import { For, Suspense } from "solid-js";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { DATE_FORMATTER } from "@/utils";
import { Button } from "@/components/ui/button";
import type { Tracker } from "@/db/schema";
import { eq } from "drizzle-orm";

const closeTrackerAction = action(async (trackerId: Tracker["id"]) => {
  "use server";
  await db
    .update(schema.trackers)
    .set({ closed: true })
    .where(eq(schema.trackers.id, trackerId));
  throw redirect("/");
});

const createTrackerAction = action(async () => {
  "use server";

  const trackers = await db.insert(schema.trackers).values({}).returning();
  const tracker = trackers[0];
  throw redirect(`/${tracker.id}`, { revalidate: getAllTrackers.keyFor() });
});

const getAllTrackers = query(async () => {
  "use server";
  return await db.query.trackers.findMany({ with: { attendees: true } });
}, "getAllTrackers");

export default function Home() {
  const trackers = createAsync(async () => await getAllTrackers());
  const createTracker = useAction(createTrackerAction);
  const closeTracker = useAction(closeTrackerAction);
  return (
    <div class="flex flex-col">
      <Button onClick={() => createTracker()} class="max-w-fit">
        New Tracker
      </Button>
      <Suspense fallback={"loading..."}>
        <For each={trackers()}>
          {(tracker) => (
            <div class="flex flex-row gap-2">
              <a href={`/${tracker.id}`}>
                {tracker.closed && "(closed)"}{" "}
                {DATE_FORMATTER.format(tracker.createdAt)} | {tracker.id} |{" "}
                {tracker.attendees.length}
              </a>
              <Button
                onClick={() => closeTracker(tracker.id)}
                disabled={tracker.closed}
              >
                Close
              </Button>
            </div>
          )}
        </For>
      </Suspense>
    </div>
  );
}
