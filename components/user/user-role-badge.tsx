"use client"
import { Badge } from "@/components/ui/badge"
import { Shield, GraduationCap, UserIcon } from "lucide-react"
import type { UserRole } from "@/lib/types"

interface UserRoleBadgeProps {
  role: UserRole
  className?: string
}

export function UserRoleBadge({ role, className }: UserRoleBadgeProps) {
  const roleConfig = {
    admin: {
      label: "Admin",
      variant: "default" as const,
      icon: Shield,
    },
    instructor: {
      label: "Instructor",
      variant: "secondary" as const,
      icon: GraduationCap,
    },
    student: {
      label: "Student",
      variant: "outline" as const,
      icon: UserIcon,
    },
  }

  const config = roleConfig[role]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={className}>
      <Icon className="mr-1 h-3 w-3" />
      {config.label}
    </Badge>
  )
}
