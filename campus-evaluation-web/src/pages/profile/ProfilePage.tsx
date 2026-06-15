import { Card, Button, List, Avatar } from 'antd'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { useAuth } from '../../hooks/useAuth'
import { useCurrentStudent } from '../../hooks/useCurrentStudent'

export default function ProfilePage() {
  const { auth, logout } = useAuth()
  const { linkedStudents } = useCurrentStudent()

  return (
    <div className="p-4">
      {/* 用户信息 */}
      <Card className="mb-4">
        <div className="flex items-center">
          <Avatar size={48} icon={<UserOutlined />} />
          <div className="ml-3">
            <div className="font-bold">{auth.phone || '未设置'}</div>
            <div className="text-xs text-gray-400">家长</div>
          </div>
        </div>
      </Card>

      {/* 关联学生 */}
      <Card title="我的孩子" className="mb-4">
        <List
          dataSource={linkedStudents}
          renderItem={(s) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar>{s.name[0]}</Avatar>}
                title={s.name}
                description={s.className}
              />
            </List.Item>
          )}
          locale={{ emptyText: '暂无关联学生' }}
        />
      </Card>

      {/* 退出登录 */}
      <Button
        danger
        icon={<LogoutOutlined />}
        block
        size="large"
        onClick={logout}
      >
        退出登录
      </Button>
    </div>
  )
}
