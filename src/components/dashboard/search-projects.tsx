import { projects, statusIcons } from "@/lib/constants"
import { ProjectCard } from "../ui/card_buildboard"
import { ScrollArea } from "../ui/scroll-area"
import { Input } from "@/components/ui/input"
import { useCallback, useState, useEffect } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"

interface SearchBarProps {
  onSearch: (term: string) => void;
  onStatusChange: (status: string) => void;
  onSortChange: (sort: string) => void;
}

function SearchBar({ onSearch, onStatusChange, onSortChange }: SearchBarProps) {
  const [term, setTerm] = useState('')

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = e.target.value
    setTerm(newTerm)
    onSearch(newTerm)
  }, [onSearch])

  const handleStatusChange = useCallback((value: string) => {
    onStatusChange(value)
  }, [onStatusChange])

  const handleSortChange = useCallback((value: string) => {
    onSortChange(value)
  }, [onSortChange])

  return (
    <div className="flex-none space-y-4">
      <div className="w-full">
        <Input
          type="text"
          className="truncate"
          placeholder="Buscar proyecto..."
          value={term}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-row gap-4">
        <div className="flex-1">
          <Select onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Estatus" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fase del Proyecto</SelectLabel>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="completado">Completado</SelectItem>
                <SelectItem value="en-progreso">En Progreso</SelectItem>
                <SelectItem value="planeacion">Planeación</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Select onValueChange={handleSortChange}>
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
    </div>
  )
}

interface CardListProps {
  cards: typeof projects;
}

function CardList2({ cards }: CardListProps) {
  return (
    <ScrollArea className="h-[calc(100dvh-15rem)] md:h-[calc(100dvh-18.5rem)] rounded-md">
      <div className="grid grid-cols-1 gap-4">
        {cards.length === 0 ? (
          <p className="text-center text-muted-foreground">No se encontraron proyectos</p>
        ) : (
          cards.map(card => (
            <ProjectCard key={card.id} project={card} statusIcons={statusIcons} />
          ))
        )}
      </div>
    </ScrollArea>
  )
}

export default function Projects() {
  const [cards, setCards] = useState(projects)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [sortOrder, setSortOrder] = useState('none') // Cambiado el valor inicial

  const filterAndSortCards = useCallback(() => {
    let filtered = [...projects];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        card => 
          card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Filtrar por status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(card => card.status === selectedStatus)
    }
    
    // Ordenar por fecha solo si se ha seleccionado un orden
    if (sortOrder !== 'none') {
      filtered.sort((a, b) => {
        const dateA = new Date(a.estimated_completion).getTime()
        const dateB = new Date(b.estimated_completion).getTime()
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
      })
    }
    
    setCards(filtered)
  }, [searchTerm, selectedStatus, sortOrder])

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  const handleStatusChange = useCallback((status: string) => {
    setSelectedStatus(status)
  }, [])

  const handleSortChange = useCallback((sort: string) => {
    setSortOrder(sort)
  }, [])

  // Efecto para aplicar los filtros cuando cambian los criterios
  useEffect(() => {
    filterAndSortCards()
  }, [filterAndSortCards, searchTerm, selectedStatus, sortOrder])

  return (
    <div className="rounded-md bg-primary-foreground dark:bg-background shadow-[0_0_100px_rgba(0,0,0,0.1)] p-4 w-[333px]">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold mb-4 flex-none">Proyectos</h1>
        <SearchBar 
          onSearch={handleSearch} 
          onStatusChange={handleStatusChange} 
          onSortChange={handleSortChange}
        />
        <CardList2 cards={cards} />
      </div>
    </div>
  )
}