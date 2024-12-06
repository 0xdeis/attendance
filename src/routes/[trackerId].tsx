import {
  RouteDefinition,
  createAsync,
  query,
  redirect,
  useParams,
} from "@solidjs/router";
import { eq } from "drizzle-orm";
import { For, Show, Suspense } from "solid-js";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { renderSVG } from "uqr";
import { DATE_FORMATTER } from "@/utils";

const trackerById = query(async (id: string) => {
  "use server";
  const tracker = await db.query.trackers.findFirst({
    where: eq(schema.trackers.id, id),
    with: { attendees: true },
  });
  if (!tracker) throw redirect("/");
  return tracker;
}, "trackerById");

export const route = {
  preload({ params }) {
    void trackerById(params.trackerId);
  },
} satisfies RouteDefinition;

export default function Tracker() {
  const params = useParams();
  const tracker = createAsync(() => trackerById(params.trackerId));
  const attendUrl = `http://172.20.34.32:3000/attend/${params.trackerId}`;
  const svgHtml = renderSVG(attendUrl);

  return (
    <div class="min-h-screen bg-black">
      <div class="max-w-6xl mx-auto px-4 py-8">
        <div class="flex items-center flex-col justify-center mb-8">
          <h1 class="text-3xl font-bold text-gray-100">Attendance Tracker</h1>
          <h2 class="text-lg text-gray-300">
            <Show when={tracker()}>
              {DATE_FORMATTER.format(tracker()?.createdAt)}
            </Show>
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            innerHTML={svgHtml}
            class="max-w-96 max-h-96 rounded-md overflow-hidden"
          />
          <div>
            <For each={tracker()?.attendees}>
              {(attendee) => <div>{attendee.name}</div>}
            </For>
          </div>
        </div>
      </div>
    </div>
  );

  // return (
  //   <main class="w-full p-4 space-y-2">
  //     <Suspense fallback={"loading..."}>
  //       <h1 class="font-bold text-xl">tracker id: {params.trackerId}</h1>
  //       <h2 class="text-lg font-mono">tracker: {JSON.stringify(tracker())}</h2>
  //       <a href={attendUrl}>{attendUrl}</a>
  //
  //     </Suspense>
  //   </main>
  // );
}
