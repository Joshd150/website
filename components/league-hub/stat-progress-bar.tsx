import { cn } from "@/lib/utils"

interface StatProgressBarProps {
  label: string
  value: number
  maxValue?: number
  className?: string
}

export function StatProgressBar({ label, value, maxValue = 99, className }: StatProgressBarProps) {
  const percentage = Math.min(100, (value / maxValue) * 100)

  // Determine color based on value
  let barColorClass = "bg-red-500" // Default to red
  if (value >= 90) {
    barColorClass = "bg-green-500" // Elite
  } else if (value >= 80) {
    barColorClass = "bg-yellow-500" // Great
  } else if (value >= 70) {
    barColorClass = "bg-orange-500" // Good
  } else if (value >= 60) {
    barColorClass = "bg-yellow-700" // Average
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">{label}:</span>
        <span className="font-bold text-white">{value}</span>
      </div>
      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500 ease-out", barColorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
