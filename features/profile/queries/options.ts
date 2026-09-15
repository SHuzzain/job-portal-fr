import { queryOptions } from "@tanstack/react-query";

import { getMyProfile } from "../actions/profile.query.client";
import { profileKeys } from "./keys";

export function myProfileQueryOptions() {
  return queryOptions({
    queryKey: profileKeys.mine(),
    queryFn: getMyProfile,
  });
}
