import { Slash } from "lucide-react";

import { Switcher } from "./switcher";

export function ManagerHeader() {
  return (
    <>
      <header className="h-16 w-full border-b p-3 px-6">
        <div className="mx-auto flex max-w-[71.25rem] items-center">
          <span className="text-muted-foreground text-sm font-semibold">
            Fit Lab Manager
          </span>
          <Slash className="stroke-muted-foreground m-2 size-4 -rotate-[25deg]" />
          <Switcher />
        </div>
      </header>
    </>
  );
}
