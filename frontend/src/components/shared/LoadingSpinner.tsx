import { Loader } from 'lucide-react'

interface LoadingSpinnerProps {
  label?: string
}

export const LoadingSpinner = ({ label = 'Loading...' }: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <Loader className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
