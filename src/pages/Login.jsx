import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { authenticateUser } from '../services/api';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { username, password } = values;
      const result = await authenticateUser(username, password);
      
      if (result.authenticated) {
        message.success('登录成功');
        const { userData } = result;
        
        // 根据身份导航到不同页面
        if (userData.身份 === '管理员') {
          navigate('/admin');
        } else if (userData.身份.includes('教师')) {
          navigate('/teacher');
        } else if (userData.身份 === '学生') {
          // 将用户数据存储在本地，以便在学生页面使用
          localStorage.setItem('studentData', JSON.stringify(userData));
          navigate('/student');
        }
      } else {
        message.error(result.message || '登录失败');
      }
    } catch (error) {
      console.error('登录错误:', error);
      message.error('登录过程中发生错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">学生管理系统</h2>
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            登录
          </Button>
        </Form.Item>
        
        <Form.Item>
          <Button type="link" onClick={() => navigate('/register')} block>
            没有账号？去注册
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;