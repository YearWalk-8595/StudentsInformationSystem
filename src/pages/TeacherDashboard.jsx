import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <Result
        status="info"
        title="教师页面"
        subTitle="该功能正在开发中，敬请期待..."
        extra={
          <Button type="primary" onClick={() => navigate('/login')}>
            返回登录
          </Button>
        }
      />
    </div>
  );
};

export default TeacherDashboard;