import {
  RouteDefinition,
  action,
  createAsync,
  query,
  redirect,
  useAction,
} from "@solidjs/router";
import { For, Suspense, createSignal } from "solid-js";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { DATE_FORMATTER } from "@/utils";
import { Button } from "@/components/ui/button";
import type { Tracker } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DataTable } from "./_components/data-table";
import { columns, tasks } from "./_components/columns";

export const route = {
  preload() {
    void getAllTrackersAction();
  },
} satisfies RouteDefinition;

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
  throw redirect(`/${tracker.id}`, {
    revalidate: getAllTrackersAction.keyFor(),
  });
});

const getAllTrackersAction = query(async () => {
  "use server";
  return await db.query.trackers.findMany({ with: { attendees: true } });
}, "getAllTrackers");

export default function Home() {
  const trackers = createAsync(async () => await getAllTrackersAction());
  const createTracker = useAction(createTrackerAction);
  const closeTracker = useAction(closeTrackerAction);
  const [data, setData] = createSignal(tasks);
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
      <DataTable columns={columns} data={data} />
    </div>
  );
}
