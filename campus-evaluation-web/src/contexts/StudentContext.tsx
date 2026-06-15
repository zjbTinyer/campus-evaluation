import { createContext, useState, useCallback } from 'react'

export interface LinkedStudent {
  id: string
  name: string
  className: string
  grade: number
}

export const StudentContext = createContext<{
  currentStudent: LinkedStudent | null
  linkedStudents: LinkedStudent[]
  switchStudent: (id: string) => void
  setLinkedStudents: (students: LinkedStudent[]) => void
} | null>(null)

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [linkedStudents, setLinkedStudents] = useState<LinkedStudent[]>(() => {
    const cached = localStorage.getItem('linkedStudents')
    return cached ? JSON.parse(cached) : []
  })

  const [currentStudent, setCurrentStudent] = useState<LinkedStudent | null>(() => {
    const cached = localStorage.getItem('currentStudent')
    return cached ? JSON.parse(cached) : null
  })

  const switchStudent = useCallback((id: string) => {
    const student = linkedStudents.find((s) => s.id === id) || null
    setCurrentStudent(student)
    if (student) {
      localStorage.setItem('currentStudent', JSON.stringify(student))
    }
  }, [linkedStudents])

  const setAndPersistStudents = useCallback((students: LinkedStudent[]) => {
    setLinkedStudents(students)
    localStorage.setItem('linkedStudents', JSON.stringify(students))
    // 默认选第一个
    if (students.length > 0 && !currentStudent) {
      switchStudent(students[0].id)
    }
  }, [currentStudent, switchStudent])

  return (
    <StudentContext.Provider
      value={{
        currentStudent,
        linkedStudents,
        switchStudent,
        setLinkedStudents: setAndPersistStudents,
      }}
    >
      {children}
    </StudentContext.Provider>
  )
}
