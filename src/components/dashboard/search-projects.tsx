'use client'

import { useEffect, useState } from "react"
import { ProjectCard } from "../ui/card_buildboard"
import { ScrollArea } from "../ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import Link from "next/link"
import { ProjectStatus } from "@prisma/client"
import { getAllProjects } from "@/lib/queries"

export default function Projects({ orgId, className }: { orgId: string, className?: string }) {
  const [projects, setProjects] = useState<Array<{
    number: number;
    status: ProjectStatus;
    est_completion: Date;
    name: string;
    id: string;
    orgId: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    location: string;
    budget: number;
  }>>([]) // Estado para los proyectos
  const [searchTerm, setSearchTerm] = useState("")
  const [status, setStatus] = useState("all")
  const [sortOrder, setSortOrder] = useState("none")
  const [loading, setLoading] = useState(true) // Estado para la carga

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllProjects(orgId)
        setProjects(data)
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setLoading(false) // Finaliza la carga
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

  return (
    <Card className={`bg-primary-foreground shadow-lg dark:bg-card w-full ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <Link href={`/organization/${orgId}/proyectos`} >
          <CardTitle className="text-2xl font-bold hover:underline truncate">Proyectos</CardTitle>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-gray-400">Cargando proyectos...</div>
        ) : (
          <>
            <div className="flex space-x-4">
              <Input
                type="text"
                className="truncate"
                placeholder="Buscar proyecto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Estatus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fase del Proyecto</SelectLabel>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="In_Progress">En Progreso</SelectItem>
                    <SelectItem value="Completed">Completado</SelectItem>
                    <SelectItem value="Planning">Planeación</SelectItem>
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
            <ScrollArea className="rounded-md items-center h-[26rem]">
              {getFilteredAndSortedProjects().length === 0 ? (
                <p className="w-full text-center text-muted-foreground mt-4">No existen proyectos aún</p>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {getFilteredAndSortedProjects().map(project => (
                    <Link href={`/organization/${orgId}/proyectos/${project.id}`} key={project.id}>
                      <ProjectCard
                        project={project}
                        className="hover:shadow-md hover:brightness-105 dark:hover:brightness-150 transition-all"
                      />
                    </Link>
                  ))}
                </div>
              )}
            </ScrollArea>
          </>
        )}
      </CardContent>
    </Card>
  )
}
