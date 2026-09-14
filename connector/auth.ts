import { i18nClient } from "@better-auth/i18n/client"
import { createAuthClient } from "better-auth/react"
import {
  adminClient,
  inferOrgAdditionalFields,
  organizationClient,
  inferAdditionalFields
} from "better-auth/client/plugins"
import { platformAc, platformRoles } from "./access/admin"
import { organizationAc, organizationRoles } from "./access/organization"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  fetchOptions: {
    credentials: "include",
    onRequest(context) {
      const locale =
        typeof document !== "undefined" ? document.documentElement.lang : undefined
      if (locale === "en" || locale === "ms") {
        const headers = new Headers(context.headers)
        headers.set("x-locale", locale)
        context.headers = headers
      }
      return context
    },
  },

  plugins: [
    inferAdditionalFields({
      user: {
        phoneNumber: { type: "string", required: false },
        hasTvetCapability: { type: "boolean", required: false },
        accountStatus: { type: "string", required: false },
      }
    }),
    i18nClient(),
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
