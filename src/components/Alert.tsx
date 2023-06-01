import { X } from 'lucide-react'

interface AlertProps {
  show: boolean
  text: string
  type: string
  handleDismiss: () => void
}

export function Alert({ show, text, type, handleDismiss }: AlertProps) {
  return (
    <div
      className={`fixed right-4 top-4 rounded px-4 py-2  text-white
        ${show ? 'opacity-100' : 'opacity-0'} 
        ${show ? '' : 'hidden'} 
        ${type === 'error' ? ' bg-red-500 ' : ' bg-green-600'}
        cursor-pointer transition-all duration-300`}
      onClick={handleDismiss}
    >
      <div className="flex items-start justify-between gap-2">
        <span>{text}</span>
        <X size={14} color="white" />
      </div>
    </div>
  )
}
