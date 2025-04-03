import { getProjects } from "@/lib/data"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Users } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { getBadgeStatusColor } from "@/utils/statusColors"

export default async function ProjectList() {
  const projects = await getProjects()

  if (projects.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium mb-2">Sem projetos</h3>
        <p className="text-muted-foreground">Crie seu primeiro projeto para iniciar</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Link href={`/projects/${project.id}`} key={project.id}>
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{project.name}</CardTitle>
                <Badge className={`${getBadgeStatusColor(project.status)} dark:text-white transition-all`} variant={getStatusVariant(project.status)}>{project.status}</Badge>
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
                  Atualizado há {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-primary dark:bg-blue-300 h-2.5 rounded-full " style={{ width: `${project.progress}%` }}></div>
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
      return "outline"
    case "completed":
      return "secondary"
    case "on hold":
      return "destructive"
    default:
      return "secondary"
  }
}
