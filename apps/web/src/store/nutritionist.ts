"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Nutritionist = {
  name: string;
  crn: string;
  id: string;
};

type State = {
  currentNutritionist: Nutritionist;
};

type Actions = {
  setCurrentNutritionist: (nutritionist: Nutritionist) => void;
};

export const useNutritionistStore = create<State & Actions>()(
  persist(
    (set) => ({
      currentNutritionist: {
        crn: "",
        id: "",
        name: "",
      },
      setCurrentNutritionist(nutritionist) {
        set({
          currentNutritionist: nutritionist,
        });
      },
    }),
    {
      name: "@fit-lab/nutritionist",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
