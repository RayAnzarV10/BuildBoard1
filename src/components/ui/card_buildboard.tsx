import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, CalendarDays, DollarSign } from 'lucide-react';
import clsx from 'clsx';

// Componente reutilizable
export const ProjectCard = ({ project, statusIcons, className }: { project: any, statusIcons: any, className?: string }) => {
  return (
    <Card className={clsx("w-[300px] max-h-[415px]", className)} key={project.name}>
      {/* Encabezado */}
      <CardHeader className="m-1">
        <div className="flex justify-between">
          <Badge
            className={clsx({
              'bg-green-100 text-green-600 font-bold': project.status === 'Completado',
              'bg-blue-100 text-blue-600 font-bold': project.status === 'En Progreso',
              'bg-yellow-100 text-yellow-600 font-bold': project.status === 'Planeando',
            })}
          >
            {statusIcons[project.status as keyof typeof statusIcons]} {project.status}
          </Badge>
          <span className="font-bold">#{project.id}</span>
        </div>
        <CardTitle className="flex justify-between font-bold">{project.name}</CardTitle>
        <CardDescription className="truncate">{project.description}</CardDescription>
      </CardHeader>

      {/* Contenido */}
      <CardContent className="flex m-1 mt-[-10]">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center gap-1 break-words">
            <MapPin size={16} className="shrink-0" />
            <span style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{project.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays size={16} className="shrink-0" />
            <span style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
              {project.estimated_completion}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign size={16} className="shrink-0" />
            <span style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
              {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(
                Number(project.budget)
              )}
            </span>
          </div>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="m-1 mt-[-10]">
        <div className="border-t w-full flex justify-between items-start pt-2">
          <div className="flex-col">
            <p>Ingresos Totales</p>
            <span
              className="text-green-600 font-semibold"
              style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
            >
              {project.budget !== undefined
                ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(
                    project.income
                  )
                : 'N/A'}
            </span>
          </div>
          <div className="flex-col">
            <p>Gastos Totales</p>
            <span
              className="text-red-600 font-semibold"
              style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
            >
              {project.budget !== undefined
                ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(
                    project.expense
                  )
                : 'N/A'}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
