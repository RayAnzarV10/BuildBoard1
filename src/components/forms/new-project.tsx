'use client'

import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { z } from 'zod'
import { Prisma, Project, ProjectStatus } from '@prisma/client'
import { useToast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { nextNumber, createProject } from '@/lib/queries'
import { v4 } from 'uuid'
import { useRouter } from 'next/navigation'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import LocationPicker from '../global/location-picker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { format } from 'date-fns'
import { es } from 'date-fns/locale/es'
import { CalendarIcon } from 'lucide-react'
import { cn, toDecimal } from '@/lib/utils'
import Loading from '../global/loading'
import { Separator } from '../ui/separator'

type Props = {
  data?: Partial <Project>
}

const FormSchema = z.object({
  name: z.string().min(2, { message: 'El nombre del proyecto debe tener al menos 2 caracteres' }),
  status: z.nativeEnum(ProjectStatus),
  location: z.string().min(1, { message: 'La ubicación es requerida' }),
  det_location: z.object({
    lat: z.number().or(z.string()).pipe(z.coerce.number()),
    lng: z.number().or(z.string()).pipe(z.coerce.number())
  }, { required_error: 'La ubicación detallada es requerida' }),
  est_completion: z.date({ message: 'La fecha de finalización es requerida' }),
  budget: z.coerce.number({ message: 'Ingresa un número correcto' }),
  description: z.string().min(1, { message: 'La descripción es requerida' }),
})

const CreateProject = ({data, orgId}: Props & {orgId: string}) => {
  const {toast} = useToast();
  const router = useRouter()
  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: data?.name,
      status: data?.status,
      location: data?.location,
      det_location: data?.det_location as { lat: number, lng: number },
      est_completion: data?.est_completion,
      budget: data?.budget ? Number(data?.budget) : undefined,
      description: data?.description,
    }
  })
  const isLoading = form.formState.isSubmitting

  useEffect(() => {
    if (data?.id) {
      const formData = {
        ...data,
        det_location: data.det_location as { lat: number; lng: number },
        budget: data.budget ? Number(data.budget) : undefined
      }
      form.reset(formData)
    }
  }, [data])
  
  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      if (!data?.id) {
        const Number = await nextNumber(orgId)
        const response = await createProject({
          id: data?.id ? data.id : v4(),
          number: Number,
          name: values.name,
          orgId: orgId,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: values.status,
          location: values.location,
          det_location: values.det_location,
          est_completion: values.est_completion,
          budget: toDecimal( values.budget ),
          description: values.description,
          clientId: null
        })
        toast({
          title: 'Proyecto creado!',
          description: 'El proyecto ha sido creado exitosamente',
        })
        if (data?.id) {
          await router.push(`/organization/${orgId}/proyectos/${data?.id}`)
          return
        }
        if (response) {
          await router.push(`/organization/${orgId}/proyectos/${response.id}`)
          return
        }
        }
    } catch (error) {
      console.log(error)
      toast({
        variant: 'destructive',
        title: 'Error!',
        description: 'Ha ocurrido un error al crear el proyecto',
      })
    }
  }

  return (
    <Card className='bg-primary-foreground shadow-xl dark:bg-card'>
      <CardHeader>
        <CardTitle className='font-bold'>
          Crear Proyecto
        </CardTitle>
        <CardDescription>Puedes editar estos datos más adelante</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'
          >

            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      value={field.value || ''}
                      onChange={field.onChange}
                      disabled={isLoading}
                      placeholder='Nombre del proyecto'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción del Proyecto</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Restaurante a la orilla del mar'
                        value={field.value || ''}
                        onChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='status'
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Estatus del Proyecto</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value || ''}
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una opción" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Planning">Planeando</SelectItem>
                          <SelectItem value="In_Progress">En Progreso</SelectItem>
                          <SelectItem value="Completed">Completado</SelectItem>
                        </SelectContent>    
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <Separator />

            <FormField
              control={form.control}
              name='det_location'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación</FormLabel>
                  <FormControl>
                    <LocationPicker 
                      field={field} 
                      isLoading={isLoading}
                      onAddressChange={(address) => {
                        form.setValue('location', address)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='est_completion'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha estimada de finalización</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                            format(field.value, "PPP", { locale: es })
                            ) : (
                            <span>Selecciona una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <Calendar
                          mode="single"
                          selected={field.value || ''}
                          // captionLayout='dropdown-buttons'
                          // fromYear={2020}
                          // toYear={2027}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name='budget'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Presupuesto del Proyecto</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ingresa una cantidad sin comas ni signos Ej. 1000000'
                        value={field.value || ''}
                        onChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      La cantidad debe ser en pesos mexicanos
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button
                type="submit"
                className='shadow-sm'
                disabled={isLoading}
              >
                {isLoading ? <Loading /> : 'Crear Proyecto'}
              </Button>
          </form>
        </Form>
      </CardContent>
    </Card>      
  )
}

export default CreateProject