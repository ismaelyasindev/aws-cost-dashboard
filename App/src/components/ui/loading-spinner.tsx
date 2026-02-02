import * as React from "react"
import { Loader } from "./icons"
import { cn } from "../../lib/utils"

interface LoadingSpinnerProps {
  className?: string
  size?: number
  text?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className,
  size = 40,
  text = "Loading AWS Cost Dashboard..."
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-screen gap-4", className)}>
      <Loader size={size} className="text-gray-400" />
      <p className="text-gray-400 text-lg">{text}</p>
    </div>
  )
}

