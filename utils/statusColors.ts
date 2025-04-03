export function getBadgeStatusColor(status:string){
    switch(status.toLocaleLowerCase()){
      case "active":
        return 'bg-yellow-400'
      case "completed":
        return 'bg-green-300'
      case 'planning':
        return 'bg-blue-400'
      case "on hold":
        return "bg-orange-300"
      default:
        return undefined
    }
  }
  