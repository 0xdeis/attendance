import type { ColumnDef } from "@tanstack/solid-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox, CheckboxControl } from "@/components/ui/checkbox";

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

export const columns: ColumnDef<Task>[] = [
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
    accessorKey: "code",
    header: "Task",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="ml-2 size-4"
            aria-hidden="true"
            viewBox="0 0 24 24"
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
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu placement="bottom-end">
        <DropdownMenuTrigger class="flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-4"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0"
            />
          </svg>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
