"use client";

import type { ReactNode } from "react";

import { ReactQueryProvider } from "./react-query";

export function Providers({ children }: { children: ReactNode }) {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
}
