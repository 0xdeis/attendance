import type { DialogTriggerProps } from "@kobalte/core/dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "@/components/ui/textfield";
import { renameTrackerAction } from "@/actions";
import { useSubmission } from "@solidjs/router";

export function RenameDialog(props: { prevName: string; id: string }) {
  const submission = useSubmission(renameTrackerAction);
  return (
    <Dialog>
      <DialogTrigger
        as={(props: DialogTriggerProps) => (
          <Button variant="outline" {...props}>
            Rename
          </Button>
        )}
      />
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename Tracker</DialogTitle>
          <DialogDescription>
            Make changes to the tracker here. Click Save Changes when you are
            done.
          </DialogDescription>
        </DialogHeader>
        <form action={renameTrackerAction.with(props.id)} method="post">
          <div class="grid gap-4 py-4">
            <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
              <TextFieldLabel class="text-right">Name</TextFieldLabel>
              <TextField
                class="col-span-2 md:col-span-3"
                name="name"
                value={props.prevName}
              />
            </TextFieldRoot>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={submission.pending}>
              {submission.pending ? <LoaderCircle /> : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function LoaderCircle() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="animate-spin"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
