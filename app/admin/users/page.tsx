"use client"
import { useState } from "react"
import { useAppContext } from "@/contexts/app-context"
import { DataTable } from "@/components/reusable/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, UserPlus, Shield, ShieldOff } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const userColumns = [
  {
    key: "name",
    label: "Name",
    render: (user: any) => (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="font-medium">{user.name}</span>
      </div>
    ),
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "role",
    label: "Role",
    render: (user: any) => <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>,
  },
  {
    key: "enrollments",
    label: "Enrollments",
    render: (user: any) => user.enrollments?.length || 0,
  },
  {
    key: "createdAt",
    label: "Joined",
    render: (user: any) => new Date(user.createdAt).toLocaleDateString(),
  },
  {
    key: "actions",
    label: "",
    render: (user: any, onEdit: any, onDelete: any) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(user)}>
            {user.role === "admin" ? (
              <>
                <ShieldOff className="mr-2 h-4 w-4" />
                Remove Admin
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Make Admin
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(user)} className="text-destructive">
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export default function AdminUsersPage() {
  const { state, dispatch } = useAppContext()
  const [searchTerm, setSearchTerm] = useState("")

  const handleToggleRole = (user: any) => {
    const newRole = user.role === "admin" ? "student" : "admin"
    dispatch({
      type: "UPDATE_USER",
      payload: { ...user, role: newRole },
    })
  }

  const handleDeleteUser = (user: any) => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      dispatch({
        type: "DELETE_USER",
        payload: user.id,
      })
    }
  }

  const filteredUsers = state.users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <DataTable
        data={filteredUsers}
        columns={userColumns}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search users..."
        onEdit={handleToggleRole}
        onDelete={handleDeleteUser}
      />
    </div>
  )
}
