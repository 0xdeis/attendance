import {
  action,
  createAsync,
  query,
  redirect,
  useSubmission,
} from "@solidjs/router";
import { eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import { db } from "@/db";
import { Show, Suspense } from "solid-js";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { TextField, TextFieldRoot } from "@/components/ui/textfield";
import { DATE_FORMATTER } from "@/utils";
import { Button } from "@/components/ui/button";
import { getSessionAdmin } from "@/actions";

// export const route = {
//   preload() {
//     void getAllTrackersAction();
//   },
// } satisfies RouteDefinition;

const getTrackersForUserAction = query(async (userId: string) => {
  "use server";
  if (userId === "") return [];
  return await db.query.trackers.findMany({
    where: eq(schema.trackers.creatorId, userId),
    with: { attendees: true },
  });
}, "getTrackersForUser");

const createTrackerAction = action(
  async (creatorId: string, formData: FormData) => {
    "use server";

    const name = String(formData.get("name") as string);
    const [tracker] = await db
      .insert(schema.trackers)
      .values({ name, creatorId })
      .returning();
    if (!tracker) {
      throw new Error("DB insert failed");
    }
    throw redirect(`/t/${tracker.id}`, {
      revalidate: getTrackersForUserAction.keyFor(creatorId),
    });
  },
);

export default function DashboardPage() {
  const session = createAsync(() => getSessionAdmin("/dashboard"), {
    deferStream: true,
  });
  const trackers = createAsync(
    async () => await getTrackersForUserAction(session()?.user.id ?? ""),
  );
  const submission = useSubmission(createTrackerAction);
  return (
    <main class="min-h-screen w-full pt-20">
      <div class="flex flex-col px-8 pt-8">
        <Suspense fallback={"loading..."}>
          <Show when={session()}>
            {(session) => (
              <Show when={trackers()}>
                {(trackers) => (
                  <DataTable columns={columns} data={trackers}>
                    <form
                      action={createTrackerAction.with(session().user.id ?? "")}
                      method="post"
                      class="flex w-full max-w-lg shrink-0 items-center space-x-2"
                    >
                      <TextFieldRoot class="grow">
                        <TextField
                          autocomplete="nope"
                          name="name"
                          value={`Attendance ${DATE_FORMATTER.format(new Date())}`}
                        />
                      </TextFieldRoot>
                      <Button
                        type="submit"
                        class="max-w-fit"
                        disabled={submission.pending}
                      >
                        New Tracker
                      </Button>
                    </form>
                  </DataTable>
                )}
              </Show>
            )}
          </Show>
        </Suspense>
      </div>
    </main>
  );
}
