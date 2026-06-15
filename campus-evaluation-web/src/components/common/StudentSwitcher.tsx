import { useState } from 'react'
import { useCurrentStudent } from '../../hooks/useCurrentStudent'

export default function StudentSwitcher() {
  const { currentStudent, linkedStudents, switchStudent } = useCurrentStudent()
  const [open, setOpen] = useState(false)

  if (!currentStudent) {
    return <span className="text-xs text-ink-light">未关联学生</span>
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm font-medium text-ink"
      >
        <span className="w-7 h-7 rounded-full bg-paper flex items-center justify-center text-xs font-display">
          {currentStudent.name[0]}
        </span>
        <span>{currentStudent.name}</span>
        <span className="text-2xs text-ink-light">{currentStudent.className}</span>
        <span className="text-2xs text-ink-light">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-48 bg-surface rounded-card shadow-float border border-divider z-50 py-1">
            {linkedStudents.map((s) => (
              <button
                key={s.id}
                onClick={() => { switchStudent(s.id); setOpen(false) }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-paper transition-colors flex items-center gap-2
                  ${s.id === currentStudent.id ? 'text-vermilion font-medium' : 'text-ink'}`}
              >
                <span className="w-6 h-6 rounded-full bg-paper flex items-center justify-center text-2xs font-display">
                  {s.name[0]}
                </span>
                {s.name} · {s.className}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
