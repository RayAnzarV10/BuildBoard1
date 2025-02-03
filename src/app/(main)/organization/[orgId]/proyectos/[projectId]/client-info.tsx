// components/client/client-info.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Client, Project } from "@prisma/client";
import { ClientDialog } from "@/components/forms/client-assignement";

interface ClientInfoProps {
  project: Project;
  client: Client | null;
  orgId: string;
}

export const ClientInfo = ({ project, client, orgId }: ClientInfoProps) => {
  const router = useRouter();
  const handleClientAssigned = () => {
    router.refresh();
  };

  return (
    <Card className="col-span-2 bg-primary-foreground dark:bg-card shadow-lg">
      <CardHeader>
        <CardTitle>Información del Cliente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {client ? (
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Nombre</div>
              <div className="font-medium truncate">{client.name}</div>
            </div>
            {client.company ? (
              <div>
                <div className="text-sm text-muted-foreground">Empresa</div>
                <div className="font-medium">{client.company}</div>
              </div> 
            ):(
              null
            )}
            <div>
              <div className="text-sm text-muted-foreground">Teléfono</div>
              <div className="font-medium">{client.phone}</div>
            </div>
            {client.email ? (
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium">{client.email}</div>
              </div> 
            ):(
              null
            )}
            <div>
              <div className="text-sm text-muted-foreground">Dirección</div>
              <div className="font-medium truncate">{client.address}</div>
            </div>
            <ClientDialog
              projectId={project.id}
              currentClientId={client.id}
              orgId={orgId}
              onClientAssigned={handleClientAssigned}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <UserPlus className="h-12 w-12 text-gray-400" />
            <p className="text-lg font-medium">No hay cliente asignado</p>
            <p className="text-sm text-gray-500 text-center">
              Asigna un cliente a este proyecto para ver su información
            </p>
            <ClientDialog
              projectId={project.id}
              orgId={orgId}
              onClientAssigned={handleClientAssigned}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};