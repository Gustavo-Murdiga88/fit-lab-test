import type { ReactNode } from "react";

import { ManagerHeader } from "./components/header";
import { Tabs } from "./components/tabs";

export default function ManagerLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ManagerHeader />
      <Tabs />
      <div className="mx-auto my-10 flex max-w-[71.25rem] flex-col gap-4">
        {children}
      </div>
    </>
  );
}
