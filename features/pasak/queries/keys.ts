export const pasakKeys = {
  all: ["pasak"] as const,
  companies: () => [...pasakKeys.all, "companies"] as const,
  companyList: (status: string) => [...pasakKeys.companies(), status] as const,
  vacancies: () => [...pasakKeys.all, "vacancies"] as const,
  vacancyList: (status: string) => [...pasakKeys.vacancies(), status] as const,
  employers: () => [...pasakKeys.all, "employers"] as const,
};
