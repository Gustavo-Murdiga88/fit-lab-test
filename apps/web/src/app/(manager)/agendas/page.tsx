"use client";

import { Cards } from "./components/cards";
import { NewAgenda } from "./components/new-agenda";

export default function ConsultPage() {
  return (
    <>
      <NewAgenda />
      <Cards />

      {/** Due of time we're not can implement pagination but it will be in the future */}
      {/* <Pagination /> */}
    </>
  );
}
