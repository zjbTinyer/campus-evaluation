import { Form, Input, DatePicker, Button, Radio, message } from 'antd'
import { useNavigate } from 'react-router-dom'

export default function LeaveFormPage() {
  const navigate = useNavigate()

  const handleSubmit = (values: unknown) => {
    console.log('Submit leave:', values)
    message.success('请假申请已提交，请等待审批')
    navigate('/leaves')
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">提交请假申请</h2>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="leaveType" label="请假类型" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value="病假">病假</Radio>
            <Radio value="事假">事假</Radio>
            <Radio value="公假">公假</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="dateRange" label="请假日期" rules={[{ required: true }]}>
          <DatePicker.RangePicker className="w-full" />
        </Form.Item>

        <Form.Item name="reason" label="请假原因" rules={[{ required: true }]}>
          <Input.TextArea rows={4} placeholder="请详细描述请假原因" maxLength={500} showCount />
        </Form.Item>

        <Form.Item name="contactPhone" label="联系电话" rules={[{ required: true }]}>
          <Input placeholder="紧急联系电话" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block size="large">
          提交申请
        </Button>
      </Form>
    </div>
  )
}
