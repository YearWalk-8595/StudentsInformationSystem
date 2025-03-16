import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Select, Radio, Checkbox, Space, Steps } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchAllUsers } from '../services/api';

const { Option } = Select;
const { Step } = Steps;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [userType, setUserType] = useState('学生');
  const [basicInfo, setBasicInfo] = useState(null);
  const [adminCode, setAdminCode] = useState('');
  const navigate = useNavigate();

  // 班级选项
  const classOptions = ['2315', '2609', '2911'];
  
  // 身份选项
  const identityOptions = [
    '学生',
    '语文老师',
    '数学老师',
    '英语老师',
    '物理老师',
    '历史老师',
    '化学老师',
    '生物老师',
    '政治老师',
    '地理老师',
  ];

  // 获取管理员学号作为邀请码
  useEffect(() => {
    const getAdminCode = async () => {
      try {
        const users = await fetchAllUsers();
        const admin = users.find(user => user.身份 === '管理员');
        if (admin && admin.学号) {
          setAdminCode(admin.学号.toString());
        }
      } catch (error) {
        console.error('获取管理员信息失败:', error);
      }
    };
    
    getAdminCode();
  }, []);

  // 第一步完成，进入第二步
  const onFirstStepFinish = (values) => {
    setBasicInfo(values);
    setCurrentStep(1);
  };

  // 返回第一步
  const onPrevStep = () => {
    setCurrentStep(0);
  };

  // 提交注册信息
  const onSecondStepFinish = async (values) => {
    try {
      setLoading(true);
      
      // 合并第一步和第二步的表单数据
      const formData = {
        ...basicInfo,
        ...values
      };
      
      // 如果是教师，验证邀请码
      if (formData.identity !== '学生' && formData.inviteCode !== adminCode) {
        message.error('邀请码不正确');
        setLoading(false);
        return;
      }
      
      // 处理选科组合
      let subjects = [];
      if (formData.identity === '学生') {
        // 添加物理/历史选择
        if (formData.subject1) {
          subjects.push(formData.subject1);
        }
        
        // 添加四选二的选择
        if (formData.subject2 && Array.isArray(formData.subject2)) {
          subjects = [...subjects, ...formData.subject2];
        }
      }
      
      // 准备API请求数据
      const requestData = {
        records: [
          {
            fields: {
              姓名: formData.name,
              身份: formData.identity,
              班级: formData.class,
              用户名: formData.username,
              密码: formData.password,
              学号: formData.identity === '学生' ? parseInt(formData.studentId) : null,
              性别: formData.gender,
              联系方式: formData.contact,
              选科组合: subjects
            }
          }
        ],
        fieldKey: "name"
      };
      
      // 发送注册请求
      const response = await axios.post(
        "https://api.vika.cn/fusion/v1/datasheets/dstbHtGyH3hJmu5uMX/records?viewId=viw3vH4QQaNgj&fieldKey=name",
        requestData,
        {
          headers: {
            "Authorization": "Bearer usk9XDjSa7pMirYOLlM9HCW",
            "Content-Type": "application/json"
          }
        }
      );
      
      if (response.status === 200) {
        message.success('注册成功！');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        message.error('注册失败，请稍后再试');
      }
    } catch (error) {
      console.error('注册错误:', error);
      message.error('注册过程中发生错误');
    } finally {
      setLoading(false);
    }
  };

  // 身份变更处理
  const handleIdentityChange = (value) => {
    setUserType(value);
    // 如果切换身份，清空选科组合
    if (value !== '学生') {
      form.setFieldsValue({ subject1: undefined, subject2: undefined });
    }
  };

  // 第一步：基本信息表单
  const renderFirstStep = () => (
    <Form
      name="register-basic"
      onFinish={onFirstStepFinish}
      layout="vertical"
    >
      <Form.Item
        label="用户名"
        name="username"
        rules={[
          { required: true, message: '请输入用户名!' },
          { pattern: /^[a-zA-Z0-9]+$/, message: '用户名只能包含英文字母和数字!' }
        ]}
        extra="用户名只能包含英文字母和数字"
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>

      <Form.Item
        label="密码"
        name="password"
        rules={[
          { required: true, message: '请输入密码!' },
          { pattern: /^[a-zA-Z0-9._]+$/, message: '密码只能包含英文字母、数字或者".","_"' }
        ]}
        extra="密码只能包含英文字母、数字和 . _ "
      >
        <Input.Password placeholder="请输入密码" />
      </Form.Item>

      <Form.Item
        label="确认密码"
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          { required: true, message: '请确认密码!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次输入的密码不一致!'));
            },
          }),
        ]}
      >
        <Input.Password placeholder="请确认密码" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          下一步
        </Button>
      </Form.Item>
      
      <Form.Item>
        <Button type="link" onClick={() => navigate('/login')} block>
          已有账号？去登录
        </Button>
      </Form.Item>
    </Form>
  );

  // 第二步：详细信息表单
  const renderSecondStep = () => (
    <Form
      form={form}
      name="register-detail"
      onFinish={onSecondStepFinish}
      layout="vertical"
      initialValues={{ identity: '学生' }}
    >
      <Form.Item
        label="姓名"
        name="name"
        rules={[{ required: true, message: '请输入姓名!' }]}
      >
        <Input placeholder="请输入姓名" />
      </Form.Item>

      <Form.Item
        label="身份"
        name="identity"
        rules={[{ required: true, message: '请选择身份!' }]}
      >
        <Select placeholder="请选择身份" onChange={handleIdentityChange}>
          {identityOptions.map(option => (
            <Option key={option} value={option}>{option}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="性别"
        name="gender"
        rules={[{ required: true, message: '请选择性别!' }]}
      >
        <Radio.Group>
          <Radio value="男">男</Radio>
          <Radio value="女">女</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        label="班级"
        name="class"
        rules={[{ required: true, message: '请选择班级!' }]}
      >
        <Select placeholder="请选择班级">
          {classOptions.map(option => (
            <Option key={option} value={option}>{option}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="联系方式"
        name="contact"
        rules={[
          { required: true, message: '请输入联系方式!' },
          { pattern: /^\d{11}$/, message: '请输入有效的11位手机号码!' }
        ]}
      >
        <Input placeholder="请输入联系方式" />
      </Form.Item>

      {userType === '学生' ? (
        <>
          <Form.Item
            label="学号"
            name="studentId"
            rules={[
              { required: true, message: '请输入学号!' },
              { pattern: /^\d{9}$/, message: '学号必须是9位数字!' }
            ]}
          >
            <Input placeholder="请输入9位数字学号" />
          </Form.Item>

          <Form.Item
            label="物理/历史 (二选一)"
            name="subject1"
            rules={[{ required: true, message: '请选择物理或历史!' }]}
          >
            <Radio.Group>
              <Radio value="物理">物理</Radio>
              <Radio value="历史">历史</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="选科组合 (四选二)"
            name="subject2"
            rules={[
              { required: true, message: '请选择两门科目!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || value.length === 2) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('请选择两门科目!'));
                },
              }),
            ]}
          >
            <Checkbox.Group>
              <Space direction="vertical">
                <Checkbox value="化学">化学</Checkbox>
                <Checkbox value="生物">生物</Checkbox>
                <Checkbox value="政治">政治</Checkbox>
                <Checkbox value="地理">地理</Checkbox>
              </Space>
            </Checkbox.Group>
          </Form.Item>
        </>
      ) : (
        <Form.Item
          label="邀请码"
          name="inviteCode"
          rules={[{ required: true, message: '请输入邀请码!' }]}
          extra={adminCode ? '邀请码请联系管理员提供' : '正在获取邀请码信息...'}
        >
          <Input placeholder="请输入管理员提供的邀请码" />
        </Form.Item>
      )}

      <Form.Item>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Button onClick={onPrevStep}>
            上一步
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            提交注册
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return (
    <div className="auth-container">
      <h2 className="auth-title">用户注册</h2>
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        <Step title="基本信息" />
        <Step title="详细信息" />
      </Steps>
      {currentStep === 0 ? renderFirstStep() : renderSecondStep()}
    </div>
  );
};

export default Register;