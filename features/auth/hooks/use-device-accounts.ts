"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useCallback, useEffect, useState } from "react"
import { authClient } from "@/connector"
import { useRouter } from "@/i18n/navigation"
import {
  MAX_DEVICE_ACCOUNTS,
  portalHomeForRole,
  type DeviceAccount,
} from "../lib/sessions"

type DeviceSessionRow = {
  session?: { token?: string }
  user?: {
    id?: string
    email?: string
    name?: string
    role?: string
  }
}

function toAccount(
  row: DeviceSessionRow,
  activeUserId?: string,
): DeviceAccount | null {
  const sessionToken = row.session?.token
  const userId = row.user?.id
  const email = row.user?.email

  if (!sessionToken || !userId || !email) {
    return null
  }

  return {
    sessionToken,
    userId,
    email,
    name: row.user?.name?.trim() || email,
    role: typeof row.user?.role === "string" ? row.user.role : undefined,
    isActive: userId === activeUserId,
  }
}

export function useDeviceAccounts() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data, isPending: sessionPending, refetch } = authClient.useSession()
  const [accounts, setAccounts] = useState<DeviceAccount[]>([])
  const [isPending, setIsPending] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    const result = await authClient.multiSession.listDeviceSessions()
    if (result.error) {
      setError(result.error.message ?? "load")
      setAccounts([])
      setIsPending(false)
      return
    }

    const activeUserId = data?.user.id
    const listed = (result.data ?? [])
      .map((row) => toAccount(row, activeUserId))
      .filter((row): row is DeviceAccount => row !== null)

    if (
      data &&
      !listed.some((account) => account.userId === data.user.id)
    ) {
      listed.unshift({
        sessionToken: data.session.token,
        userId: data.user.id,
        email: data.user.email,
        name: data.user.name?.trim() || data.user.email,
        role:
          "role" in data.user && typeof data.user.role === "string"
            ? data.user.role
            : undefined,
        isActive: true,
      })
    }

    setAccounts(listed)
    setError(null)
    setIsPending(false)
  }, [data])

  useEffect(() => {
    if (sessionPending) {
      return
    }

    if (!data) {
      setAccounts([])
      setError(null)
      setIsPending(false)
      return
    }

    void reload()
  }, [data, reload, sessionPending])

  const afterAccountChange = useCallback(async () => {
    await queryClient.invalidateQueries()
    await refetch()
    const next = await authClient.getSession()
    router.refresh()

    if (!next.data) {
      router.push("/")
      return
    }

    const role =
      "role" in next.data.user && typeof next.data.user.role === "string"
        ? next.data.user.role
        : undefined
    router.push(portalHomeForRole(role))
  }, [queryClient, refetch, router])

  const switchAccount = useCallback(
    async (sessionToken: string, options?: { redirect?: boolean }) => {
      const result = await authClient.multiSession.setActive({ sessionToken })
      if (result.error) {
        return result.error.message ?? "switch"
      }

      if (options?.redirect === false) {
        await queryClient.invalidateQueries()
        await refetch()
        router.refresh()
        await reload()
        return null
      }

      await afterAccountChange()
      return null
    },
    [afterAccountChange, queryClient, refetch, reload, router],
  )

  const removeAccount = useCallback(
    async (sessionToken: string) => {
      const result = await authClient.multiSession.revoke({ sessionToken })
      if (result.error) {
        return result.error.message ?? "remove"
      }

      await refetch()
      const next = await authClient.getSession()
      await queryClient.invalidateQueries()
      router.refresh()

      if (!next.data) {
        router.push("/")
        return null
      }

      await reload()
      return null
    },
    [queryClient, refetch, reload, router],
  )

  const signOutCurrent = useCallback(async () => {
    const token = data?.session.token
    if (token) {
      const result = await authClient.multiSession.revoke({ sessionToken: token })
      if (!result.error) {
        await afterAccountChange()
        return null
      }
    }

    await authClient.signOut()
    await queryClient.invalidateQueries()
    router.refresh()
    router.push("/")
    return null
  }, [afterAccountChange, data?.session.token, queryClient, router])

  const signOutAll = useCallback(async () => {
    await authClient.signOut()
    await queryClient.invalidateQueries()
    router.refresh()
    router.push("/")
  }, [queryClient, router])

  return {
    accounts,
    atLimit: accounts.length >= MAX_DEVICE_ACCOUNTS,
    error,
    isPending: sessionPending || isPending,
    reload,
    removeAccount,
    session: data,
    signOutAll,
    signOutCurrent,
    switchAccount,
  }
}
