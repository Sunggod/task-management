import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Users } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Project } from "../types"

interface ProjectListProps {
  projects: Project[]
}

export default function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium mb-2">Nenhum projeto encontrado</h3>
        <p className="text-muted-foreground">Crie seu primeiro projeto para começar.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Link to={`/projetos/${project.id}`} key={project.id} className="block">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{project.name}</CardTitle>
                <Badge variant={getStatusVariant(project.status)}>{getStatusTranslation(project.status)}</Badge>
              </div>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-2 h-4 w-4" />
                  {project.memberCount} membros
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Atualizado {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true, locale: ptBR })}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}

function getStatusVariant(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return "default"
    case "completed":
      return "success"
    case "on hold":
      return "warning"
    case "planning":
      return "secondary"
    default:
      return "secondary"
  }
}

function getStatusTranslation(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return "Ativo"
    case "completed":
      return "Concluído"
    case "on hold":
      return "Em espera"
    case "planning":
      return "Planejamento"
    default:
      return status
  }
}

