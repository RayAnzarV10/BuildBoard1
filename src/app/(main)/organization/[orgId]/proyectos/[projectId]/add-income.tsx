"use client";

import React, { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/hooks/use-toast'
import { FileUpload } from '@/components/global/file-upload-s3';
import { Party, PaymentMethod, Currency, TransactionType, Transaction } from '@prisma/client';
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
import Loading from '@/components/global/loading';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface SelectedFile {
  file: File;
  transactionId: string;
}

const FormSchema = z.object({
  date: z.date(),
  partyId: z.string().min(1, { message: 'Debes seleccionar un cliente' }),
  amount: z.coerce
    .number()
    .min(0.01, { message: 'El monto debe ser mayor a 0' }),
  description: z.string().max(500, { message: 'La descripción es demasiado larga' }).optional(),
  paymentMethod: z.nativeEnum(PaymentMethod),
  currency: z.nativeEnum(Currency),
  exchangeRate: z.coerce
    .number()
    .min(0.000001, { message: 'El tipo de cambio debe ser mayor a 0' }),
  category: z.string().min(1, { message: 'La categoría es requerida' }),
  invoiceNumber: z.string().optional(),
});

interface NewIncomeFormProps {
  projectId: string;
  orgId: string;
  clients: Party[];
  data?: Partial <Transaction>
}

export const NewIncomeForm = ({
  projectId,
  orgId,
  clients,
  data
}: NewIncomeFormProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const { toast } = useToast();
  const [tempTransactionId] = useState(`temp-${Date.now()}`);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: data?.date,
      partyId: data?.partyId,
      amount: data?.amount ? Number(data.amount) : undefined,
      description: data?.description || '',
      paymentMethod: data?.paymentMethod || PaymentMethod.EFECTIVO,
      currency: data?.currency || Currency.MXN,
      exchangeRate: data?.exchangeRate ? Number(data.exchangeRate) : undefined,
      category: data?.category || '',
      invoiceNumber: data?.invoiceNumber || undefined,
    },
  });

  const categories = ["Ventas", "Servicios", "Consultoría", "Otros"];
  const router = useRouter();
  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      setIsSubmitting(true);

      // Validación adicional de negocio
      if (values.currency !== Currency.MXN && values.exchangeRate === 1) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Debe especificar un tipo de cambio válido para monedas extranjeras",
        });
        return;
      }

      // Si hay un archivo seleccionado, súbelo primero
      let fileData = null;
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile.file);

        const response = await fetch(`/api/transactions/${selectedFile.transactionId}/attachments`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Error al subir el archivo');
        }

        fileData = await response.json();
      }

      // Preparar los datos para la transacción
      const transactionData = {
        ...values,
        type: TransactionType.INCOME,
        projectId,
        orgId,
        fileUrl: fileData?.url,
        taxes: {
          create: [{
            name: "IVA",
            rate: 16,
            amount: values.amount * 0.16
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
      router.refresh()
      setOpen(false);
      form.reset();
      setSelectedFile(null);
    } catch (error) {
      console.error('Error al crear la transacción:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo registrar el ingreso, intenta de nuevo",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [showCalendar, setShowCalendar] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="link" className="text-white">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
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
                    <div className="relative">
                      <FormControl>
                        <Button
                          type="button"
                          variant={"outline"}
                          className="w-full pl-3 text-left font-normal"
                          onClick={() => setShowCalendar(!showCalendar)}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: es })
                          ) : (
                            <span>Selecciona una fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                      <div 
                        className={cn(
                          "absolute top-full left-0 z-[9999] mt-2 bg-popover rounded-md shadow-md",
                          "transform transition-all duration-200 ease-in-out",
                          showCalendar 
                            ? "opacity-100 translate-y-0" 
                            : "opacity-0 -translate-y-2 pointer-events-none"
                        )}
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setShowCalendar(false);
                          }}
                          initialFocus
                          className="rounded-md border"
                        />
                      </div>
                    </div>
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
                      disabled={isSubmitting}
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
                        step="10"
                        placeholder="0.00"
                        disabled={isSubmitting}
                        value={field.value || ''}
                        onChange={field.onChange}
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
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
                        disabled={isSubmitting}
                        value={field.value || ''}
                        onChange={field.onChange}
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
                    disabled={isSubmitting}
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
              <FormField
                control={form.control}
                name='invoiceNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Factura</FormLabel>
                    <FormLabel className="text-muted-foreground text-sm"> (Opcional)</FormLabel>
                    <FileUpload 
                      transactionId={tempTransactionId}
                      maxSize={15 * 1024 * 1024}
                      allowedTypes={['.pdf', '.png', '.jpg', '.jpeg']}
                      onFileSelect={(file) => {
                        if (file) {
                          setSelectedFile({
                            file,
                            transactionId: tempTransactionId
                          });
                          field.onChange(file.name);
                        } else {
                          setSelectedFile(null);
                          field.onChange('');
                        }
                      }}
                      onError={(error) => {
                        console.error('Error:', error);
                        toast({
                          variant: "destructive",
                          title: "Error",
                          description: "Hubo un error al subir el archivo, intenta de nuevo",
                        });
                      }}
                      disabled={isSubmitting}
                    />
                  </FormItem>
                )}
              />
            </div>

            {/* Descripción */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormLabel className="text-muted-foreground text-sm"> (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descripción del ingreso"
                      className="resize-none"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? <Loading /> : 'Registrar Ingreso'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewIncomeForm;