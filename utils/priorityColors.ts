export function getColorPriority(priority:string) {
    switch(priority.toLowerCase()){
      case "high":
      return 'bg-red-400'
      case "medium":
        return 'bg-orange-400'
      default:
        return 'bg-blue-200'
    }
  }