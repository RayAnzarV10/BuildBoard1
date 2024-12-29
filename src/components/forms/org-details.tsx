'use client'

import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '../ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { Organization } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import * as z from 'zod'
import FileUpload from '../global/file-upload'
import Loading from '../global/loading'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Select } from '../ui/select'
import { Separator } from '../ui/separator'
import { Switch } from '../ui/switch'
import { CollapsibleSelect, CollapsibleSelect2 } from './collapsible-select'
import { deleteOrg, initUser, upsertOrg } from '@/lib/queries'
import {v4} from 'uuid'
import { HexColorPicker } from 'react-colorful'

type Props = {
    data?: Partial <Organization>
}

const FormSchema = z.object({
    name: z.string().min(2, { message: 'El nombre de la empresa debe tener al menos 2 caracteres' }),
    description: z.string().min(2, { message: 'La descripción de la empresa debe tener al menos 2 caracteres' }),
    email: z.string().email({ message: 'El correo no es válido' }),
    phone: z.string().min(1, { message: 'El teléfono no es válido' }),
    whiteLabel: z.boolean(),
    address: z.string().min(1, { message: 'La dirección no es válida' }),
    city: z.string().min(1, { message: 'La ciudad no es válida' }),
    zipCode: z.string().min(1, { message: 'El código postal no es válido' }),
    state: z.string().min(1, { message: 'El estado no es válido' }),
    country: z.string().min(1, { message: 'El país no es válido' }),
    logo: z.string().min(1, { message: 'El logo no es válido' }),
    teammembers: z.string().min(1, { message: 'Selecciona al menos una opción' }),
    financingType: z.string().min(1, { message: 'Selecciona al menos una fuente de financiamiento' }),
    productsAndServices: z.string().min(1, { message: 'Ingresa al menos un producto o servicio' }),
    pains: z.string().min(1, { message: 'Ingresa por lo menos una problemática' }),
    paymentMethods: z.string().min(1, { message: 'Selecciona al menos un método de pago' }),
    expectations: z.string().min(1, { message: 'Ingresa al menos una expectativa' }),
    primary_color: z.string().default('#4F46E5'),

})

