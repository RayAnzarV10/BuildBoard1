"use client"

import { MoreHorizontal } from "lucide-react"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavUser({
  user,
  email,
  avatar,
  orgId
}: {
  user: string,
  email: string,
  avatar: string,
  orgId: string
}) {

  return (
    <SidebarMenu className="rounded-md hover:bg-muted hover:shadow-lg">
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          asChild
        >
          <a href={`/organization/${orgId}/profile`}>
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={avatar} alt={user} />
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user}</span>
              <span className="truncate text-xs">{email}</span>
            </div>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
