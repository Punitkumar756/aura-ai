interface ConfidenceScoreProps {
  score: number // 0-100
  label?: string
}

export const ConfidenceScore = ({ score, label = 'Confidence' }: ConfidenceScoreProps) => {
  const color = score >= 80 ? 'bg-green-600' : score >= 60 ? 'bg-amber-600' : 'bg-red-600'

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-foreground">{Math.round(score)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className={`h-full transition-all duration-300 ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}
