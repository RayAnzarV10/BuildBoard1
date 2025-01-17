'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Bell } from "lucide-react"
import { ScrollArea } from "../ui/scroll-area"
import { NotificationWithUser } from "@/lib/types"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

type Props = {
  notifications: NotificationWithUser | []
}

export function Notifications({ notifications } : Props) {
  const [allNotifications, setAllNotifications] = useState(notifications)
  const [showAll, setShowAll] = useState(true)

  return (
    <Sheet>
      <SheetOverlay />
      <SheetTrigger asChild>
        <Button variant="link" size="sm">
          <Bell />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-opacity-75 bg-transparent backdrop-blur-md">
        <SheetHeader className="mb-2 mx-4">
          <SheetTitle>Notificaciones</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100dvh-8rem)]">
          {allNotifications?.map((notification) => (
            <div
              key={notification.id}
              className="flex flex-col gap-y-2 mb-2 overflow-x-scroll text-ellipsis"
            >
              <div className="flex gap-2">
                <Avatar>
                  <AvatarImage
                    src={notification.User.avatarUrl}
                    alt="Profile Picture"
                  />
                  <AvatarFallback className="bg-primary">
                    {notification.User.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p>
                    <span className="font-bold">
                      {notification.notification.split('|')[0]}
                    </span>
                    <span className="text-muted-foreground">
                      {notification.notification.split('|')[1]}
                    </span>
                    <span className="font-bold">
                      {notification.notification.split('|')[2]}
                    </span>
                  </p>
                  <small className="text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </small>
                </div>
              </div>
            </div>
            ))}
        </ScrollArea>
        <SheetFooter>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
