import { action, redirect, useParams, useSubmission } from "@solidjs/router";
import { db } from "~/db";
import * as schema from "~/db/schema";

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
    <form action={attendEvent.with(trackerId)} method="post">
      <input type="text" name="name" class="text-black" />
      <button type="submit" disabled={submission.pending}>
        Submit
      </button>
    </form>
  );
}
