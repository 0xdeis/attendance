import { RouteDefinition, createAsync, useParams, A } from "@solidjs/router";
import { For, Show } from "solid-js";
import { renderSVG } from "uqr";
import { DATE_FORMATTER } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trackerById } from "@/actions";

export const route = {
  preload({ params }) {
    void trackerById(params.trackerId);
  },
} satisfies RouteDefinition;

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.URL) return `https://${process.env.URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export default function Tracker() {
  const params = useParams();
  const tracker = createAsync(() => trackerById(params.trackerId));
  const attendUrl = `${getBaseUrl()}/attend/${params.trackerId}`;
  const svgHtml = renderSVG(attendUrl);

  return (
    <div class="min-h-screen">
      <div class="max-w-6xl mx-auto px-4 py-8">
        <div class="flex items-center flex-col justify-center mb-8">
          <Show when={tracker()}>
            {(tracker) => (
              <>
                <h1 class="text-3xl font-bold text-gray-900">
                  Attendance Tracker {tracker().closed && " (closed)"}
                </h1>
                <h2 class="text-lg text-gray-700">
                  {DATE_FORMATTER.format(tracker()?.createdAt)}
                </h2>
              </>
            )}
          </Show>
        </div>

        <div class="flex flex-col md:flex-row gap-8">
          <Card class="flex-grow">
            <CardHeader>
              <CardTitle class="text-xl">Scan to attend</CardTitle>
            </CardHeader>
            <CardContent>
              <A href={attendUrl} target="_blank">
                <div
                  innerHTML={svgHtml}
                  class="max-w-full max-h-full rounded-md overflow-hidden"
                />
              </A>
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
}
