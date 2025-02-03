import { LucideIcon } from "lucide-react"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"
import { Collapsible } from "../ui/collapsible"
import Link from "next/link"

export function NavProjects({
    items,
    orgId,
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
    orgId: string
  }) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel className="font-semibold text-muted-foreground">
          Proyectos
        </SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
            <Collapsible
              key={item.title}
              asChild
            >
              <SidebarMenuItem className="hover:bg-muted rounded-md hover:shadow-lg">
                <SidebarMenuButton asChild>
                <Link href={`/organization/${orgId}/${item.url}`}>
                  {item.icon && <item.icon />}
                  <span className="font-semibold">{item.title}</span>
                </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    )
  }