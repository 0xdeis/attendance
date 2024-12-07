import {
  RouteDefinition,
  action,
  createAsync,
  redirect,
  useParams,
  useSubmission,
} from "@solidjs/router";
import { db } from "@/db";
import * as schema from "@/db/schema";
import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "@/components/ui/textfield";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trackerById } from "@/actions";
import { Show } from "solid-js";

export const route = {
  preload({ params }) {
    void trackerById(params.trackerId);
  },
} satisfies RouteDefinition;

const attendEvent = action(async (trackerId: string, formData: FormData) => {
  "use server";
  const name = String(formData.get("name"));
  if (!name) {
    return;
  }

  await db.insert(schema.attendees).values({ name, trackerId });
  throw redirect(`/${trackerId}`);
});

export default function Attend() {
  const params = useParams();
  const trackerId = params.trackerId;
  const submission = useSubmission(attendEvent);
  const tracker = createAsync(() => trackerById(trackerId));

  return (
    <Show when={tracker()}>
      {(tracker) => (
        <div class="p-4 flex justify-center">
          <Card class="max-w-screen-md flex-grow">
            <CardHeader>
              <CardTitle>Attend {tracker().closed && "(closed)"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                action={attendEvent.with(trackerId)}
                method="post"
                class="gap-2 flex flex-col"
              >
                <TextFieldRoot disabled={tracker().closed}>
                  <TextFieldLabel>Full Name</TextFieldLabel>
                  <TextField
                    type="text"
                    name="name"
                    class="text-black"
                    placeholder="John Doe"
                  />
                </TextFieldRoot>
                <Button
                  type="submit"
                  disabled={tracker().closed || submission.pending}
                >
                  Submit
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </Show>
  );
}
