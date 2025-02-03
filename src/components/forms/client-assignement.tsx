'use client'

import React from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Client } from '@prisma/client'
import { useToast } from '@/hooks/use-toast'
import { createClient, assignClientToProject, getClients } from '@/lib/queries'
import { v4 } from 'uuid'

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import Loading from '../global/loading'

const FormSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  phone: z.string().min(10, { message: 'El teléfono debe tener al menos 10 dígitos' }),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  description: z.string().min(1, { message: 'La descripción es requerida' }),
})

interface ClientDialogProps {
  projectId: string;
  currentClientId?: string;
  orgId: string;
  onClientAssigned: () => void;
}

export const ClientDialog = ({
  projectId,
  currentClientId,
  orgId,
  onClientAssigned,
}: ClientDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const [clients, setClients] = React.useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      country: '',
      description: '',
    },
  })

  const isLoading = form.formState.isSubmitting

  React.useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClients(orgId);
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Error al cargar los clientes"
        });
      }
    };

    if (open) {
      fetchClients();
    }
  }, [open, orgId]);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssignClient = async (clientId: string) => {
    console.log('Debug - handleAssignClient llamado con:', { projectId, clientId }); // Debug log
    try {
      if (!projectId || !clientId) {
        throw new Error('ProjectId o ClientId faltante');
      }
  
      const result = await assignClientToProject(projectId, clientId);
      console.log('Debug - Resultado de asignación:', result); // Debug log
      
      toast({
        title: "Cliente asignado",
        description: "El cliente ha sido asignado exitosamente"
      });
      onClientAssigned();
      setOpen(false);
    } catch (error) {
      console.error('Debug - Error en handleAssignClient:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al asignar el cliente"
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const newClient = await createClient({
        ...values,
        orgId,
      });

      await handleAssignClient(newClient.id);
      form.reset();
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al crear el cliente"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">+ Asignar Cliente</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Asignar Cliente al Proyecto</DialogTitle>
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
            <Card>
              <CardHeader>
                <CardTitle>Clientes Existentes</CardTitle>
                <CardDescription>
                  Busca y selecciona un cliente de la lista
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    placeholder="Buscar cliente..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <ScrollArea className="h-72">
                    <div className="space-y-4">
                      {filteredClients.map((client) => (
                        <Card
                          key={client.id}
                          className="cursor-pointer hover:bg-slate-100 transition-colors"
                          onClick={() => handleAssignClient(client.id)}
                        >
                          <CardHeader>
                            <CardTitle className="text-lg">{client.name}</CardTitle>
                            <CardDescription>
                              <div>{client.phone}</div>
                              {client.city && (
                                <div>
                                  {client.city}, {client.state}, {client.country}
                                </div>
                              )}
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="new">
            <Card>
              <CardHeader>
                <CardTitle>Crear Nuevo Cliente</CardTitle>
                <CardDescription>
                  Ingresa los datos del nuevo cliente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dirección</FormLabel>
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

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ciudad</FormLabel>
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
                    </div>

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>País</FormLabel>
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

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción</FormLabel>
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};