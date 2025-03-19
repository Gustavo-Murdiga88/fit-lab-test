import { Pagination } from "../components/pagination";
import { NewConsult } from "./components/modal-consult";
import { Consults } from "./consults";

export default function ConsultPage() {
  return (
    <>
      <NewConsult />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        <Consults />
      </div>
      <Pagination />
    </>
  );
}
