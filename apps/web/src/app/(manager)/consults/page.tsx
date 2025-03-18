import { Pagination } from "../components/pagination";
import { CardConsult } from "./components/card";
import { NewConsult } from "./components/modal-consult";

export default function ConsultPage() {
  return (
    <>
      <NewConsult />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <CardConsult key={index} index={index} />
        ))}
      </div>
      <Pagination />
    </>
  );
}
