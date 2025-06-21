import Image from "next/image"
import { cn } from "@/lib/utils"

interface TechIconProps {
  name: string
  className?: string
  size?: number
}

export function TechIcon({ name, className, size = 24 }: TechIconProps) {
  const iconPath = `/icons/${name.toLowerCase().replace(/\s+/g, "-")}.svg`

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <Image
        src={iconPath || "/placeholder.svg"}
        alt={`${name} icon`}
        width={size}
        height={size}
        className="object-contain"
      />
    </div>
  )
}
