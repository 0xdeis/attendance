import {
  type RouteDefinition,
  action,
  createAsync,
  query,
  redirect,
  useSubmission,
} from "@solidjs/router";
import { Show, Suspense } from "solid-js";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { DATE_FORMATTER } from "@/utils";
import { Button } from "@/components/ui/button";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { TextField, TextFieldRoot } from "@/components/ui/textfield";

export const route = {
  preload() {
    void getAllTrackersAction();
  },
} satisfies RouteDefinition;

const createTrackerAction = action(async (formData: FormData) => {
  "use server";

  const name = String(formData.get("name") as string);
  const [tracker] = await db
    .insert(schema.trackers)
    .values({ name })
    .returning();
  if (!tracker) {
    throw new Error("DB insert failed");
  }
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
  const submission = useSubmission(createTrackerAction);

  return (
    <div class="flex flex-col px-8 pt-8">
      <Suspense fallback={"loading..."}>
        <Show when={trackers()}>
          {(trackers) => (
            <DataTable columns={columns} data={trackers}>
              <form
                action={createTrackerAction}
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
      </Suspense>
    </div>
  );
}
