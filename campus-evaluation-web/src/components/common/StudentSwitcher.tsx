import { useState } from 'react'
import { useCurrentStudent } from '../../hooks/useCurrentStudent'
import { ChevronDown, CheckIcon } from '../icons'

export default function StudentSwitcher() {
  const { currentStudent, linkedStudents, switchStudent } = useCurrentStudent()
  const [open, setOpen] = useState(false)

  if (!currentStudent) {
    return <span className="text-xs text-fg-muted">未关联学生</span>
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm font-medium text-fg hover:opacity-80 transition-opacity"
      >
        <span className="w-7 h-7 rounded-full bg-bg-elevated flex items-center justify-center text-xs font-display border border-divider">
          {currentStudent.name[0]}
        </span>
        <span>{currentStudent.name}</span>
        <span className="text-2xs text-fg-muted">{currentStudent.className}</span>
        <ChevronDown size={14} className={`text-fg-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-48 glass rounded-card shadow-float border border-divider z-50 py-1 overflow-hidden">
            {linkedStudents.map((s) => (
              <button
                key={s.id}
                onClick={() => { switchStudent(s.id); setOpen(false) }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-surface transition-colors flex items-center gap-2
                  ${s.id === currentStudent.id ? 'text-primary font-medium' : 'text-fg'}`}
              >
                <span className="w-6 h-6 rounded-full bg-bg-elevated flex items-center justify-center text-2xs font-display border border-divider">
                  {s.name[0]}
                </span>
                {s.name} · {s.className}
                {s.id === currentStudent.id && <CheckIcon size={14} className="ml-auto text-primary" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
