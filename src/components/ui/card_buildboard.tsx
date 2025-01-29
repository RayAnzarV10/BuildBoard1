import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, CalendarDays, Wallet } from 'lucide-react';
import clsx from 'clsx';
import { statusIcons } from '@/lib/constants';

// Componente reutilizable
export const ProjectCard = ({ project, className }: { project: any, className?: string }) => {
  return (
    <Card className={clsx("max-h-[415px]", className)} key={project.name}>
      {/* Encabezado */}
      <CardHeader>
        <div className="flex flex-1 justify-between">
          <Badge
            className={clsx({
              'bg-green-100 text-green-600 font-semibold': project.status === 'Completed',
              'bg-blue-100 text-blue-600 font-semibold': project.status === 'In_Progress',
              'bg-yellow-100 text-yellow-600 semifont-bold': project.status === 'Planning',
            })}
          >
            {statusIcons[project.status as keyof typeof statusIcons]}
          </Badge>
          <span className="font-bold">#{project.number}</span>
        </div>
        <CardTitle className="justify-between font-bold truncate pb-2">{project.name}</CardTitle>
        <CardDescription className="truncate">{project.description}</CardDescription>
      </CardHeader>

      {/* Contenido */}
      <CardContent className="flex flex-col mt-[-10] space-y-3">
        <div className="flex items-center gap-1" >
          <MapPin size={16} className="shrink-0" />
          <span className='truncate'>{project.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <CalendarDays size={16} className="shrink-0" />
          <span className='truncate'>
            {new Date(project.est_completion).toLocaleDateString("es-MX", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex flex-row items-center gap-1">
          <Wallet size={16} className="shrink-0" style={{ marginTop: '0.1em' }}/>
          <span className='truncate'>
            {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(
              Number(project.budget)
            )}
          </span>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="m-1 mt-[-10]">
        <div className="border-t w-full flex pt-2">
          <div className="flex-col w-1/2">
            <p className='text-sm font-semibold'>Ingresos Totales</p>
            <span
              className="text-green-600 font-semibold text-sm"
              style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
            >
              {project.income
              ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(
              project.income
              )
              : '$0'}
            </span>
          </div>
          <div className="flex-col w-1/2">
            <p className='text-sm font-semibold'>Gastos Totales</p>
            <span
              className="text-red-600 font-semibold text-sm"
              style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
            >
              {project.expense 
                ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(
                project.expense
              )
                : '$0'}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
