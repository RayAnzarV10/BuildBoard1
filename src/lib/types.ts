import { Notification, Party, Role } from "@prisma/client"

export type NotificationWithUser =
  | ({
      User: {
        id: string
        name: string
        avatarUrl: string
        email: string
        createdAt: Date
        updatedAt: Date
        role: Role
        orgId: string | null
      }
    } & Notification)[]
  | undefined


  import { ProjectStatus } from '@prisma/client';

  // Interfaz para proyectos con valores seguros (números en lugar de Decimal)
  export interface SafeProject {
    id: string;
    number: number;
    orgId: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    status: ProjectStatus;
    location: string;
    det_location: {
      lat: number;
      lng: number;
    };
    est_completion: Date;
    budget: number;
    totalIncome: number;
    totalExpense: number;
    clientId: string | null;
    transactions?: SafeTransaction[];
  }
  
  // Interfaz para transacciones con valores seguros
  export interface SafeTransaction {
    id: string;
    orgId: string;
    projectId: string;
    type: 'INCOME' | 'EXPENSE';
    amount: number;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    date: Date;
    category: string | null;
    subcategory: string | null;
    notes: string | null;
    recurrence: string | null;
  }
  
  // Props para el componente ProjectPage
  export interface ProjectPageProps {
    orgId: string;
    projectId: string;
    project: SafeProject;
    client?: Party | null
    clients?: Party[];
  }
  
  // Props para el componente ProjectCard
  export interface ProjectCardProps {
    project: SafeProject;
    className?: string;
  }
  
  // Props para ProjectDetails
  export interface ProjectDetailsProps {
    project: SafeProject | null;
  }