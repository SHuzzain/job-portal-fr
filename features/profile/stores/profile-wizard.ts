import { create } from "zustand"
import type { SeekerProfile, SeekerProfileUpdate } from "../schema"

export type ProfileDraft = {
  displayName: string
  icNumber: string
  dateOfBirth: string
  gender: "MALE" | "FEMALE" | "OTHER" | ""
  city: string
  highestEducation: string
  fieldOfStudy: string
  yearsOfExperience: string
  skills: string
  preferredLocation: string
  preferredEmploymentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | ""
  isMalaysian: boolean
  hasWorkPermit: boolean
}

const emptyDraft: ProfileDraft = {
  displayName: "",
  icNumber: "",
  dateOfBirth: "",
  gender: "",
  city: "",
  highestEducation: "",
  fieldOfStudy: "",
  yearsOfExperience: "",
  skills: "",
  preferredLocation: "",
  preferredEmploymentType: "",
  isMalaysian: false,
  hasWorkPermit: false,
}

type ProfileWizardState = {
  step: 1 | 2 | 3 | 4 | 5
  draft: ProfileDraft
  hydrated: boolean
  setStep: (step: 1 | 2 | 3 | 4 | 5) => void
  updateDraft: (patch: Partial<ProfileDraft>) => void
  hydrate: (profile: SeekerProfile) => void
}

export function draftToUpdate(draft: ProfileDraft): SeekerProfileUpdate {
  return {
    displayName: draft.displayName,
    icNumber: draft.icNumber,
    dateOfBirth: draft.dateOfBirth,
    gender: draft.gender || undefined,
    city: draft.city,
    highestEducation: draft.highestEducation,
    fieldOfStudy: draft.fieldOfStudy,
    yearsOfExperience: Number(draft.yearsOfExperience || 0),
    skills: draft.skills,
    preferredLocation: draft.preferredLocation,
    preferredEmploymentType: draft.preferredEmploymentType || undefined,
    isMalaysian: draft.isMalaysian,
    hasWorkPermit: draft.hasWorkPermit,
  }
}

export const useProfileWizard = create<ProfileWizardState>((set) => ({
  step: 1,
  draft: emptyDraft,
  hydrated: false,
  setStep: (step) => set({ step }),
  updateDraft: (patch) => set((state) => ({ draft: { ...state.draft, ...patch } })),
  hydrate: (profile) =>
    set({
      hydrated: true,
      draft: {
        displayName: profile.displayName ?? "",
        icNumber: profile.icNumber ?? "",
        dateOfBirth: profile.dateOfBirth ?? "",
        gender: (profile.gender as ProfileDraft["gender"]) ?? "",
        city: profile.city ?? "",
        highestEducation: profile.highestEducation ?? "",
        fieldOfStudy: profile.fieldOfStudy ?? "",
        yearsOfExperience:
          profile.yearsOfExperience === null ? "" : String(profile.yearsOfExperience),
        skills: profile.skills ?? "",
        preferredLocation: profile.preferredLocation ?? "",
        preferredEmploymentType:
          (profile.preferredEmploymentType as ProfileDraft["preferredEmploymentType"]) ?? "",
        isMalaysian: profile.isMalaysian,
        hasWorkPermit: profile.hasWorkPermit,
      },
    }),
}))
