import { create } from "zustand";

import type { VacancyCreate } from "../schema";

const emptyDraft: VacancyCreate = {
  title: "",
  description: "",
  location: "",
  employmentType: "FULL_TIME",
  minQualification: "",
};

type VacancyWizardState = {
  step: 1 | 2 | 3;
  draft: VacancyCreate;
  setStep: (step: 1 | 2 | 3) => void;
  updateDraft: (patch: Partial<VacancyCreate>) => void;
  reset: () => void;
};

export const useVacancyWizard = create<VacancyWizardState>((set) => ({
  step: 1,
  draft: emptyDraft,
  setStep: (step) => set({ step }),
  updateDraft: (patch) =>
    set((state) => ({ draft: { ...state.draft, ...patch } })),
  reset: () => set({ step: 1, draft: emptyDraft }),
}));
