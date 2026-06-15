import { Dropdown } from 'antd'
import { DownOutlined, UserOutlined } from '@ant-design/icons'
import { useCurrentStudent } from '../../hooks/useCurrentStudent'
import type { LinkedStudent } from '../../contexts/StudentContext'

/**
 * 学生切换器 — 顶部栏，点击切换当前查看的学生
 */
export default function StudentSwitcher() {
  const { currentStudent, linkedStudents, switchStudent } = useCurrentStudent()

  if (!currentStudent) {
    return (
      <div className="flex items-center text-gray-400 text-sm">
        <UserOutlined className="mr-1" /> 未关联学生
      </div>
    )
  }

  const items = linkedStudents.map((s: LinkedStudent) => ({
    key: s.id,
    label: `${s.name} · ${s.className}`,
    onClick: () => switchStudent(s.id),
  }))

  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <div className="flex items-center cursor-pointer text-gray-700 font-medium">
        <span className="text-sm">
          {currentStudent.name} · {currentStudent.className}
        </span>
        <DownOutlined className="ml-1 text-xs text-gray-400" />
      </div>
    </Dropdown>
  )
}
