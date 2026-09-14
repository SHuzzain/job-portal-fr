import { PortalHeader } from "@/components/portal-header"

type Props = {
  children: React.ReactNode
}

export default function PortalLayout({ children }: Props) {
  return (
    <div className="flex min-h-svh flex-col">
      <PortalHeader />
      <main className="flex-1">{children}</main>
    </div>
  )
}
