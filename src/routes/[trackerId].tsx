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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div class="min-h-screen">
      <div class="max-w-6xl mx-auto px-4 py-8">
        <div class="flex items-center flex-col justify-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Attendance Tracker</h1>
          <h2 class="text-lg text-gray-700">
            <Show when={tracker()}>
              {DATE_FORMATTER.format(tracker()?.createdAt)}
            </Show>
          </h2>
        </div>

        <div class="flex flex-col md:flex-row gap-8">
          <Card class="flex-grow">
            <CardHeader>
              <CardTitle class="text-xl">Scan to attend</CardTitle>
            </CardHeader>
            <CardContent>
              <a href={attendUrl} target="_blank">
                <div
                  innerHTML={svgHtml}
                  class="max-w-full max-h-full rounded-md overflow-hidden"
                />
              </a>
            </CardContent>
          </Card>
          <Card class="flex-grow">
            <CardHeader>
              <CardTitle class="text-xl">Here</CardTitle>
            </CardHeader>
            <CardContent>
              <For each={tracker()?.attendees}>
                {(attendee) => <div>{attendee.name}</div>}
              </For>
            </CardContent>
          </Card>
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
