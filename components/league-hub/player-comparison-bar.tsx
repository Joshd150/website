"use client"

interface PlayerComparisonBarProps {
  label: string
  value1: number
  value2: number
  maxValue: number
  isHigherBetter: boolean
}

export function PlayerComparisonBar({ label, value1, value2, maxValue, isHigherBetter }: PlayerComparisonBarProps) {
  const normalizedValue1 = (value1 / maxValue) * 100
  const normalizedValue2 = (value2 / maxValue) * 100

  const isPlayer1Better = isHigherBetter ? value1 > value2 : value1 < value2
  const isPlayer2Better = isHigherBetter ? value2 > value1 : value2 < value1

  const diff = Math.abs(value1 - value2)
  const diffPercentage = (diff / maxValue) * 100

  return (
    <div className="flex flex-col gap-1">
      <div className="text-sm font-medium text-center text-muted-foreground">{label}</div>
      <div className="flex items-center gap-2">
        {/* Player 1 Bar (inverted) */}
        <div className="flex-1 flex justify-end items-center gap-1">
          <span className="text-sm font-bold text-primary-foreground">{value1}</span>
          <div className="relative h-4 bg-white/20 rounded-full flex-1 overflow-hidden">
            <div
              className="absolute right-0 h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${normalizedValue1}%` }}
            />
            {isPlayer1Better && diff > 0 && (
              <div
                className="absolute right-0 h-full bg-green-500 rounded-full transition-all duration-300"
                style={{
                  width: `${normalizedValue1}%`,
                  clipPath: `inset(0 ${normalizedValue1 - diffPercentage}% 0 0)`,
                }}
              />
            )}
          </div>
        </div>

        {/* Player 2 Bar (normal) */}
        <div className="flex-1 flex items-center gap-1">
          <div className="relative h-4 bg-white/20 rounded-full flex-1 overflow-hidden">
            <div
              className="absolute left-0 h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${normalizedValue2}%` }}
            />
            {isPlayer2Better && diff > 0 && (
              <div
                className="absolute left-0 h-full bg-green-500 rounded-full transition-all duration-300"
                style={{
                  width: `${normalizedValue2}%`,
                  clipPath: `inset(0 0 0 ${normalizedValue2 - diffPercentage}%)`,
                }}
              />
            )}
          </div>
          <span className="text-sm font-bold text-primary-foreground">{value2}</span>
        </div>
      </div>
    </div>
  )
}
