import * as React from "react"

export function useToast() {
  const [toast, setToast] = React.useState<{
    message: string
    variant: "default" | "destructive"
  } | null>(null)

  const showToast = (message: string, variant: "default" | "destructive" = "default") => {
    setToast({ message, variant })
    setTimeout(() => setToast(null), 3000)
  }

  return { toast, showToast }
}