const OrgDetails = ({data}:Props) => {
  const {toast} = useToast();
  const router = useRouter();
  const [deletingOrg, setDeletingOrg] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: data?.name,
      description: data?.description,
      email: data?.email,
      phone: data?.phone,
      whiteLabel: data?.whiteLabel || false,
      address: data?.address,
      city: data?.city,
      zipCode: data?.zipCode,
      state: data?.state,
      country: data?.country,
      logo: data?.logo,
      teammembers: data?.teammembers,
      financingType: data?.financingType,
      productsAndServices: data?.productsAndServices,
      pains: data?.pains,
      paymentMethods: data?.paymentMethods,
      expectations: data?.expectations,
      primary_color: data?.primary_color || '#4F46E5',
    }
  })
  const isLoading = form.formState.isSubmitting

  useEffect(() => {
    if (data?.id) {
      form.reset(data)
    }
  }, [data])

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      let newUserData
      let customerId
      if (!data?.id) {
        const bodyData = {
          email: values.email,
          name: values.name,
          shipping: {
            address: {
              city: values.city,
              country: values.country,
              line1: values.address,
              postal_code: values.zipCode,
              state: values.state,
            },
            name: values.name,
          },
          address: {
            city: values.city,
            country: values.country,
            line1: values.address,
            postal_code: values.zipCode,
            state: values.state,
          },
        }

        // const customerResponse = await fetch('/api/stripe/create-customer', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(bodyData),
        // })
        // const customerData: { customerId: string } =
        //   await customerResponse.json()
        // customerId = customerData.customerId
      }

      newUserData = await initUser({ role: 'ORG_OWNER' })
      if (!data?.id) {
        const response = await upsertOrg({
          id: data?.id ? data.id : v4(),
          // customerId: data?.customerId || customerId || '',
          address: values.address,
          logo: values.logo,
          city: values.city,
          phone: values.phone,
          country: values.country,
          name: values.name,
          state: values.state,
          whiteLabel: values.whiteLabel,
          zipCode: values.zipCode,
          createdAt: new Date(),
          updatedAt: new Date(),
          email: values.email,
          connectAccountId: '',
          description: values.description,
          primary_color: values.primary_color,
          teammembers: values.teammembers,
          financingType: values.financingType,
          productsAndServices: values.productsAndServices,
          pains: values.pains,
          paymentMethods: values.paymentMethods,
          expectations: values.expectations,
        })
        toast({
          title: 'Created Organization',
        })
        if (data?.id) return router.refresh()
          if (response) {
            return router.refresh()
          }
      }
    } catch (error) {
      console.log(error)
      toast({
        variant: 'destructive',
        title: 'Opps!',
        description: 'Hubo un error al crear tu organización',
      })
    }
  }

  const handleDeleteOrg = async () => {
    if(!data?.id) return;
    setDeletingOrg(true);
    try {
      const response = await deleteOrg(data.id);
      toast({
        title: 'Deleted Organization',
        description: 'Deleted your organization and all subaccounts',
      });
      router.refresh();
    } catch (error) {
      console.log(error);
      toast({
        variant: 'destructive',
        title: 'Opps!',
        description: 'Could not delete your organization ',
      });
    }
    setDeletingOrg(false);
  };
  

  return (
    <AlertDialog>
      <Card className='w-full max-w-2x1 mx-auto shadow-xl rounded-md'>
        <CardHeader className='bg-secondary rounded-md'>
          <CardTitle className='text-2xl font-bold'> Información de la Empresa </CardTitle>
          <CardDescription> 
            Puedes editar esta información más tarde en la configuración de la cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent className='py-4'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <h3 className="text-xl font-bold pt-2">Información básica</h3>
              <Separator />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo</FormLabel>
                    <FormControl>
                      <FileUpload
                        apiEndpoint="logo"
                        onChange={field.onChange}
                        value={field.value || ''}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex md:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ladrillos S.A. de C.V."
                          value={field.value || ''}
                          onChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Cambia el email para que se pueda poner uno distinto */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Correo</FormLabel>
                      <FormControl>
                        <Input
                          // readOnly
                          placeholder="ladrillossadecv@gmail.com"
                          value={field.value || ''}
                          onChange={field.onChange}
                          disabled={isLoading}                          
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex md:flex-row gap-4">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Teléfono</FormLabel>
                    <PhoneInput
                      specialLabel=''
                      country={"mx"}
                      value={field.value || ''} 
                      inputClass="!w-full !bg-background !h-10 !rounded-md !border-input !shadow-sm !border"
                      containerClass="react-tel-input"
                      buttonClass="!bg-white"
                      onChange={field.onChange} // Direct field.onChange instead of setState
                      disabled={isLoading}
                    />
                  </FormItem>
                )}
              />
              </div>
              <FormField
                disabled={isLoading}
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Dirección de tu Empresa</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Avenida Revolución 123 colonia Las Lomas"
                        value={field.value || ''}
                        onChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-4 grid-cols-1">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>País</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="México"
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
                  disabled={isLoading}
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nuevo León"
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
                  disabled={isLoading}
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Municipio</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Monterrey"
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
                  disabled={isLoading}
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Código Postal</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="64000"
                          value={field.value || ''}
                          onChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <h3 className="text-xl font-bold pt-6">Descripción</h3>
              <Separator />
              <div className='gap-4'>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción de la empresa</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Cuéntanos sobre tu empresa..."
                          value={field.value || ''}
                          onChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid gap-4 sm:grid-cols-2 grid-cols-1'>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="teammembers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de colaboradores</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue='' 
                        value={field.value || ''}
                        disabled={isLoading}
                        >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder=''/>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='1-10'>1-10</SelectItem>
                          <SelectItem value='10-25'>10-25</SelectItem>
                          <SelectItem value='25-50'>25-50</SelectItem>
                          <SelectItem value='50-75'>50-75</SelectItem>
                          <SelectItem value='75-100'>75-100</SelectItem>
                          <SelectItem value='100+'>100+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="financingType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fuentes de Financiamiento</FormLabel>
                      <CollapsibleSelect
                        value={field.value || ''}
                        onChange={field.onChange}
                        disabled={isLoading}
                        name='financingType'
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="productsAndServices"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>¿Qué productos y/o servicios ofrecen?</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Diseño de interiores, construcción ..."
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
                    disabled={isLoading}
                    control={form.control}
                    name="pains"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>¿Cuáles son los principales retos a los que se enfrentan?</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Retraso en pagos, falta de liquidez ..."
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
                    disabled={isLoading}
                    control={form.control}
                    name="paymentMethods"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>¿Qué métodos de pago aceptan actualmente?</FormLabel>
                        <CollapsibleSelect2
                          value={field.value || ''}
                          onChange={field.onChange}
                          disabled={isLoading}
                          name='paymentMethods'
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="expectations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>¿Qué esperas de una plataforma de administración como <a className='font-bold'>BuildBoard</a>?</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Eliminar tareas tediosas, tener todo más organizado ..."
                            value={field.value || ''}
                            onChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <h3 className="text-xl font-bold pt-6">Configuración Avanzada</h3>
                <Separator />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="whiteLabel"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex flex-row bg-background items-center shadow-sm justify-between rounded-lg border gap-4 p-4">
                        <div>
                          <FormLabel>Modo marca blanca</FormLabel>
                          <FormDescription className='text-'>
                            Activar el modo de marca blanca mostrará el logotipo de tu empresa
                            en todas las subcuentas. Puedes cambiar esta
                            funcionalidad a través de la configuración de subcuentas.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                      </FormItem>
                    )
                  }}
                />
                <Separator />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="primary_color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color principal</FormLabel>
                      <div className='flex justify-start gap-4'>
                        <div className="relative">
                          <HexColorPicker 
                            color={field.value || '#4F46E5'} 
                            onChange={(color) => {
                              field.onChange(color);
                            }}
                            className='shadow-sm'
                          />
                        </div>
                        <div className='flex flex-col pr-4'>
                          <FormDescription style={{color: field.value || '#4F46E5'}} className='text-lg font-bold'>
                            Este color se usará como el color principal de tu página
                          </FormDescription>
                          <FormDescription style={{color: field.value || '#4F46E5'}} className='text-md font-bold'>
                            No te preocupes, si no te gusta lo puedes cambiar después
                          </FormDescription>
                          <FormDescription style={{color: field.value || '#4F46E5'}} className='text-md font-bold'>
                            No se utilizará para texto
                          </FormDescription>
                        </div>
                      </div>
                      <div className='flex items-center justify-between gap-2'>
                        <div 
                          className='w-8 h-8 rounded-full bg-background shadow-inner'
                          style={{ backgroundColor: field.value || '#4F46E5' }}
                        />
                        <Input
                          type='text'
                          value={field.value || '#4F46E5'}
                          onChange={(e) => field.onChange(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator />
                {/* <ColorPicker/> */}
                <Button
                  type="submit"
                  className='shadow-sm'
                  disabled={isLoading}
                >
                  {isLoading ? <Loading /> : 'Guardar y continuar'}
                </Button>
              </form>
          </Form>
          {data?.id && (
            <div className='flex flex-row items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-4'>
              <div>
                <div>Danger zone</div>
              </div>
              <div className='text-muted-foreground'> Eliminar su cuenta no se puede deshacer. Esto también eliminará todas sus subcuentas y todos los datos relacionados </div>
              <AlertDialogTrigger disabled={isLoading || deletingOrg} className='text-red-600 p-2 text-center mt-2 rounded-md hover:bg-red-600 hover:text-white whitespace-nowrap'>{deletingOrg ? 'Borrando...' : 'Eliminar cuenta'}</AlertDialogTrigger>
            </div>
          )}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-left">
                Estás completamente seguro?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                Esta acción <a className='font-bold'>no se puede  deshacer</a>. Esto borrará permanentemente la cuenta de tu empresa y todas las subcuentas relacionadas.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex items-center">
              <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={deletingOrg}
                className="bg-destructive hover:bg-destructive"
                onClick={handleDeleteOrg}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent> 
        </CardContent>
      </Card>
    </AlertDialog>
  )
}

export default OrgDetails