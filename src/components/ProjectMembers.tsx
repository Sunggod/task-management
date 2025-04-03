import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle } from "lucide-react"
import { Link } from "react-router-dom"
import type { Member } from "@/types"

interface ProjectMembersProps {
  members: Member[]
  projectId: number
}

export default function ProjectMembers({ members, projectId }: ProjectMembersProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Membros da Equipe</h2>
        <Button variant="outline" size="sm" asChild>
          <Link to={`/projetos/${projectId}/membros/convidar`}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Convidar Membro
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
              {getRoleTranslation(member.role)}
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

function getRoleTranslation(role: string) {
  switch (role.toLowerCase()) {
    case "owner":
      return "Proprietário"
    case "admin":
      return "Administrador"
    case "member":
      return "Membro"
    default:
      return role
  }
}

