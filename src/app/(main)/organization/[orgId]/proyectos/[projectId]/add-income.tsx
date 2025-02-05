"use client";

import React from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/hooks/use-toast'
import { FileUpload } from '@/components/global/file-upload-s3';
import { Party, PaymentMethod, Currency, TransactionType } from '@prisma/client';
import { createTransaction } from '@/lib/queries';

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
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea'
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Plus } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Loading from '@/components/global/loading';

const FormSchema = z.object({
  date: z.date(),
  partyId: z.string().min(1, { message: 'Debes seleccionar un cliente' }),
  amount: z.string().min(1, { message: 'El monto es requerido' }),
  description: z.string().min(1, { message: 'La descripción es requerida' }),
  paymentMethod: z.nativeEnum(PaymentMethod),
  currency: z.nativeEnum(Currency),
  exchangeRate: z.string().min(1, { message: 'El tipo de cambio es requerido' }),
  category: z.string().min(1, { message: 'La categoría es requerida' }),
  invoiceNumber: z.string().optional(),
});

interface NewIncomeFormProps {
  projectId: string;
  orgId: string;
  clients: Party[];
}

export const NewIncomeForm = ({
  projectId,
  orgId,
  clients,
}: NewIncomeFormProps) => {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: new Date(),
      partyId: "",
      amount: "",
      description: "",
      paymentMethod: PaymentMethod.CASH,
      currency: Currency.MXN,
      exchangeRate: "1",
      category: "",
      invoiceNumber: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const [tempTransactionId] = React.useState(`temp-${Date.now()}`);

  const categories = ["Ventas", "Servicios", "Consultoría", "Otros"];

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      // Preparar los datos para la transacción
      const transactionData = {
        type: TransactionType.INCOME,
        date: values.date,
        partyId: values.partyId,
        projectId: projectId,
        orgId: orgId,
        amount: parseFloat(values.amount),
        description: values.description,
        paymentMethod: values.paymentMethod,
        currency: values.currency,
        exchangeRate: parseFloat(values.exchangeRate),
        category: values.category,
        invoiceNumber: values.invoiceNumber || null,
        // Añadir impuestos si son necesarios
        taxes: {
          create: [{
            name: "IVA",
            rate: 16,
            amount: parseFloat(values.amount) * 0.16
          }]
        }
      };

      // Crear la transacción
      await createTransaction(transactionData);

      toast({
        title: "Éxito",
        description: "Ingreso registrado correctamente",
        duration: 3000,
      });

      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error al crear la transacción:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo registrar el ingreso",
        duration: 3000,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="link" className="text-white">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Ingreso</DialogTitle>
          <DialogDescription>
            Ingresa los datos del nuevo ingreso
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Fecha */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                            disabled={isLoading}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP", { locale: es }) : "Seleccionar fecha"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          locale={es}
                          disabled={isLoading}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Cliente */}
              <FormField
                control={form.control}
                name="partyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Monto */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Método de Pago */}
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de Pago</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar método" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(PaymentMethod).map((method) => (
                          <SelectItem key={method} value={method}>
                            {method.replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Moneda */}
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Moneda</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar moneda" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(Currency).map((currency) => (
                          <SelectItem key={currency} value={currency}>
                            {currency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tipo de Cambio */}
              <FormField
                control={form.control}
                name="exchangeRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Cambio</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.01"
                        placeholder="1.00"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Categoría */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Factura */}
            <div className="space-y-2">
              <FormLabel>Factura</FormLabel>
              <FormLabel className="text-muted-foreground text-sm">(Opcional)</FormLabel>
              <FileUpload transactionId={tempTransactionId} />
            </div>

            {/* Descripción */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descripción del ingreso"
                      className="resize-none"
                      disabled={isLoading}
                      {...field}
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
              {isLoading ? <Loading /> : 'Registrar Ingreso'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewIncomeForm;