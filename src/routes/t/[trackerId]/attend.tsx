import {
  action,
  createAsync,
  redirect,
  useParams,
  useSubmission,
} from "@solidjs/router";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession, trackerById } from "@/actions";
import { Show } from "solid-js";
import { eq } from "drizzle-orm";

// export const route = {
//   preload({ params }) {
//     void trackerById(params.trackerId!);
//   },
// } satisfies RouteDefinition;

const attendEventAction = action(async (trackerId: string, userId: string) => {
  "use server";

  await db.transaction(async (tx) => {
    const tracker = await tx.query.trackers.findFirst({
      where: eq(schema.trackers.id, trackerId),
    });

    if (!tracker || tracker.closed) {
      console.log(
        `Attempting to attend a non-existing or closed tracker, exiting, ${JSON.stringify(tracker)}`,
      );
    }
    await tx.insert(schema.attendees).values({ userId, trackerId });
  });
  throw redirect(`/t/done`);
});

export default function Attend() {
  const params = useParams();
  const trackerId = params.trackerId!;

  const session = createAsync(() => getSession(`/t/${trackerId}/attend`), {
    deferStream: true,
  });

  const submission = useSubmission(attendEventAction);
  const tracker = createAsync(() => trackerById(trackerId));

  return (
    <main class="min-h-screen w-full pt-20">
      <Show when={session()}>
        {(session) => (
          <Show when={tracker()}>
            {(tracker) => (
              <div class="p-4 flex justify-center">
                <Card class="max-w-screen-md flex-grow">
                  <CardHeader>
                    <CardTitle>
                      {tracker().name} {tracker().closed && "(closed)"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form
                      action={attendEventAction.with(
                        trackerId,
                        session().user.id,
                      )}
                      method="post"
                      class="gap-2 flex flex-col"
                    >
                      <Button
                        type="submit"
                        disabled={tracker().closed || submission.pending}
                      >
                        Attend
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </Show>
        )}
      </Show>
    </main>
  );
}
