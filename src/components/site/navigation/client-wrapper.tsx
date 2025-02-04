'use client'

import { useIsLarge } from '@/hooks/use-mobile'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ReactNode, useEffect, useState } from 'react'

interface ClientSideWrapperProps {
  children: ReactNode
}

export const ClientSideWrapper = ({ children }: ClientSideWrapperProps) => {
  const isLg = useIsLarge()
  const [open, setOpen] = useState(isLg)
  
  // Solo actualizar el estado cuando cambia el tamaño de pantalla
  useEffect(() => {
    setOpen(isLg)
  }, [isLg])

  return (
    <SidebarProvider 
      open={open}
      onOpenChange={setOpen}
    >
      {children}
    </SidebarProvider>
  )
}