import { Badge } from "@/components/ui/badge"
import { getProjectMembers } from "@/lib/data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default async function ProjectMembers({ projectId }: { projectId: number }) {
  const members = await getProjectMembers(projectId)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Team Members</h2>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/projects/${projectId}/members/invite`}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Invite Member
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {members.map((member) => (
          <div key={member.id} className="flex items-center p-4 border rounded-lg">
            <Avatar className="h-10 w-10 mr-4">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.email}</p>
            </div>
            <Badge className="ml-auto" variant={member.role === "owner" ? "default" : "secondary"}>
              {member.role}
            </Badge>
          </div>
        ))}
      </div>
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

