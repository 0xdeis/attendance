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

const createTrackerAction = action(async () => {
  "use server";

  const trackers = await db.insert(schema.trackers).values({}).returning();
  const tracker = trackers[0];
  console.log({ tracker });
  throw redirect(`/${tracker.id}`, { revalidate: getAllTrackers.keyFor() });
});

const getAllTrackers = query(async () => {
  "use server";
  return await db.query.trackers.findMany({ with: { attendees: true } });
}, "getAllTrackers");

export default function Home() {
  const trackers = createAsync(async () => await getAllTrackers());
  const createTracker = useAction(createTrackerAction);
  return (
    <div class="w-full h-full flex flex-col items-center justify-center">
      <button onClick={() => createTracker()}>New Tracker</button>
      <Suspense fallback={"loading..."}>
        <For each={trackers()}>
          {(tracker) => (
            <a href={`/${tracker.id}`}>
              {DATE_FORMATTER.format(tracker.createdAt)} | {tracker.id} |{" "}
              {tracker.attendees.length}
            </a>
          )}
        </For>
      </Suspense>
    </div>
  );
}
