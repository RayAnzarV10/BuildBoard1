'use client'

import { Organization, OrgSidebarOption, SubAccount, SubAccountSidebarOption } from '@prisma/client'
import React, { useEffect, useMemo, useState } from 'react'
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { ChevronsUpDown, Compass, Menu, PlusCircleIcon } from 'lucide-react'
import clsx from 'clsx'
import { AspectRatio } from '../ui/aspect-ratio'
import Image from 'next/image'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import Link from 'next/link'
import { useModal } from '@/lib/modal-provider'
import CustomModal from '../global/custom-modal'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import SubAccountDetails from '../forms/subaccount-details'
import { Separator } from '../ui/separator'
import { statusIcons } from '@/lib/constants'
import * as LucideIcons from 'lucide-react'

type Props = {
    defaultOpen?: boolean
    subaccounts: SubAccount[]
    sidebarOpt: OrgSidebarOption[] | SubAccountSidebarOption[]
    sidebarLogo: string
    details: any
    user: any
    id: string
}

const MenuOptions = ({ defaultOpen, subaccounts, sidebarOpt, sidebarLogo, details, user, id }: Props) => {
  
  const { setOpen } =  useModal()
  const [isMounted, setIsMounted] = useState(false)
  const openState = useMemo(() => (defaultOpen ? { open: true } : {}), [defaultOpen])
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return 

  return (
    <Sheet 
      modal={false} 
      {...openState}
    >
      <VisuallyHidden asChild>
        <SheetTitle>Hola</SheetTitle>
      </VisuallyHidden>
      <SheetTrigger 
        asChild
        className='absolute left-4 top-4 z-[100] md:!hidden flex'
      >
        <Button 
          variant='outline' 
          size='icon'
        >
          <Menu/>
        </Button>
        
      </SheetTrigger>

      <SheetContent
        showX={!defaultOpen}
        side={'left'}
        className={clsx(
          "bg-background/80 backdrop-blur-xl fixed top-0 border-r-[1px] p-6", 
          {
            'hidden md:inline-block z-0': defaultOpen, 
            'inline-block md:hidden z-[100] w-full': !defaultOpen
          }
        )}
      >
        <div>
          <AspectRatio ratio={16 / 5}>
            <Image
              src={sidebarLogo}
              alt='Sidebar Logo'
              fill
              className='rounded-md object-contain'
            />
          </AspectRatio>
          <Popover>
            <PopoverTrigger
              asChild
            >
              <Button 
                className='w-full my-4 flex items-center justify-between py-8' 
                variant='ghost'
              >
                <div className='flex items-center text-left gap-2'>
                  <Compass/>
                  <div className='flex flex-col'>
                    {details.name}
                    <span className='text-muted-foreground'>
                      {details.address}
                    </span>
                  </div>
                </div>
                <div>
                  <ChevronsUpDown
                    size={16}
                    className="text-muted-foreground"
                  />
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-80 h-80 mt-4 z-[200]'>
              {
                <Command className='rounded-lg'>
                  <CommandInput placeholder='Buscar...'/>
                  <CommandList className='pb-16'>
                    <CommandEmpty>Sin Resultados</CommandEmpty>
                    {(user?.role === "ORG_OWNER" || 
                      user?.role === "ORG_ADMIN") && 
                      user?.org && (
                        <CommandGroup heading="Organización">
                          <CommandItem className='!bg-transparent my-2 text-primary border-[1px] border-border p-2 rounded-md hover:!bg-muted cursor-pointer transition-all'>
                            {defaultOpen ? (
                              <Link 
                                href={`/organization/${user?.org?.id}`} 
                                className='flex gap-4 w-full h-full'
                              >
                                <div className='relative w-16'>
                                  <Image
                                    src={user?.org?.logo}
                                    alt='Organization Logo'
                                    fill
                                    className='rounded-md object-contain'
                                  />
                                </div>
                                <div className='flex flex-col flex-1 '>
                                  <span className='font-bold'>{user?.org?.name}</span>
                                  <span className='text-muted-foreground'>
                                    {user?.org?.address}
                                  </span>
                                </div>
                              </Link>
                            ): (
                              <SheetClose asChild>
                                <Link 
                                href={`/organization/${user?.org?.id}`} 
                                className='flex gap-4 w-full h-full'
                              >
                                <div className='relative w-16'>
                                  <Image
                                    src={user?.org?.logo}
                                    alt='Organization Logo'
                                    fill
                                    className='rounded-md object-contain'
                                  />
                                </div>
                                <div className='flex flex-col flex-1'>
                                  {user?.org?.name}
                                  <span className='teext-muted-foreground'>
                                    {user?.org?.address}
                                  </span>
                                </div>
                              </Link>
                              </SheetClose>
                            )}
                          </CommandItem>
                        </CommandGroup> 
                      )
                    }
                    <CommandGroup heading='Cuentas'>
                      {!!subaccounts 
                        ? subaccounts.map((subaccount) => (
                          <CommandItem key={subaccount.id}>
                            {defaultOpen? (
                              <Link 
                                href={`/subaccount/${subaccount.id}`} 
                                className='flex gap-4 w-full h-full'
                              >
                                <div className='relative w-16'>
                                  <Image
                                    src={subaccount.subAccountLogo}
                                    alt='Subaccount Logo'
                                    fill
                                    className='rounded-md object-contain'
                                  />
                                </div>
                                <div className='flex flex-col flex-1 '>
                                  <span className='font-bold'>{subaccount.name}</span>
                                  <span className='text-muted-foreground'>
                                    {subaccount.address}
                                  </span>
                                </div>
                              </Link>
                            ): (
                              <SheetClose asChild>
                                <Link 
                                href={`/subcaccount/${subaccount.id}`} 
                                className='flex gap-4 w-full h-full'
                              >
                                <div className='relative w-16'>
                                  <Image
                                    src={subaccount.subAccountLogo}
                                    alt='Subaccount Logo'
                                    fill
                                    className='rounded-md object-contain'
                                  />
                                </div>
                                <div className='flex flex-col flex-1'>
                                  {subaccount.name}
                                  <span className='teext-muted-foreground'>
                                    {subaccount.address}
                                  </span>
                                </div>
                              </Link>
                              </SheetClose>
                            )}
                          </CommandItem>
                        ))
                      :"Cuenta no encontrada"}
                    </CommandGroup>
                  </CommandList>
                  {(user?.role === "ORG_OWNER" ||
                    user?.role === "ORG_ADMIN") && (
                      <SheetClose>
                        <Button className='w-full flex gap-2' onClick={() => {
                          setOpen(
                          <CustomModal 
                            title='Crea una Subcuenta' 
                            subheading='Puedes cambiar entre la cuenta de la organización y tu subcuenta desde la barra de navegación'>
                            <SubAccountDetails 
                              orgDetails={user?.org as Organization}
                              userId={user?.id as string}
                              userName={user?.name}
                            />
                          </CustomModal>
                          )
                        }}>
                          <PlusCircleIcon size={15}/>
                          Crear subcuenta
                        </Button>
                      </SheetClose>
                  )}
                </Command>
              }
            </PopoverContent>
          </Popover>
          <p className='text-muted-foreground text-xs mb-2'>MENU LINKS</p>
          <Separator className='mb-4'/>
          <nav className='relative'>
            <Command className='rounded-lg overflow-visible bg-transparent'>
              <CommandInput placeholder='Buscar...'/>
              <CommandList className='pb-16 overflow-visible'>
                <CommandEmpty>No hay resultados</CommandEmpty>
                <CommandGroup className='overflow-visible'>
                  {sidebarOpt.map((sidebarOptions) => {
                    let val;
                    const result = Object.entries(LucideIcons).find(
                      ([icon]) => icon.toLowerCase()===sidebarOptions.icon
                    )
                    if (result) {
                      val = result
                    }
                    return (
                      <CommandItem
                        key={sidebarOptions.id}
                        className='md:w-[320px] w-full'
                      >
                        <Link
                          href={sidebarOptions.link} 
                          className='flex items-center pag-2 hover:bg-transparent rounded-md transition-all md:w-full w-[320px]'>
                        </Link>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MenuOptions