import { useState } from 'react'
import { Form, Input, Button, message } from 'antd'
import { PhoneOutlined, LockOutlined, WechatOutlined } from '@ant-design/icons'
import { useAuth } from '../../hooks/useAuth'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handlePhoneLogin = async (values: { phone: string; password: string }) => {
    setLoading(true)
    try {
      // TODO: 调用 POST /api/v1/auth/login
      // 暂时 Mock 登录
      login('mock-jwt-token', 1, values.phone)
      message.success('登录成功')
    } catch {
      message.error('登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🏫</div>
          <h1 className="text-2xl font-bold text-gray-800">校园评价系统</h1>
          <p className="text-gray-500 text-sm mt-1">关注孩子每一步成长</p>
        </div>

        {/* 手机号登录表单 */}
        <Form onFinish={handlePhoneLogin} size="large">
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="手机号" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>

        {/* 微信登录 */}
        <div className="text-center">
          <span className="text-gray-400 text-xs">或</span>
          <Button
            icon={<WechatOutlined />}
            block
            className="mt-3 bg-green-500 text-white border-none hover:bg-green-600"
          >
            微信一键登录
          </Button>
        </div>
      </div>
    </div>
  )
}
