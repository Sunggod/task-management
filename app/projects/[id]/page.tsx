import { Suspense } from "react"
import { getProjectById } from "@/lib/data"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TaskSkeleton } from "@/components/skeletons"
import TaskList from "@/components/task-list"
import ProjectMembers from "@/components/project-members"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { getBadgeStatusColor } from "@/utils/statusColors"

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await getProjectById(Number.parseInt(params.id))

  if (!project) {
    notFound()
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <Badge className={`${getBadgeStatusColor(project.status)}`} variant={getStatusVariant(project.status)}>{project.status}</Badge>
          </div>
          <p className="text-muted-foreground mt-1">{project.description}</p>
        </div>
        <Button asChild>
          <Link href={`/projects/${project.id}/tasks/new`}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Tarefa
          </Link>
        </Button>
      </div>

      <div className="mb-6 w-full bg-gray-100 rounded-full h-2.5">
        <div className="bg-primary h-2.5 rounded-full dark:bg-blue-400" style={{ width: `${project.progress}%` }}></div>
      </div>

      <Tabs defaultValue="tasks">
        <TabsList className="mb-6">
          <TabsTrigger value="tasks">Tarefas</TabsTrigger>
          <TabsTrigger value="members">Membros</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks">
          <Suspense fallback={<TaskSkeleton />}>
            <TaskList projectId={project.id} />
          </Suspense>
        </TabsContent>
        <TabsContent value="members">
          <ProjectMembers projectId={project.id} />
        </TabsContent>
      </Tabs>
    </main>
  )
}

function getStatusVariant(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return "default"
    case "completed":
      return "outline"
    case "on hold":
      return "destructive"
    default:
      return "secondary"
  }
}

