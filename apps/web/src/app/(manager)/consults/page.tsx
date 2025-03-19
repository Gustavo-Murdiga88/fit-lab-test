import { NewConsult } from "./components/new-consult-section";
import { Consults } from "./consults";

export default function ConsultPage() {
  return (
    <>
      <NewConsult />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 px-4">
        <Consults />
      </div>
      {/** Due of time we're not can implement pagination but it will be in the future */}
      {/* <Pagination /> */}
    </>
  );
}
