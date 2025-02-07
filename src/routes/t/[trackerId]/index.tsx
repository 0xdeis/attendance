import {
  type RouteDefinition,
  createAsync,
  useParams,
  A,
  revalidate,
} from "@solidjs/router";
import { For, onCleanup, Show } from "solid-js";
import { renderSVG } from "uqr";
import { DATE_FORMATTER } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trackerById } from "@/actions";
import { type User } from "@/db/schema";
import { Image, ImageFallback, ImageRoot } from "@/components/ui/image";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const route = {
  preload({ params }) {
    void trackerById(params.trackerId!);
  },
} satisfies RouteDefinition;

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.URL) return `${process.env.URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export default function Tracker() {
  const params = useParams();

  const tracker = createAsync(() => trackerById(params.trackerId!));
  const attendUrl = `${getBaseUrl()}/t/${params.trackerId}/attend`;
  const svgHtml = renderSVG(attendUrl);

  const poll = setInterval(() => {
    void revalidate(trackerById.keyFor(params.trackerId!));
  }, 15000);
  onCleanup(() => clearInterval(poll));

  return (
    <div class="min-h-screen">
      <div class="max-w-6xl mx-auto px-4 py-8">
        <div class="flex items-center flex-col justify-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">
            Attendance Tracker {tracker()?.closed && " (closed)"}
          </h1>
          <h2 class="text-lg text-gray-700">
            {DATE_FORMATTER.format(tracker()?.createdAt)}
          </h2>
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
            <CardHeader></CardHeader>
            <CardContent>
              <Table>
                <TableCaption>People who have attended this event</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead class="w-[100px]"></TableHead>
                    <TableHead>Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <Show when={tracker()}>
                    {(tracker) => (
                      <For each={tracker().attendees}>
                        {(attendee) => (
                          <AttendeeListItem user={attendee.user} />
                        )}
                      </For>
                    )}
                  </Show>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AttendeeListItem(props: { user: User }) {
  const parts = props.user.name.split(" ");
  // John Doe -> JD
  const fallback = (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
  return (
    <TableRow>
      <TableCell class="font-medium">
        <ImageRoot>
          <Image src={props.user.image ?? undefined} />
          <ImageFallback>{fallback}</ImageFallback>
        </ImageRoot>
      </TableCell>
      <TableCell>
        <p>{props.user.name}</p>
      </TableCell>
    </TableRow>
  );
}
