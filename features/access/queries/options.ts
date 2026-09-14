import { queryOptions } from "@tanstack/react-query"
import {
  getPlatformRole,
  listPlatformRoles,
  listPlatformUsers,
} from "../actions/access.query.client"
import { accessKeys } from "./keys"

export function platformRolesQueryOptions() {
  return queryOptions({
    queryKey: accessKeys.platformRoles(),
    queryFn: listPlatformRoles,
  })
}

export function platformRoleQueryOptions(id: string) {
  return queryOptions({
    queryKey: accessKeys.platformRole(id),
    queryFn: () => getPlatformRole(id),
  })
}

export function platformUsersQueryOptions() {
  return queryOptions({
    queryKey: accessKeys.platformUsers(),
    queryFn: listPlatformUsers,
  })
}
