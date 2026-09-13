import { buttonVariants } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import type { VariantProps } from "class-variance-authority"

type Props = {
  href: string
  children: React.ReactNode
} & VariantProps<typeof buttonVariants>

export function NavButton({ href, children, variant, size }: Props) {
  return (
    <Link href={href} className={cn(buttonVariants({ variant, size }))}>
      {children}
    </Link>
  )
}
