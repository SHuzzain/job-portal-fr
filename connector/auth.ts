import { createAuthClient } from "better-auth/react"
import {
  adminClient,
  inferOrgAdditionalFields,
  organizationClient,
} from "better-auth/client/plugins"
import { platformAc, platformRoles } from "./access/admin"
import { organizationAc, organizationRoles } from "./access/organization"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [
    organizationClient({
      ac: organizationAc,
      roles: organizationRoles,
      dynamicAccessControl: {
        enabled: true,
      },
      schema: inferOrgAdditionalFields({
        organization: {
          additionalFields: {
            status: { type: "string" },
            ssmNumber: { type: "string" },
            ssmDocumentUrl: { type: "string" },
            legalName: { type: "string" },
            industry: { type: "string" },
            website: { type: "string" },
            address: { type: "string" },
            reviewNotes: { type: "string" },
          },
        },
      }),
    }),
    adminClient({
      ac: platformAc,
      roles: platformRoles,
    }),
  ],
})
