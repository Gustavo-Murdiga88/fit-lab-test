import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import serviceAuth from "../../fit-lab-db.json";

export function createClienteFireBase() {
  const app = initializeApp({
    projectId: serviceAuth.project_id,
    appId: serviceAuth.client_id,
    authDomain: serviceAuth.auth_uri,
  });

  const db = getFirestore(app);
  return db;
}

export const db = createClienteFireBase();
