"use client"

import { Avatar, AvatarImage } from "@/components/ui/avatar"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

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
          <Link href={`/organization/${orgId}/profile`}>
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={avatar} alt={user} />
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user}</span>
              <span className="truncate text-xs">{email}</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
