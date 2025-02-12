'use client';

import React from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/hooks/use-toast'
import { assignClientToProject, removeClientFromProject, getClients, createParty } from '@/lib/queries'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import Loading from '../global/loading'
import { useRouter } from 'next/navigation'
import { Party } from '@prisma/client';
import Link from 'next/link';

const FormSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  phone: z.string().min(10, { message: 'El teléfono debe tener al menos 10 dígitos' }),
  email: z.string().email({ message: 'Ingresa un email válido' }).optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  description: z.string().optional(),
})

interface PartyDialogProps {
  projectId: string;
  currentPartyId?: string;
  orgId: string;
  onPartyAssigned: () => void;
}

export const PartyDialog = ({
  projectId,
  currentPartyId,
  orgId,
  onPartyAssigned,
}: PartyDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const [parties, setParties] = React.useState<Party[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      country: '',
      description: '',
      email: '',
      company: '',
    },
  })

  const isLoading = form.formState.isSubmitting;

  React.useEffect(() => {
    const fetchParties = async () => {
      try {
        // Obtener solo los clientes (type: CLIENT)
        const data = await getClients(orgId);
        setParties(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Error al cargar los clientes",
          duration: 3000
        });
      }
    };

    if (open) {
      fetchParties();
    }
  }, [open, orgId]);

  const filteredParties = parties.filter((party) =>
    party.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssignParty = async (partyId: string) => {
    try {
      await assignClientToProject(projectId, partyId);
      toast({
        title: "Cliente asignado",
        description: "El cliente ha sido asignado exitosamente",
        duration: 3000
      });
      onPartyAssigned();
      setOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al asignar el cliente",
        duration: 3000
      });
    }
  };

  const handleRemoveClient = async () => {
    try {
      await removeClientFromProject(projectId);
      toast({
        title: "Cliente removido",
        description: "El cliente ha sido removido exitosamente",
        duration: 3000
      });
      onPartyAssigned();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al remover el cliente",
        duration: 3000
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const newParty = await createParty({
        ...values,
        orgId,
        type: 'CLIENT'
      });

      await handleAssignParty(newParty.id);
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al crear el cliente",
        duration: 3000
      });
    }
  };

  const router = useRouter();

  return (
    <div className="flex gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="text-xs px-2 py-1"
          >
            <span className="block sm:hidden">Cambiar</span>
            <span className="hidden sm:block">
              {currentPartyId ? "Cambiar Cliente" : "+ Asignar Cliente"}
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentPartyId ? "Cambiar Cliente" : "Asignar Cliente al Proyecto"}
            </DialogTitle>
            <DialogDescription>
              Selecciona un cliente existente o crea uno nuevo
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="existing" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="existing">Cliente Existente</TabsTrigger>
              <TabsTrigger value="new">Nuevo Cliente</TabsTrigger>
            </TabsList>

            <TabsContent value="existing">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="text-2xl font-semibold">Clientes Existentes</h3>
                  <p className="text-sm text-muted-foreground">
                    Busca y selecciona un cliente de la lista
                  </p>
                </div>
                <div className="p-6 pt-0">
                  <div className="space-y-4">
                    <Input
                      placeholder="Buscar cliente..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <ScrollArea className="h-72">
                      <div className="space-y-4">
                        {filteredParties.map((client) => (
                          <div
                            key={client.id}
                            onClick={() => handleAssignParty(client.id)}
                            className="rounded-lg border bg-card p-6 cursor-pointer hover:bg-muted transition-colors"
                          >
                            <div className="flex flex-col space-y-1.5">
                              <h3 className="text-lg font-semibold">{client.name}</h3>
                              <div className="text-sm text-muted-foreground">
                                <div>{client.phone}</div>
                                {client.city && (
                                  <div>
                                    {client.city}, {client.state}, {client.country}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
                <Link href={`/organization/${orgId}/clientes`}>
                  <div 
                    className="p-4 mt-2 border-t text-center hover:bg-muted transition-colors cursor-pointer"
                  >
                    <span className="text-blue-500">Ver todos los clientes →</span>
                  </div>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="new">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="text-2xl font-semibold">Crear Nuevo Cliente</h3>
                  <p className="text-sm text-muted-foreground">
                    Ingresa los datos del nuevo cliente
                  </p>
                </div>
                <div className="p-6 pt-0">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Nombre del cliente"
                                  {...field}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Empresa</FormLabel>
                              <FormLabel className='text-muted-foreground'> (Opcional)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Nombre de la empresa"
                                  {...field}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Teléfono</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Teléfono del cliente"
                                  {...field}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormLabel className='text-muted-foreground'> (Opcional)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="correo@ejemplo.com"
                                  type="email"
                                  {...field}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dirección</FormLabel>
                            <FormLabel className='text-muted-foreground'> (Opcional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Dirección del cliente"
                                {...field}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Ciudad, Estado y País en la misma fila */}
                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ciudad</FormLabel>
                              <FormLabel className='text-muted-foreground'> (Opcional)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Ciudad"
                                  {...field}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Estado</FormLabel>
                              <FormLabel className='text-muted-foreground'> (Opcional)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Estado"
                                  {...field}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>País</FormLabel>
                              <FormLabel className='text-muted-foreground'> (Opcional)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="País"
                                  {...field}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descripción</FormLabel>
                            <FormLabel className='text-muted-foreground'> (Opcional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Descripción del cliente"
                                {...field}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full"
                      >
                        {isLoading ? <Loading /> : 'Crear y Asignar Cliente'}
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {currentPartyId && (
        <Button 
          variant="destructive" 
          size="icon"
          onClick={handleRemoveClient}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};