"use client"

import { ChevronRight, ChevronsUpDown, GalleryVerticalEnd, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarImage } from "../ui/avatar"

export function NavMain({
  items,
  orgName,
  orgId,
  user
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    items?: {
      title: string
      url: string
    }[]
  }[]
  user: any
  orgId: string
  orgName: string
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="font-semibold text-muted-foreground">
        {orgName}
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            className="group/collapsible"
          >
            <CollapsibleTrigger>
              <SidebarMenuItem className="hover:bg-muted rounded-md hover:shadow-lg">
                <SidebarMenuButton 
                  asChild>
                    {user.role === "ORG_OWNER" && item.items ? (
                    <a>
                      {item.icon && <item.icon />}
                      <span className="font-semibold">{item.title}</span>
                      {item.items && (
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </a>
                    ) : (
                    <a href={`${orgId}/${item.url}`}>
                      {item.icon && <item.icon />}
                      <span className="font-semibold">{item.title}</span>
                    </a>
                    )}
                </SidebarMenuButton>
                  {item.items && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={`${orgId}/${subItem.url}`}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                  )}
              </SidebarMenuItem>
            </CollapsibleTrigger>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export function OrganizationProfile ({
  orgName,
  orgEmail,
  orgLogo,
  orgId
}: {
  orgName: string
  orgEmail: string
  orgLogo: string
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
          <a href={`${orgId}/account`}>
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={orgLogo} alt={orgName} />
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{orgName}</span>
              <span className="truncate text-xs">{orgEmail}</span>
            </div>
            <GalleryVerticalEnd className="ml-auto size-4" />
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}