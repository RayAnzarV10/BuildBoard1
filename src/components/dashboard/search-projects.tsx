'use client'

import { projects, statusIcons } from "@/lib/constants"
import { ProjectCard } from "../ui/card_buildboard"
import { ScrollArea } from "../ui/scroll-area"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState("")
  const [status, setStatus] = useState("all")
  const [sortOrder, setSortOrder] = useState("none")

  // Apply all filters in a single function
  const getFilteredAndSortedProjects = () => {
    // Start with all projects
    let filteredProjects = [...projects]

    // 1. First apply search filter if there is a search term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase()
      filteredProjects = filteredProjects.filter(project => 
        project.name.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.id.toLowerCase().includes(term)
      )
    }

    // 2. Then apply status filter if a specific status is selected
    if (status !== "all") {
      filteredProjects = filteredProjects.filter(project => 
        project.status.toLowerCase() === status.toLowerCase()
      )
    }

    // 3. Finally, apply sorting if a sort order is selected
    if (sortOrder !== "none") {
      filteredProjects.sort((a, b) => {
        const dateA = new Date(a.estimated_completion)
        const dateB = new Date(b.estimated_completion)
        return sortOrder === "newest" 
          ? dateB.getTime() - dateA.getTime()
          : dateA.getTime() - dateB.getTime()
      })
    }

    return filteredProjects
  }

  return (
    <Card className="bg-primary-foreground shadow-lg dark:bg-card w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold truncate">
          Proyectos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-4">
          <Input
            type="text"
            className="truncate"
            placeholder="Buscar proyecto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select 
            value={status} 
            onValueChange={setStatus}
          >
            <SelectTrigger>
              <SelectValue placeholder="Estatus" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fase del Proyecto</SelectLabel>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="En Progreso">En Progreso</SelectItem>
                <SelectItem value="Completado">Completado</SelectItem>
                <SelectItem value="Planeando">Planeación</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select 
            value={sortOrder} 
            onValueChange={setSortOrder}
          >
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
        <ScrollArea className="rounded-md items-center h-96">
          {getFilteredAndSortedProjects().length === 0 ? (
            <p className="w-full text-center text-muted-foreground">No se encontraron proyectos</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {getFilteredAndSortedProjects().map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  statusIcons={statusIcons} 
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

