import { Loader2 } from 'lucide-react'

export default function Loader({ size = 30 }: { size?: number }) {
  return <Loader2 size={size} className="animate-spin text-slate-400" />
}
