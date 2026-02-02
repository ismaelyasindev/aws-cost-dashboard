import * as React from "react"
import { AlertCircle } from "./icons"
import { cn } from "../../lib/utils"

interface ErrorMessageProps {
  className?: string
  message?: string
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  className,
  message = "Failed to load dashboard data"
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-screen gap-4", className)}>
      <AlertCircle size={48} className="text-red-400" />
      <p className="text-red-400 text-lg">{message}</p>
    </div>
  )
}

