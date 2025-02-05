import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, Upload, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Tipos
interface NewIncomeFormProps {
  projectId: string;
  orgId: string;
  clients: {
    id: string;
    name: string;
  }[];
  onSubmit: (data: IncomeFormData) => Promise<void>;
  isLoading?: boolean;
}

interface IncomeFormData {
  date: Date;
  clientId: string;
  amount: number;
  tax: number;
  description: string;
  paymentMethod: string;
  currency: string;
  exchangeRate: number;
  category: string;
  inv_number?: string;
  receipt_files?: string[];
}

// Datos estáticos
const paymentMethods = [
  "Efectivo",
  "Transferencia",
  "Tarjeta de Crédito",
  "Tarjeta de Débito",
  "Otros"
];

const categories = [
  "Ventas",
  "Servicios",
  "Consultoría",
  "Otros"
];

const currencies = [
  "MXN",
  "USD",
  "EUR"
];

export default function NewIncomeForm({
  projectId,
  orgId,
  clients,
  onSubmit,
  isLoading = false,
}: NewIncomeFormProps) {
  // Estados
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string }[]>([]);

  // Form
  const form = useForm<IncomeFormData>({
    defaultValues: {
      date: new Date(),
      clientId: "",
      amount: 0,
      tax: 0,
      description: "",
      paymentMethod: "",
      currency: "MXN",
      exchangeRate: 1,
      category: "",
      inv_number: "",
      receipt_files: [],
    },
  });

  // Manejadores
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      // 1. Obtener URL firmada
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      if (!response.ok) throw new Error("Error al obtener URL de subida");
      
      const { url, fields } = await response.json();

      // 2. Subir archivo a S3
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append("file", file);

      const uploadResponse = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) throw new Error("Error al subir archivo");

      // 3. Actualizar estado
      const fileUrl = `${url}/${fields.key}`;
      const newFile = { name: file.name, url: fileUrl };
      setUploadedFiles(prev => [...prev, newFile]);
      
      // 4. Actualizar form
      const currentFiles = form.getValues("receipt_files") || [];
      form.setValue("receipt_files", [...currentFiles, fileUrl]);
      
    } catch (error) {
      console.error("Error en la subida:", error);
      alert("Error al subir el archivo");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (data: IncomeFormData) => {
    try {
      await onSubmit(data);
      setOpen(false);
      form.reset();
      setUploadedFiles([]);
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="default">Nuevo Ingreso</Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-3xl">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex justify-between items-start">
            <div>
              <AlertDialogTitle className="text-2xl font-semibold">
                Registrar Nuevo Ingreso
              </AlertDialogTitle>
              <p className="text-sm text-muted-foreground">
                Ingresa los datos del nuevo ingreso
              </p>
            </div>
            <AlertDialogCancel className="p-2 h-auto">
              <X className="h-4 w-4" />
            </AlertDialogCancel>
          </div>
        </div>

        <div className="p-6 pt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* Fecha y Cliente */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
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
                            disabled={isLoading}
                            initialFocus
                            locale={es}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientId"
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

              {/* Monto e Impuesto */}
              <div className="grid grid-cols-2 gap-4">
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
                  name="tax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Impuesto</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Método de Pago y Categoría */}
              <div className="grid grid-cols-2 gap-4">
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
                          {paymentMethods.map((method) => (
                            <SelectItem key={method} value={method}>
                              {method}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
              </div>

              {/* Moneda y Tipo de Cambio */}
              <div className="grid grid-cols-2 gap-4">
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
                          {currencies.map((currency) => (
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
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Número de Factura */}
              <FormField
                control={form.control}
                name="inv_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Factura</FormLabel>
                    <FormLabel className="text-muted-foreground"> (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Número de factura"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Subida de Archivos */}
              <FormField
                control={form.control}
                name="receipt_files"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comprobantes</FormLabel>
                    <FormLabel className="text-muted-foreground"> (Opcional)</FormLabel>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          disabled={isLoading || uploading}
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Subir archivos
                        </Button>
                        <input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file);
                          }}
                          disabled={isLoading || uploading}
                        />
                      </div>
                
                      {/* Lista de archivos subidos */}
                      {uploadedFiles.length > 0 && (
                        <div className="grid gap-2">
                          {uploadedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 border rounded-md"
                            >
                              <span className="text-sm truncate">{file.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newFiles = uploadedFiles.filter((_, i) => i !== index);
                                  setUploadedFiles(newFiles);
                                  form.setValue(
                                    "receipt_files",
                                    newFiles.map((f) => f.url)
                                  );
                                }}
                                disabled={isLoading}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
                />
                
                              {/* Botones de acción */}
                              <div className="flex justify-end space-x-2 pt-4">
                                <AlertDialogCancel 
                                  type="button"
                                  disabled={isLoading}
                                >
                                  Cancelar
                                </AlertDialogCancel>
                                <Button 
                                  type="submit"
                                  disabled={isLoading || uploading}
                                >
                                  {isLoading ? "Guardando..." : "Guardar"}
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </div>
                      </AlertDialogContent>
                    </AlertDialog>
                  );
                }
                          