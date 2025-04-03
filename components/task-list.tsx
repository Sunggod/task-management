import { getTasksByProjectId } from "@/lib/data"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { updateTaskStatus } from "@/lib/actions"
import Link from "next/link"

export default async function TaskList({ projectId }: { projectId: number }) {
  const tasks = await getTasksByProjectId(projectId)

  if (tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium mb-2">No tasks found</h3>
        <p className="text-muted-foreground">Add your first task to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-start p-4 border rounded-lg hover:bg-gray-50">
          <form action={updateTaskStatus}>
            <input type="hidden" name="taskId" value={task.id} />
            <input type="hidden" name="completed" value={task.completed ? "false" : "true"} />
            <Checkbox id={`task-${task.id}`} checked={task.completed} className="mt-1 mr-3" />
          </form>

          <div className="flex-1">
            <Link href={`/projects/${projectId}/tasks/${task.id}`} className="block">
              <h3 className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                {task.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{task.priority}</Badge>
                <span className="text-xs text-muted-foreground">
                  Due {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
                </span>
              </div>
            </Link>
          </div>

          {task.assignee && (
            <Avatar className="h-8 w-8">
              <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
              <AvatarFallback>{getInitials(task.assignee.name)}</AvatarFallback>
            </Avatar>
          )}
        </div>
      ))}
    </div>
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

