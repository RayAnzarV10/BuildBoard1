'use client'

import { useEffect, useState } from "react"
import { ProjectCard } from "@/components/ui/card_buildboard"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllProjects } from "@/lib/queries"
import { ProjectStatus } from "@prisma/client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import clsx from "clsx"
import { statusIcons } from "@/lib/constants"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import GoogleMapsPin from "@/components/global/GoogleMap"
import { SafeProject } from "@/lib/types"

interface Project {
  number: number
  status: ProjectStatus
  est_completion: Date
  name: string
  id: string
  orgId: string
  description: string
  createdAt: Date
  updatedAt: Date
  location: string
  det_location: {
    lat: number;
    lng: number;
  }
  budget: number
  clientId: string | null
  totalIncome: number
  totalExpense: number
}

interface ProjectDetailsProps {
  project: SafeProject | null
}

const ProjectDetails = ({ project }: ProjectDetailsProps) => {
  if (!project) return (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      Selecciona un proyecto para ver sus detalles
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
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
				</div>
				<div className="flex flex-1 justify-between">
					<h3 className="text-2xl font-bold truncate">{project.name}</h3>
					<div className="flex items-center space-x-2">
						<Badge variant="secondary" className="text-sm truncate w-fit h-auto">
							#{project.id.slice(0, 5)}
						</Badge>
						<Badge className="font-bold w-fit text-sm">#{project.number}</Badge>
					</div>
				</div>
			</div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold">Descripción</h4>
            <p className="text-muted-foreground truncate">{project.description}</p>
          </div>
          <div>
            <h4 className="font-semibold truncate">Fecha de Entrega</h4>
            <p className="text-muted-foreground">
              {new Date(project.est_completion).toLocaleDateString("es-MX", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <Separator />
          <div className="items-center">
            <GoogleMapsPin latitude={project.det_location.lat} longitude={project.det_location.lng} />
          </div>
          <div>
            <h4 className="font-semibold">Ubicación</h4>
            <a 
              href={`https://www.google.com/maps?q=${project.det_location.lat},${project.det_location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {project.location}
            </a>
          </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold">Presupuesto</h4>
            <p>${project.budget.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface VerticalProjectsProps {
  orgId: string
  className?: string
}

export default function VerticalProjects({ orgId, className }: VerticalProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [status, setStatus] = useState("all")
  const [sortOrder, setSortOrder] = useState("none")
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllProjects(orgId)
        const parsedProjects = data.map(project => ({
          ...project,
          det_location: project.det_location as { lat: number; lng: number }
        }))
        setProjects(parsedProjects)
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [orgId])

  const getFilteredAndSortedProjects = () => {
    let filteredProjects = [...projects]

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase()
      filteredProjects = filteredProjects.filter(project => 
        project.name.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.id.toLowerCase().includes(term)
      )
    }

    if (status !== "all") {
      filteredProjects = filteredProjects.filter(project => 
        project.status.toLowerCase() === status.toLowerCase()
      )
    }

    if (sortOrder !== "none") {
      filteredProjects.sort((a, b) => {
        const dateA = new Date(a.est_completion)
        const dateB = new Date(b.est_completion)
        return sortOrder === "newest" 
          ? dateB.getTime() - dateA.getTime()
          : dateA.getTime() - dateB.getTime()
      })
    }

    return filteredProjects
  }

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
  }

  return (
    <div className="flex-grow flex items-center grid grid-cols-[40%_60%] xs:grid-cols-1 mr-4 gap-4">
      <Card className={`bg-primary-foreground shadow-xl dark:bg-card justify-end w-full h-[calc(100vh-6.2rem)] flex flex-col ${className}`}>
        <CardHeader className="flex flex-col">
          <div className="flex flex-row items-end justify-between">
            <CardTitle className="text-2xl font-bold truncate">Proyectos</CardTitle>
            <Link href={`/organization/${orgId}/proyectos/nuevo`}>
              <Button className="text-xs h-7 px-2">
                Nuevo Proyecto
              </Button>
            </Link>
          </div>
          <CardDescription className="truncate">Explora tus proyectos y sus detalles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-grow flex flex-col overflow-hidden">
          {loading ? (
            <div className="text-gray-400">Cargando proyectos...</div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    type="text"
                    className="w-full truncate pl-10"
                    placeholder="Buscar proyecto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Estatus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Fase del Proyecto</SelectLabel>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="Planning">Planeación</SelectItem>
                        <SelectItem value="In_Progress">En Progreso</SelectItem>
                        <SelectItem value="Completed">Completado</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger>
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Ordenar por Fecha</SelectLabel>
                        <SelectItem value="none">Sin ordenar</SelectItem>
                        <SelectItem value="newest">Más reciente</SelectItem>
                        <SelectItem value="oldest">Más antiguo</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <ScrollArea className="rounded-md items-center flex-grow">
                {getFilteredAndSortedProjects().length === 0 ? (
                  <p className="w-full text-center text-muted-foreground">No existen proyectos aún</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {getFilteredAndSortedProjects().map(project => (
                      <div
                        key={project.id}
                        onClick={() => handleProjectClick(project)}
                        className="cursor-pointer group"
                      >
                        <ProjectCard
                          project={project}
                          className={`transition-all duration-200 hover:shadow-lg dark:hover:bg-slate-800 hover:brightness-105
                            ${selectedProject?.id === project.id ? 'dark:bg-slate-800 brightness-105' : ''}
                          `}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </>
          )}
        </CardContent>
      </Card>
      <Card className="bg-primary-foreground shadow-xl dark:bg-card flex flex-col h-full">
        <CardHeader>
					<CardTitle className="text-2xl font-bold truncate">Detalles del Proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectDetails project={selectedProject} />
        </CardContent>
        <CardFooter className="mt-auto">
          {selectedProject? (
            <Link 
              href={`/organization/${orgId}/proyectos/${selectedProject.id}`} 
              className="w-full"
            >
              <Button 
                variant="secondary" 
                className="bg-primary w-full text-white hover:bg-primary/70"
              >
                Ir al Proyecto
              </Button>
            </Link>
          ) : (
            ''
          )}
        </CardFooter>
      </Card>
    </div>
  )
}