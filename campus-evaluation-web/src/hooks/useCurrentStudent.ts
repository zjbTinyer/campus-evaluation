import { useContext } from 'react'
import { StudentContext } from '../contexts/StudentContext'

export function useCurrentStudent() {
  const ctx = useContext(StudentContext)
  if (!ctx) throw new Error('useCurrentStudent must be used within StudentProvider')
  return ctx
}
