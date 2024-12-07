import { action, redirect, useParams, useSubmission } from "@solidjs/router";
import { db } from "@/db";
import * as schema from "@/db/schema";
import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "@/components/ui/textfield";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  console.log({ trackerId: params.trackerId });

  return (
    <div class="p-4 flex justify-center">
      <Card class="max-w-screen-md flex-grow">
        <CardHeader>
          <CardTitle>Attend</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={attendEvent.with(trackerId)}
            method="post"
            class="gap-2 flex flex-col"
          >
            <TextFieldRoot>
              <TextFieldLabel>Full Name</TextFieldLabel>
              <TextField
                type="text"
                name="name"
                class="text-black"
                placeholder="John Doe"
              />
            </TextFieldRoot>
            <Button type="submit" disabled={submission.pending}>
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
