import React from 'react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Card } from '../ui/card'
import { z } from 'zod'

const CreateProject = () => {

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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='p-2 h-fit'>
          Crear Proyecto
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle/>
        <Card className='border-none shadow-none'>
          Hola buenas
        </Card>
      </DialogContent>
    </Dialog>
  )
}

export default CreateProject