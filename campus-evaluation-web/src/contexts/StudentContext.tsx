import { createContext, useState, useCallback, useEffect } from 'react'
import { MOCK_STUDENTS } from '../api/mock'

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
  const [linkedStudents, setLinkedStudents] = useState<LinkedStudent[]>([])
  const [currentStudent, setCurrentStudent] = useState<LinkedStudent | null>(null)

  // 初始化 Mock 学生数据
  useEffect(() => {
    setLinkedStudents(MOCK_STUDENTS)
    if (!currentStudent && MOCK_STUDENTS.length > 0) {
      setCurrentStudent(MOCK_STUDENTS[0])
    }
  }, [])

  const switchStudent = useCallback((id: string) => {
    const student = linkedStudents.find((s) => s.id === id) || null
    setCurrentStudent(student)
  }, [linkedStudents])

  const setAndPersistStudents = useCallback((students: LinkedStudent[]) => {
    setLinkedStudents(students)
    if (students.length > 0 && !currentStudent) {
      setCurrentStudent(students[0])
    }
  }, [currentStudent])

  return (
    <StudentContext.Provider
      value={{ currentStudent, linkedStudents, switchStudent, setLinkedStudents: setAndPersistStudents }}
    >
      {children}
    </StudentContext.Provider>
  )
}
