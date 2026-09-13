import { queryOptions } from "@tanstack/react-query"
import { listMyResumes } from "../actions/resume.query.client"
import { resumeKeys } from "./keys"

export function myResumesQueryOptions() {
  return queryOptions({
    queryKey: resumeKeys.mine(),
    queryFn: listMyResumes,
  })
}
