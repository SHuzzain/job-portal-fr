import type { SeekerProfile } from "@/features/profile/schema"
import type { Vacancy } from "@/features/vacancies/schema"

export type EligibilityMismatch = {
  criterion: "qualification" | "location" | "gender" | "age"
  preferred: string
  actual: string
}

function normalize(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase()
}

function educationRank(value: string | null | undefined) {
  const text = (value ?? "").trim().toUpperCase()
  if (!text) {
    return null
  }
  if (text.includes("PHD") || text.includes("DOCTOR")) {
    return 6
  }
  if (text.includes("MASTER")) {
    return 5
  }
  if (text.includes("DEGREE") || text.includes("BACHELOR") || text.includes("IJAZAH")) {
    return 4
  }
  if (text.includes("DIPLOMA")) {
    return 3
  }
  if (text.includes("CERT")) {
    return 2
  }
  if (text.includes("SPM") || text.includes("STPM")) {
    return 1
  }
  return 0
}

function ageFromDob(dateOfBirth: string | null | undefined) {
  if (!dateOfBirth) {
    return null
  }
  const birth = new Date(dateOfBirth)
  if (Number.isNaN(birth.getTime())) {
    return null
  }
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDelta = today.getMonth() - birth.getMonth()
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birth.getDate())) {
    age -= 1
  }
  return age
}

function locationMatches(vacancyLocation: string, profile: SeekerProfile) {
  const wanted = normalize(vacancyLocation)
  if (!wanted) {
    return true
  }
  const city = normalize(profile.city)
  const preferred = normalize(profile.preferredLocation)
  return Boolean(
    (city && (city.includes(wanted) || wanted.includes(city))) ||
      (preferred && (preferred.includes(wanted) || wanted.includes(preferred))),
  )
}

export function unmatchedVacancyCriteria(vacancy: Vacancy, profile: SeekerProfile) {
  const mismatches: EligibilityMismatch[] = []

  if (vacancy.minQualification) {
    const requiredRank = educationRank(vacancy.minQualification)
    const actualRank = educationRank(profile.highestEducation)
    const actual = profile.highestEducation?.trim() || "—"
    const belowRank =
      requiredRank !== null &&
      actualRank !== null &&
      requiredRank > 0 &&
      actualRank > 0 &&
      actualRank < requiredRank
    const differentLabel =
      (requiredRank === 0 || actualRank === 0) &&
      normalize(vacancy.minQualification) !== normalize(profile.highestEducation)
    if (belowRank || differentLabel) {
      mismatches.push({
        criterion: "qualification",
        preferred: vacancy.minQualification,
        actual,
      })
    }
  }

  if (!locationMatches(vacancy.location, profile)) {
    mismatches.push({
      criterion: "location",
      preferred: vacancy.location,
      actual: profile.city?.trim() || profile.preferredLocation?.trim() || "—",
    })
  }

  if (
    vacancy.preferredGender &&
    vacancy.preferredGender !== "ANY" &&
    profile.gender &&
    profile.gender !== vacancy.preferredGender
  ) {
    mismatches.push({
      criterion: "gender",
      preferred: vacancy.preferredGender,
      actual: profile.gender,
    })
  }

  const age = ageFromDob(profile.dateOfBirth)
  if (age !== null && (vacancy.minAge != null || vacancy.maxAge != null)) {
    const tooYoung = vacancy.minAge != null && age < vacancy.minAge
    const tooOld = vacancy.maxAge != null && age > vacancy.maxAge
    if (tooYoung || tooOld) {
      const preferred =
        vacancy.minAge != null && vacancy.maxAge != null
          ? `${vacancy.minAge}–${vacancy.maxAge}`
          : vacancy.minAge != null
            ? `${vacancy.minAge}+`
            : `≤${vacancy.maxAge}`
      mismatches.push({
        criterion: "age",
        preferred,
        actual: String(age),
      })
    }
  }

  return mismatches
}
