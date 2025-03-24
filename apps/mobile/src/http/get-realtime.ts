import {
  collection as collectionFn,
  type DocumentData,
  onSnapshot,
  type QuerySnapshot,
} from "firebase/firestore";

import { db } from "../lib/firebase";

export function getRealTime({
  collection,
  onEvent,
}: {
  collection: "consults";
  onEvent: (data: QuerySnapshot<DocumentData, DocumentData>) => void;
}) {
  const unsub = onSnapshot(collectionFn(db, collection), onEvent);

  return {
    unsubscribe: () => unsub(),
  };
}
