import { Card, Button, List, Avatar, Switch, Tag, message } from 'antd'
import { UserOutlined, LogoutOutlined, ApiOutlined } from '@ant-design/icons'
import { useAuth } from '../../hooks/useAuth'
import { useCurrentStudent } from '../../hooks/useCurrentStudent'
import { isMockMode, setApiMode } from '../../api'
import { useState } from 'react'

export default function ProfilePage() {
  const { auth, logout } = useAuth()
  const { linkedStudents } = useCurrentStudent()
  const [mock, setMock] = useState(isMockMode())

  const handleToggleMode = (checked: boolean) => {
    setMock(checked)
    setApiMode(checked ? 'mock' : 'real')
    message.info(`已切换为 ${checked ? 'Mock 数据' : '真实接口'} 模式`)
  }

  return (
    <div className="p-4 pb-20">
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

      {/* API 模式切换 */}
      <Card className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ApiOutlined className="text-blue-500" />
            <div>
              <div className="text-sm font-medium">API 模式</div>
              <div className="text-xs text-gray-400">
                当前: {mock ? 'Mock 数据' : '真实接口'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Tag color={mock ? 'orange' : 'green'}>{mock ? 'Mock' : 'Real'}</Tag>
            <Switch checked={mock} onChange={handleToggleMode} />
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-400 bg-gray-50 p-2 rounded">
          💡 提示：关闭 Mock 后将调用真实后端 API（需要先启动后端服务）。<br />
          也可以通过 URL 参数控制：<code>?mock=false</code>
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
      <Button danger icon={<LogoutOutlined />} block size="large" onClick={logout}>
        退出登录
      </Button>
    </div>
  )
}
