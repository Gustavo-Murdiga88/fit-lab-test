import { ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Pagination() {
  return (
    <footer className="flex items-stretch justify-end gap-2 border-t pt-4">
      <Button variant={"outline"}>
        <ChevronsLeftIcon className="size-4" />
      </Button>
      <span className="bg-card flex w-min min-w-[2.5rem] items-center justify-center rounded-sm border">
        1
      </span>

      <Button variant={"outline"}>
        <ChevronsRightIcon className="size-4" />
      </Button>
    </footer>
  );
}
