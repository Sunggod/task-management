import { createTask } from "@/lib/actions"
import { getProjectById, getProjectMembers } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function NewTaskPage({ params }: { params: { id: string } }) {
  const projectId = Number.parseInt(params.id)
  const project = await getProjectById(projectId)

  if (!project) {
    notFound()
  }

  const members = await getProjectMembers(projectId)

  return (
    <main className="container max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
          <CardDescription>Create a new task for project: {project.name}</CardDescription>
        </CardHeader>
        <form action={createTask}>
          <input type="hidden" name="projectId" value={projectId} />
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input id="title" name="title" placeholder="Enter task title" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="Enter task description" rows={3} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select name="priority" defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" name="dueDate" type="date" required defaultValue={getDefaultDueDate()} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assigneeId">Assign To</Label>
              <Select name="assigneeId">
                <SelectTrigger>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id.toString()}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href={`/projects/${projectId}`}>Cancel</Link>
            </Button>
            <Button type="submit">Create Task</Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}

function getDefaultDueDate() {
  const date = new Date()
  date.setDate(date.getDate() + 7) // Default to 1 week from now
  return date.toISOString().split("T")[0]
}

