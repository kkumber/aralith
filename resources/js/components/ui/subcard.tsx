import * as React from "react"
import { cn } from "@/lib/utils"
import { title } from "process"

type SubCardProps = React.ComponentProps<"div"> & {
  className?: string
  title?: string
  content?: string
  description?: string
}

export function SubCard({ title, content, description, className, ...props }: SubCardProps) {

  return (
    <div
      className={cn(`text-card-foreground border flex flex-col gap-2 rounded-sm p-4 hover:cursor-pointer hover:border-primary-green `, className)}
      {...props}
    >
        {title && <p className="leading-none font-semibold text-text-primary dark:text-dark-text-primary">{title}</p>}
        {description && <small>{description}</small>}
        {content && <p>{content}</p>}
        

    </div>
  )
}
