import { getProjectById, getTasksByProjectId } from "@/lib/data"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { ArrowLeft, MessageSquare } from "lucide-react"
import Link from "next/link"
import { updateTaskStatus } from "@/lib/actions"

export default async function TaskDetailPage({
  params,
}: {
  params: { id: string; taskId: string }
}) {
  const projectId = Number.parseInt(params.id)
  const taskId = Number.parseInt(params.taskId)

  const project = await getProjectById(projectId)

  if (!project) {
    notFound()
  }

  const tasks = await getTasksByProjectId(projectId)
  const task = tasks.find((t) => t.id === taskId)

  if (!task) {
    notFound()
  }

  return (
    <main className="container max-w-3xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href={`/projects/${projectId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao projeto
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <form action={updateTaskStatus}>
                  <input type="hidden" name="taskId" value={task.id} />
                  <input type="hidden" name="completed" value={task.completed ? "false" : "true"} />
                  <Checkbox id={`task-${task.id}`} checked={task.completed} className="mt-1" />
                </form>
                <div>
                  <CardTitle className={task.completed ? "line-through text-muted-foreground" : ""}>
                    {task.title}
                  </CardTitle>
                  <CardDescription>{project.name}</CardDescription>
                </div>
              </div>
              <Badge variant="outline">{task.priority}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Descrição</h3>
              <p className="text-sm text-muted-foreground">{task.description || "Descrição da task não encontrada."}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <h3 className="text-sm font-medium mb-1">Data de vencimento</h3>
                <p className="text-sm text-muted-foreground">{format(new Date(task.dueDate), "PPP")}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">Atribuído</h3>
                {task.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                      <AvatarFallback>{getInitials(task.assignee.name)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{task.assignee.name}</span>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Não atribuído
</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <div className="w-full">
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                Comentarios
              </h3>
              <p className="text-sm text-muted-foreground text-center py-6">
              Nenhum comentário ainda. Seja o primeiro a comentar!
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

