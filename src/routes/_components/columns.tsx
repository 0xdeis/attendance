import type { ColumnDef } from "@tanstack/solid-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox, CheckboxControl } from "@/components/ui/checkbox";
import type { TrackerWithAttendees } from "@/db/schema";
import { Match, Switch } from "solid-js";
import { toggleClosedTrackerAction } from "@/actions";
import { A, useAction } from "@solidjs/router";
import { RenameDialog } from "@/components/rename-dialog";
import { DATE_FORMATTER } from "@/utils";

// This type is used to define the shape of our data.
// You can use a Zod or Validbot schema here if you want.
export type Task = {
  id: string;
  code: string;
  title: string;
  status: "todo" | "in-progress" | "done" | "cancelled";
  label: "bug" | "feature" | "enhancement" | "documentation";
};

export const tasks: Task[] = [
  {
    id: "ptL0KpX_yRMI98JFr6B3n",
    code: "TASK-33",
    title: "We need to bypass the redundant AI interface!",
    status: "todo",
    label: "bug",
  },
  {
    id: "RsrTg_SmBKPKwbUlr7Ztv",
    code: "TASK-59",
    title:
      "Overriding the capacitor won't do anything, we need to generate the solid state JBOD pixel!",
    status: "in-progress",
    label: "feature",
  },
];

export const columns: ColumnDef<TrackerWithAttendees>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        indeterminate={table.getIsSomePageRowsSelected()}
        checked={table.getIsAllPageRowsSelected()}
        onChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      >
        <CheckboxControl />
      </Checkbox>
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      >
        <CheckboxControl />
      </Checkbox>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: (props) => (
      <A
        href={`/${props.row.original.id}`}
        class="underline underline-offset-4 hover:text-primary flex gap-1 items-center"
        target="_blank"
      >
        {props.row.original.name}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-square-arrow-out-up-right"
        >
          <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
          <path d="m21 3-9 9" />
          <path d="M15 3h6v6" />
        </svg>
      </A>
    ),
  },
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "status",
    enableSorting: true,
    enableMultiSort: true,
    sortingFn: (a, b) => +a.original.closed - +b.original.closed,
    header: (props) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            console.log(
              "hi",
              props.table.getRowModel().rows.map((r) => r.original),
            );
            props.column.toggleSorting(props.column.getIsSorted() === "asc");
          }}
        >
          Status
          <Switch
            fallback={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-3.5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m8 9l4-4l4 4m0 6l-4 4l-4-4"
                />
              </svg>
            }
          >
            <Match when={props.column.getIsSorted() === "asc"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-3.5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 5v14m4-10l-4-4M8 9l4-4"
                />
              </svg>
            </Match>
            <Match when={props.column.getIsSorted() === "desc"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-3.5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 5v14m4-4l-4 4m-4-4l4 4"
                />
              </svg>
            </Match>
          </Switch>
        </Button>
      );
    },
    cell: (props) => (
      <div class="flex w-[100px] items-center">
        <Switch>
          <Match when={!props.row.original.closed}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              class="mr-2 size-4 text-muted-foreground"
              aria-hidden="true"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 20.777a8.942 8.942 0 0 1-2.48-.969M14 3.223a9.003 9.003 0 0 1 0 17.554m-9.421-3.684a8.961 8.961 0 0 1-1.227-2.592M3.124 10.5c.16-.95.468-1.85.9-2.675l.169-.305m2.714-2.941A8.954 8.954 0 0 1 10 3.223M12 9l-2 3h4l-2 3"
              />
            </svg>
          </Match>
          <Match when={props.row.original.closed}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              class="mr-2 size-4 text-muted-foreground"
              aria-hidden="true"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              >
                <path d="M10 20.777a8.942 8.942 0 0 1-2.48-.969M14 3.223a9.003 9.003 0 0 1 0 17.554m-9.421-3.684a8.961 8.961 0 0 1-1.227-2.592M3.124 10.5c.16-.95.468-1.85.9-2.675l.169-.305m2.714-2.941A8.954 8.954 0 0 1 10 3.223" />
                <path d="m9 12l2 2l4-4" />
              </g>
            </svg>
          </Match>
        </Switch>
        <span class="capitalize">
          {props.row.original.closed ? "Closed" : "Open"}
        </span>
      </div>
    ),
  },
  {
    header: "Attendees",
    cell: (props) => props.row.original.attendees.length,
  },
  {
    accessorKey: "createdAt",
    header: (props) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            console.log(
              "hi",
              props.table.getRowModel().rows.map((r) => r.original),
            );
            props.column.toggleSorting(props.column.getIsSorted() === "asc");
          }}
        >
          Created at
          <Switch
            fallback={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-3.5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m8 9l4-4l4 4m0 6l-4 4l-4-4"
                />
              </svg>
            }
          >
            <Match when={props.column.getIsSorted() === "asc"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-3.5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 5v14m4-10l-4-4M8 9l4-4"
                />
              </svg>
            </Match>
            <Match when={props.column.getIsSorted() === "desc"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-3.5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 5v14m4-4l-4 4m-4-4l4 4"
                />
              </svg>
            </Match>
          </Switch>
        </Button>
      );
    },
    cell: (props) => (
      <time
        title={props.row.original.createdAt.toLocaleString()}
        datetime={props.row.original.createdAt.toLocaleString()}
      >
        {DATE_FORMATTER.format(props.row.original.createdAt)}
      </time>
    ),
    sortingFn: (a, b) =>
      a.original.createdAt.getTime() - b.original.createdAt.getTime(),
  },
  {
    id: "actions",
    header: (props) => {
      const toggleClosedTracker = useAction(toggleClosedTrackerAction);
      return (
        <Switch>
          <Match when={props.table.getSelectedRowModel().rows.length === 0}>
            Actions
          </Match>
          <Match when={props.table.getSelectedRowModel().rows.length > 0}>
            <Button
              variant={"outline"}
              onClick={() =>
                toggleClosedTracker(
                  props.table
                    .getSelectedRowModel()
                    .rows.map((r) => r.original.id),
                )
              }
            >
              Toggle
            </Button>
          </Match>
        </Switch>
      );
    },
    cell: (props) => {
      const toggleClosedTracker = useAction(toggleClosedTrackerAction);
      return (
        <div class="flex gap-2">
          <Button
            variant={"outline"}
            onClick={() => toggleClosedTracker([props.row.original.id])}
          >
            {props.row.original.closed ? "Open" : "Close"}
          </Button>
          <RenameDialog
            prevName={props.row.original.name}
            id={props.row.original.id}
          />
        </div>
      );
    },
  },
];
