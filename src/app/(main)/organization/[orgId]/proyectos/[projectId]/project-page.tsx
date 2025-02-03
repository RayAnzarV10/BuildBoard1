'use client'

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Calendar,
  Clock,
  FileText,
  MapPin,
  MoreHorizontal,
  Plus,
  UserCircle,
  UserPlus,
  Users2,
  Wallet,
} from "lucide-react"
import { Client, Project, ProjectStatus } from "@prisma/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ClientDialog } from "@/components/forms/client-assignement"
import { useRouter } from "next/navigation"

interface Task {
  id: string
  title: string
  status: "pendiente" | "en-progreso" | "completado"
  assignee: string
  dueDate: string
  priority: "alta" | "media" | "baja"
}

interface Comment {
  id: string
  user: string
  avatar: string
  content: string
  timestamp: string
}

export default function ProjectPage({orgId, projectId, project, client}: {orgId:string, projectId:string, project:Project, client?:Client | null}) {
    const [activeTab, setActiveTab] = useState("overview")
    
    const getStatusColor = (status: Task["status"]) => {
      switch (status) {
        case "pendiente":
          return "bg-yellow-100 text-yellow-800"
        case "en-progreso":
          return "bg-blue-100 text-blue-800"
        case "completado":
          return "bg-green-100 text-green-800"
        default:
          return "bg-gray-100 text-gray-800"
      }
    }
    
    const getPriorityColor = (priority: Task["priority"]) => {
      switch (priority) {
        case "alta":
          return "bg-red-100 text-red-800"
        case "media":
          return "bg-orange-100 text-orange-800"
        case "baja":
          return "bg-green-100 text-green-800"
        default:
          return "bg-gray-100 text-gray-800"
      }
    }
    
    const getColor = (status: ProjectStatus) => {
      switch (status) {
        case "Planning":
          return "yellow"
        case "In_Progress":
          return "blue"
        case "Completed":
          return "green"
        default:
          return "red"
      }
    }

    const bgClasses = {
      "Planning": 'bg-gradient-to-r from-yellow-600 to-yellow-900',
      "In_Progress": 'bg-gradient-to-r from-blue-600 to-blue-900',
      "Completed": 'bg-gradient-to-r from-green-600 to-green-900',
    }

    const router = useRouter()

    return (
      <div className="space-y-4">
        <div className={`${bgClasses[project.status]} text-white rounded-md p-6`}>
          <div className="flex justify-between gap-2">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold truncate">{project.name}</h1>
                <Badge variant="secondary" className="bg-white text-black">
                  #{project.id.slice(0, 5)}
                </Badge>
              </div>
              <div className="gap-4 text-gray-100">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <a 
                    href={project.det_location && typeof project.det_location === 'object' && 'lat' in project.det_location ? 
                      `https://www.google.com/maps?q=${project.det_location.lat},${project.det_location.lng}` : 
                      undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {project.location}
                  </a>
                </div>
                <div className="flex items-center gap-1">
                  <UserCircle className="w-4 h-4 shrink-0" />
                  {/* {project.client.company} Nombre del cliente */}
                  {client ? client.name : "No hay cliente asignado"}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 shrink-0" />
                  {new Date(project.est_completion).toLocaleDateString("es-MX", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
            <div className="hidden md:flex gap-2">
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
                Compartir
              </Button>
              <Button variant="secondary" className={`bg-white text-${getColor(project.status)}-600 hover:bg-white/90`}>
                Editar Proyecto
              </Button>
            </div>

            {/* Menú desplegable para pantallas pequeñas */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    Compartir
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Editar Proyecto
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <Card className="bg-white/10 border-none">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-gray-100 mb-2 truncate">
                  <Wallet className="w-4 h-4 shrink-0" />
                  Presupuesto
                </div>
                <div className="text-2xl font-bold text-white truncate">${project.budget.toLocaleString("es-MX")}</div>
                <div className="text-sm text-gray-200 truncate">
                  {/* Gastado: ${project.spent.toLocaleString("es-MX")} */}
                  Gastado: $0.00
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-none">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-gray-100 mb-2">
                  <Clock className="w-4 h-4 shrink-0" />
                  Progreso
                </div>
                <div className="text-2xl font-bold text-white">
                  {/* {project.progress}% */}
                  30%
                </div>
                <Progress value={30} className="h-2 mt-2 bg-white" indicatorColor={`bg-${getColor(project.status)}-800`} />
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-none">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-gray-100 mb-2">
                  <Users2 className="w-4 h-4 shrink-0" />
                  Equipo
                </div>
                <div className="text-2xl font-bold text-white">
                  {/* {projectData.team.length} */}
                  4
                </div>
                <div className="flex -space-x-2 mt-2">
                  {/* {projectData.team.map((member) => (
                    <Avatar key={member.id} {`border-2 border-${getColor(project.status)}-600 w-8 h-8`}>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                  ))} */}
                  <Avatar className={`border-2 border-${getColor(project.status)}-600 w-8 h-8`}>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>AA</AvatarFallback>
                  </Avatar>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-none">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-gray-100 mb-2">
                  <BarChart className="w-4 h-4 shrink-0" />
                  Tareas
                </div>
                <div className="text-2xl font-bold text-white">
                  {/* {projectData.tasks.length} */}
                  4
                </div>
                <div className="text-sm text-gray-200 truncate">
                  {/* {projectData.tasks.filter((t) => t.status === "completado").length} completadas */}
                  1 completadas
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
    
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 ">
          <TabsList className="shadow-lg">
            <TabsTrigger value="overview">Vista General</TabsTrigger>
            <TabsTrigger value="tasks">Tareas</TabsTrigger>
            <TabsTrigger value="team">Equipo</TabsTrigger>
            <TabsTrigger value="files">Archivos</TabsTrigger>
            <TabsTrigger value="IA">Recomendación IA</TabsTrigger>
          </TabsList>
    
          <TabsContent value="IA" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              Hola
            </div>
          </TabsContent>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-5 gap-4">
              <Card className="col-span-3 bg-primary-foreground shadow-lg">
                <CardHeader>
                  <CardTitle>Descripción del Proyecto</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{project.description}</p>
                  <div className="mt-6 space-y-4">
                    <h3 className="font-semibold">Línea de Tiempo</h3>
                    <div className="relative">
                      {/* {projectData.timeline.map((event, index) => (
                        <div key={index} className="flex gap-4 pb-8">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 bg-blue-600 rounded-full" />
                            {index < projectData.timeline.length - 1 && <div className="w-0.5 h-full bg-gray-200" />}
                          </div>
                          <div>
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(event.date).toLocaleDateString("es-MX")}
                            </div>
                            <div className="text-sm mt-1">{event.description}</div>
                          </div>
                        </div>
                      ))} */}
                      Línea del tiempo aquí
                    </div>
                  </div>
                </CardContent>
              </Card>
    
              <Card className="col-span-2 bg-primary-foreground shadow-lg">
                <CardHeader>
                  <CardTitle>Información del Cliente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {project.clientId ? (
                    // Información del cliente cuando existe
                    <div>
                      Información del cliente aquí
                    </div>
                  ) : (
                    // Mensaje cuando no hay cliente
                    <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                      <UserPlus className="h-12 w-12 text-gray-400" />
                      <div>
                        <p className="text-lg font-medium text-gray-900">No hay cliente asignado</p>
                        <p className="text-sm text-gray-500">Asigna un cliente a este proyecto para ver su información</p>
                      </div>
                      <ClientDialog 
                        projectId={ projectId } 
                        orgId={ orgId } 
                        onClientAssigned={() => {
                          router.refresh(); // Esto refrescará los datos de la página
                        }} 
                        currentClientId={ project?.clientId || undefined }
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
    
            <Card className="bg-primary-foreground shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Comentarios Recientes</span>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Añadir Comentario
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* {projectData.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <Avatar>
                        <AvatarImage src={comment.avatar} />
                        <AvatarFallback>{comment.user.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{comment.user}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(comment.timestamp).toLocaleString("es-MX")}
                          </div>
                        </div>
                        <p className="text-sm mt-1">{comment.content}</p>
                      </div>
                    </div>
                  ))} */}
                  Comentarios aquí
                </div>
              </CardContent>
            </Card>
          </TabsContent>
    
          {/* <TabsContent value="tasks" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">Tareas del Proyecto</h2>
                <p className="text-muted-foreground">Gestiona y realiza seguimiento de las tareas del proyecto</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Tarea
              </Button>
            </div>
    
            <div className="grid grid-cols-3 gap-4">
              {(["pendiente", "en-progreso", "completado"] as const).map((status) => (
                <Card key={status}>
                  <CardHeader>
                    <CardTitle className="capitalize">
                      {status.replace("-", " ")}
                      <Badge variant="secondary" className="ml-2">
                        {projectData.tasks.filter((t) => t.status === status).length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-2">
                        {projectData.tasks
                          .filter((task) => task.status === status)
                          .map((task) => (
                            <Card key={task.id}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="space-y-1">
                                    <div className="font-medium">{task.title}</div>
                                    <div className="flex items-center gap-2 text-sm">
                                      <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                                        {task.priority}
                                      </Badge>
                                      <span className="text-muted-foreground">
                                        Vence: {new Date(task.dueDate).toLocaleDateString("es-MX")}
                                      </span>
                                    </div>
                                  </div>
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={projectData.team.find((m) => m.name === task.assignee)?.avatar} />
                                    <AvatarFallback>{task.assignee.slice(0, 2)}</AvatarFallback>
                                  </Avatar>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent> */}
    
          {/* <TabsContent value="team" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">Equipo del Proyecto</h2>
                <p className="text-muted-foreground">Miembros del equipo y sus roles en el proyecto</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Añadir Miembro
              </Button>
            </div>
    
            <div className="grid grid-cols-3 gap-4">
              {projectData.team.map((member) => (
                <Card key={member.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.role}</div>
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Mensaje
                          </Button>
                          <Button variant="outline" size="sm">
                            Ver Perfil
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent> */}
    
          <TabsContent value="files" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">Archivos del Proyecto</h2>
                <p className="text-muted-foreground">Documentos, planos y archivos relacionados</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Subir Archivo
              </Button>
            </div>
    
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  name: "Planos_Arquitectonicos.pdf",
                  type: "PDF",
                  size: "5.2 MB",
                  updatedAt: "2024-01-15",
                },
                {
                  name: "Presupuesto_Detallado.xlsx",
                  type: "Excel",
                  size: "1.8 MB",
                  updatedAt: "2024-01-10",
                },
                {
                  name: "Renders_3D.zip",
                  type: "ZIP",
                  size: "15.4 MB",
                  updatedAt: "2024-01-05",
                },
              ].map((file, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-muted rounded">
                        <FileText className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{file.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {file.type} • {file.size}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Actualizado: {new Date(file.updatedAt).toLocaleDateString("es-MX")}
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm">
                            Descargar
                          </Button>
                          <Button variant="outline" size="sm">
                            Ver
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
}

// interface Task {
//   id: string
//   title: string
//   status: "pendiente" | "en-progreso" | "completado"
//   assignee: string
//   dueDate: string
//   priority: "alta" | "media" | "baja"
// }

// interface Comment {
//   id: string
//   user: string
//   avatar: string
//   content: string
//   timestamp: string
// }

// const projectData = {
//   id: "22d089c8-d1e1-452d-9209-55c4a884480f",
//   name: "Casa Prueba 1",
//   status: "Planeando",
//   description:
//     "Casa de Piedra rústica con acabados modernos y diseño sustentable. Proyecto residencial que combina elementos tradicionales con comodidades contemporáneas.",
//   budget: 4500000,
//   spent: 750000,
//   location: "Colima",
//   estimatedCompletion: "2025-10-04",
//   progress: 15,
//   client: {
//     name: "Roberto Méndez",
//     company: "Inversiones RM",
//     email: "roberto@inversionesrm.mx",
//     phone: "+52 312 123 4567",
//   },
//   team: [
//     { id: "1", name: "Ana García", role: "Arquitecta Principal", avatar: "/placeholder.svg" },
//     { id: "2", name: "Carlos Ruiz", role: "Ingeniero Civil", avatar: "/placeholder.svg" },
//     { id: "3", name: "María Torres", role: "Diseñadora Interior", avatar: "/placeholder.svg" },
//     { id: "4", name: "Juan Pérez", role: "Supervisor de Obra", avatar: "/placeholder.svg" },
//   ],
//   tasks: [
//     {
//       id: "1",
//       title: "Revisión de planos estructurales",
//       status: "completado",
//       assignee: "Carlos Ruiz",
//       dueDate: "2024-02-01",
//       priority: "alta",
//     },
//     {
//       id: "2",
//       title: "Selección de materiales",
//       status: "en-progreso",
//       assignee: "María Torres",
//       dueDate: "2024-02-15",
//       priority: "media",
//     },
//     {
//       id: "3",
//       title: "Presupuesto detallado",
//       status: "en-progreso",
//       assignee: "Ana García",
//       dueDate: "2024-02-20",
//       priority: "alta",
//     },
//     {
//       id: "4",
//       title: "Trámites municipales",
//       status: "pendiente",
//       assignee: "Juan Pérez",
//       dueDate: "2024-03-01",
//       priority: "media",
//     },
//   ] as Task[],
//   comments: [
//     {
//       id: "1",
//       user: "Ana García",
//       avatar: "/placeholder.svg",
//       content: "Actualizados los planos con las modificaciones solicitadas por el cliente.",
//       timestamp: "2024-01-20T10:30:00",
//     },
//     {
//       id: "2",
//       user: "Carlos Ruiz",
//       avatar: "/placeholder.svg",
//       content: "Cálculos estructurales completados. Programando reunión de revisión.",
//       timestamp: "2024-01-19T15:45:00",
//     },
//   ] as Comment[],
//   timeline: [
//     { date: "2024-01-15", title: "Inicio del Proyecto", description: "Kickoff meeting con el equipo y cliente" },
//     { date: "2024-02-01", title: "Fase de Diseño", description: "Comienzo de diseño arquitectónico" },
//     { date: "2024-03-15", title: "Permisos", description: "Gestión de permisos de construcción" },
//   ],
// }


