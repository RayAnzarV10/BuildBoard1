"use client"

import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavUser } from "./footer"
import { NavMain, OrganizationProfile } from "./main"
import { NavProjects } from "./projects"
import { NavAdmin } from "./admin"
import { data } from "@/lib/constants"

export function AppSidebar({ user, orgName, orgId, orgLogo, orgEmail, userName, userEmail, userAvatar, ...props }: { user:any, orgName: string; orgId: string; orgLogo: string; orgEmail:string; userName:string; userEmail: string; userAvatar:string } & React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="bg-primary-foreground dark:bg-background shadow-xl" {...props}>
      <SidebarHeader>
        <OrganizationProfile orgName={ orgName } orgEmail={ orgEmail } orgLogo={ orgLogo } orgId={ orgId }/>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={ data.navMain } orgName={ orgName } orgId={ orgId } user={ user } />
        <NavProjects items={ data.projects } orgId={ orgId }/>
        {(
          user?.role === "ORG_OWNER"
          ) && (
          <NavAdmin items={ data.admin } orgId={ orgId }/>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={ userName } email={ userEmail } avatar={ userAvatar } orgId={ orgId }  />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
