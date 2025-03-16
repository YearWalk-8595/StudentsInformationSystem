import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Descriptions, Tag, Statistic, Divider, Button, message, Menu, Result, Tooltip, Table, Select, Empty, Checkbox, Space, Form, Input, InputNumber } from 'antd';
import { TrophyOutlined, LogoutOutlined, UserOutlined, BookOutlined, WalletOutlined, ShoppingOutlined, LockOutlined, StarOutlined, CrownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Line } from '@ant-design/charts';
import PointsShop from '../components/PointsShop';

const { Title, Text } = Typography;
const { Option } = Select;

// 成就等级映射
const achievementLevels = {
  '无': { className: 'achievement-none', label: '未解锁', icon: <LockOutlined /> },
  '初级': { className: 'achievement-basic', label: '初级', icon: '🥉' },
  '中级': { className: 'achievement-intermediate', label: '中级', icon: '🥈' },
  '高级': { className: 'achievement-advanced', label: '高级', icon: '🥇' },
  '大师': { className: 'achievement-master', label: '大师', icon: '🌟' },
  '至尊': { className: 'achievement-supreme', label: '至尊', icon: '👑' }
};

// 成就获取条件
const achievementRequirements = {
  '学习达人': {
    '初级': '累计2次考试及格',
    '中级': '累计5次考试及格',
    '高级': '累计10次考试及格',
    '大师': '累计20次考试及格',
    '至尊': '累计35次考试及格'
  },
  '积分之王': {
    '初级': '最近一个月积分排名前10',
    '中级': '最近一个月积分排名前5',
    '高级': '最近一个月积分排名前3',
    '大师': '最近一个月积分排名第一',
    '至尊': '上一学期积分排名保持第一'
  },
  '进步之星': {
    '初级': '最近考试班级进步1名',
    '中级': '最近考试班级进步2名',
    '高级': '最近考试班级进步3名',
    '大师': '最近考试进步超过4名',
    '至尊': '连续保持两次无可进步'
  },
  '不拖后腿': {
    '初级': '累计2次考试得分高于均分',
    '中级': '累计5次考试得分高于均分',
    '高级': '累计10次考试得分高于均分',
    '大师': '累计20次考试得分高于均分',
    '至尊': '累计35次考试得分高于均分'
  },
  '勤奋学子': {
    '初级': '累计2次考试60分以上',
    '中级': '累计5次考试60分以上',
    '高级': '累计10次考试60分以上',
    '大师': '累计20次考试60分以上',
    '至尊': '累计35次考试60分以上'
  },
  '知识探索者': {
    '初级': '累计1次考试120分以上',
    '中级': '累计2次考试120分以上',
    '高级': '累计3次考试120分以上',
    '大师': '累计5次考试120分以上',
    '至尊': '累计10次考试120分以上'
  },
  '全勤达人': {
    '初级': '累计完成5次作业',
    '中级': '累计完成12次作业',
    '高级': '累计完成25次作业',
    '大师': '累计完成50次作业',
    '至尊': '累计完成80次作业'
  },
  '白金奖牌': {
    '初级': '累计1次考试排名班级第一',
    '中级': '累计2次考试排名班级第一',
    '高级': '累计3次考试排名班级第一',
    '大师': '最近3次考试排名班级第一',
    '至尊': '上一学期考试均为班级第一'
  },
  '语文的荣耀': {
    '初级': '拿过1次语文年级第一',
    '中级': '拿过2次语文年级第一',
    '高级': '拿过3次语文年级第一',
    '大师': '拿过5次语文年级第一',
    '至尊': '拿过10次语文年级第一'
  },
  '数学的荣耀': {
    '初级': '拿过1次数学年级第一',
    '中级': '拿过2次数学年级第一',
    '高级': '拿过3次数学年级第一',
    '大师': '拿过5次数学年级第一',
    '至尊': '拿过10次数学年级第一'
  },
  '英语的荣耀': {
    '初级': '拿过1次英语年级第一',
    '中级': '拿过2次英语年级第一',
    '高级': '拿过3次英语年级第一',
    '大师': '拿过5次英语年级第一',
    '至尊': '拿过10次英语年级第一'
  },
  '物理的荣耀': {
    '初级': '拿过1次物理年级第一',
    '中级': '拿过2次物理年级第一',
    '高级': '拿过3次物理年级第一',
    '大师': '拿过5次物理年级第一',
    '至尊': '拿过10次物理年级第一'
  },
  '化学的荣耀': {
    '初级': '拿过1次化学年级第一',
    '中级': '拿过2次化学年级第一',
    '高级': '拿过3次化学年级第一',
    '大师': '拿过5次化学年级第一',
    '至尊': '拿过10次化学年级第一'
  },
  '生物的荣耀': {
    '初级': '拿过1次生物年级第一',
    '中级': '拿过2次生物年级第一',
    '高级': '拿过3次生物年级第一',
    '大师': '拿过5次生物年级第一',
    '至尊': '拿过10次生物年级第一'
  },
  '历史的荣耀': {
    '初级': '拿过1次历史年级第一',
    '中级': '拿过2次历史年级第一',
    '高级': '拿过3次历史年级第一',
    '大师': '拿过5次历史年级第一',
    '至尊': '拿过10次历史年级第一'
  },
  '政治的荣耀': {
    '初级': '拿过1次政治年级第一',
    '中级': '拿过2次政治年级第一',
    '高级': '拿过3次政治年级第一',
    '大师': '拿过5次政治年级第一',
    '至尊': '拿过10次政治年级第一'
  },
  '地理的荣耀': {
    '初级': '拿过1次地理年级第一',
    '中级': '拿过2次地理年级第一',
    '高级': '拿过3次地理年级第一',
    '大师': '拿过5次地理年级第一',
    '至尊': '拿过10次地理年级第一'
  }
};

// 成就项目列表 - 重新组织为学科成就和特殊成就两类
const subjectAchievements = [
  { key: '语文的荣耀', title: '语文的荣耀', icon: <TrophyOutlined />, subject: '语文' },
  { key: '数学的荣耀', title: '数学的荣耀', icon: <TrophyOutlined />, subject: '数学' },
  { key: '英语的荣耀', title: '英语的荣耀', icon: <TrophyOutlined />, subject: '英语' },
  { key: '物理的荣耀', title: '物理的荣耀', icon: <TrophyOutlined />, subject: '物理' },
  { key: '化学的荣耀', title: '化学的荣耀', icon: <TrophyOutlined />, subject: '化学' },
  { key: '生物的荣耀', title: '生物的荣耀', icon: <TrophyOutlined />, subject: '生物' },
  { key: '政治的荣耀', title: '政治的荣耀', icon: <TrophyOutlined />, subject: '政治' },
  { key: '历史的荣耀', title: '历史的荣耀', icon: <TrophyOutlined />, subject: '历史' },
  { key: '地理的荣耀', title: '地理的荣耀', icon: <TrophyOutlined />, subject: '地理' }
];

const specialAchievements = [
  { key: '全勤达人', title: '全勤达人', icon: <TrophyOutlined /> },
  { key: '进步之星', title: '进步之星', icon: <TrophyOutlined /> },
  { key: '白金奖牌', title: '白金奖牌', icon: <TrophyOutlined /> },
  { key: '积分之王', title: '积分之王', icon: <TrophyOutlined /> },
  { key: '学习达人', title: '学习达人', icon: <TrophyOutlined /> },
  { key: '勤奋学子', title: '勤奋学子', icon: <TrophyOutlined /> },
  { key: '知识探索者', title: '知识探索者', icon: <TrophyOutlined /> },
  { key: '不拖后腿', title: '不拖后腿', icon: <TrophyOutlined /> }
];

// 生成成就等级获取条件的提示内容
const generateTooltipContent = (achievementKey, currentLevel) => {
  const requirements = achievementRequirements[achievementKey];
  if (!requirements) return null;
  
  // 构建所有等级的获取条件
  return (
    <div>
      <div><strong>获取条件：</strong></div>
      <div>初级：{requirements['初级']}</div>
      <div>中级：{requirements['中级']}</div>
      <div>高级：{requirements['高级']}</div>
      <div>大师：{requirements['大师']}</div>
      <div>至尊：{requirements['至尊']}</div>
    </div>
  );
};

// 个人中心内容组件
const ProfileContent = ({ studentData }) => {
  // 根据学生选科组合过滤学科成就
  const filteredSubjectAchievements = subjectAchievements.filter(item => {
    // 语数外是必修科目，始终显示
    if (['语文', '数学', '英语'].includes(item.subject)) {
      return true;
    }
    // 其他科目根据选科组合显示
    return studentData.选科组合 && studentData.选科组合.includes(item.subject);
  });

  // 渲染成就卡片
  const renderAchievementCard = (item) => {
    // 处理成就数据，兼容字符串和数组两种格式
    let achievementLevel = '无';
    if (studentData[item.key]) {
      // 如果是数组，取第一个元素；如果是字符串，直接使用
      achievementLevel = Array.isArray(studentData[item.key]) 
        ? studentData[item.key][0] 
        : studentData[item.key];
    }
    
    const { className, label } = achievementLevels[achievementLevel] || achievementLevels['无'];
    const tooltipContent = generateTooltipContent(item.key, achievementLevel);
    
    // 定义光晕和特效样式
    const getHaloStyle = (level) => {
      // 基础光晕效果 - 所有级别都有
      const baseHalo = {
        position: 'relative',
        overflow: 'visible'
      };
      
      // 根据级别返回不同的光晕效果
      switch(level) {
        case '初级':
          return {
            ...baseHalo,
            boxShadow: '0 0 10px 2px rgba(82, 196, 26, 0.3)'
          };
        case '中级':
          return {
            ...baseHalo,
            boxShadow: '0 0 12px 3px rgba(24, 144, 255, 0.4)'
          };
        case '高级':
          return {
            ...baseHalo,
            boxShadow: '0 0 15px 4px rgba(170, 85, 236, 0.5)'
          };
        case '大师':
          return {
            ...baseHalo,
            boxShadow: '0 0 25px 10px rgba(250, 173, 20, 0.8)',
            animation: 'pulse 2s infinite',
            position: 'relative'
          };
        case '至尊':
          return {
            ...baseHalo,
            boxShadow: '0 0 35px 15px rgba(255, 0, 0, 0.8), 0 0 50px 25px rgba(255, 215, 0, 0.5)',
            animation: 'supremeShine 3s infinite',
            position: 'relative',
            background: 'linear-gradient(45deg, rgba(255,215,0,0.2), rgba(255,0,0,0.2), rgba(255,215,0,0.2))',
            backgroundSize: '200% 200%',
            animationName: 'supremeShine, bgShine',
            animationDuration: '3s, 5s',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out',
            border: '2px solid transparent',
            borderImage: 'linear-gradient(45deg, gold, crimson, gold) 1',
            borderImageSlice: 1
          };
        default:
          return {};
      }
    };
    
    // 定义图标特效样式
    const getIconStyle = (level) => {
      const baseStyle = {
        transition: 'all 0.3s'
      };
      
      switch(level) {
        case '大师':
          return {
            ...baseStyle,
            transform: 'scale(1.2)',
            filter: 'drop-shadow(0 0 8px gold)',
            animation: 'iconPulse 2s infinite',
            position: 'relative'
          };
        case '至尊':
          return {
            ...baseStyle,
            transform: 'scale(1.4)',
            filter: 'drop-shadow(0 0 15px gold) drop-shadow(0 0 5px crimson)',
            animation: 'supremeIconPulse 2s infinite',
            position: 'relative'
          };
        default:
          return baseStyle;
      }
    };
    
    // 创建CSS动画的style标签
    const animationStyle = (level) => {
      if (level === '大师' || level === '至尊') {
        return (
          <style jsx>{`
            @keyframes pulse {
              0% { box-shadow: 0 0 20px 6px rgba(250, 173, 20, 0.6); }
              50% { box-shadow: 0 0 30px 8px rgba(250, 173, 20, 0.8); }
              100% { box-shadow: 0 0 20px 6px rgba(250, 173, 20, 0.6); }
            }
            
            @keyframes shine {
              0% { box-shadow: 0 0 25px 8px rgba(245, 34, 45, 0.7); }
              25% { box-shadow: 0 0 35px 10px rgba(245, 34, 45, 0.9); }
              50% { box-shadow: 0 0 25px 8px rgba(250, 140, 22, 0.8); }
              75% { box-shadow: 0 0 35px 10px rgba(250, 140, 22, 1); }
              100% { box-shadow: 0 0 25px 8px rgba(245, 34, 45, 0.7); }
            }
            
            @keyframes supremeShine {
              0% { box-shadow: 0 0 35px 15px rgba(255, 0, 0, 0.8), 0 0 50px 25px rgba(255, 215, 0, 0.5); }
              25% { box-shadow: 0 0 45px 20px rgba(255, 0, 0, 0.9), 0 0 60px 30px rgba(255, 215, 0, 0.6); }
              50% { box-shadow: 0 0 35px 15px rgba(255, 215, 0, 0.8), 0 0 50px 25px rgba(255, 0, 0, 0.5); }
              75% { box-shadow: 0 0 45px 20px rgba(255, 215, 0, 0.9), 0 0 60px 30px rgba(255, 0, 0, 0.6); }
              100% { box-shadow: 0 0 35px 15px rgba(255, 0, 0, 0.8), 0 0 50px 25px rgba(255, 215, 0, 0.5); }
            }
            
            @keyframes bgShine {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            
            @keyframes iconPulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.2); }
              100% { transform: scale(1); }
            }
            
            @keyframes supremeIconPulse {
              0% { transform: scale(1.2); filter: drop-shadow(0 0 15px gold) drop-shadow(0 0 5px crimson); }
              50% { transform: scale(1.5); filter: drop-shadow(0 0 20px gold) drop-shadow(0 0 10px crimson); }
              100% { transform: scale(1.2); filter: drop-shadow(0 0 15px gold) drop-shadow(0 0 5px crimson); }
            }
            
            @keyframes floatingOrb {
              0% { opacity: 0; transform: translate(-10px, 0px) scale(0.8); }
              25% { opacity: 0.7; }
              50% { transform: translate(10px, -20px) scale(1.2); }
              75% { opacity: 0.3; }
              100% { opacity: 0; transform: translate(30px, -10px) scale(0.8); }
            }
            
            @keyframes supremeFloatingOrb {
              0% { opacity: 0; transform: translate(-30px, 0px) scale(0.8); }
              20% { opacity: 0.9; transform: translate(10px, -50px) scale(1.3); }
              40% { opacity: 0.7; transform: translate(50px, -20px) scale(1.1); }
              60% { opacity: 0.8; transform: translate(30px, 30px) scale(1.4); }
              80% { opacity: 0.9; transform: translate(-20px, 40px) scale(1.2); }
              100% { opacity: 0; transform: translate(-30px, 0px) scale(0.8); }
            }
            
            @keyframes stageLight {
              0% { opacity: 0; transform: translate(-30px, -30px) scale(0.2); }
              25% { opacity: 0.8; transform: translate(30px, -10px) scale(0.5); }
              50% { opacity: 0.2; transform: translate(10px, 30px) scale(0.3); }
              75% { opacity: 0.6; transform: translate(-20px, 10px) scale(0.4); }
              100% { opacity: 0; transform: translate(-30px, -30px) scale(0.2); }
            }
            
            @keyframes supremeStageLight {
              0% { opacity: 0; transform: translate(-40px, -40px) scale(0.2); }
              25% { opacity: 0.9; transform: translate(40px, -15px) scale(0.7); }
              50% { opacity: 0.3; transform: translate(15px, 40px) scale(0.5); }
              75% { opacity: 0.8; transform: translate(-30px, 15px) scale(0.6); }
              100% { opacity: 0; transform: translate(-40px, -40px) scale(0.2); }
            }
            
            @keyframes rotateHalo {
              0% { transform: translate(-50%, -50%) rotate(0deg); }
              100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
            
            @keyframes sparkle {
              0%, 100% { opacity: 0; transform: scale(0.5); }
              50% { opacity: 1; transform: scale(1.2); }
            }
          `}</style>
        );
      }
      return null;
    };
    
    // 荧光球效果组件
    const FloatingOrbs = ({ level }) => {
      if (level === '大师' || level === '至尊') {
        const orbCount = level === '大师' ? 3 : 12;
        const orbs = [];
        
        if (level === '至尊') {
          // 为至尊级别创建均匀分布的荧光球
          for (let i = 0; i < orbCount; i++) {
            // 计算均匀分布的角度
            const angle = (i / orbCount) * 2 * Math.PI;
            // 设置不同的初始位置，基于角度计算
            const initialX = Math.cos(angle) * 30;
            const initialY = Math.sin(angle) * 30;
            
            // 为每个荧光球设置不同的动画参数
            const delay = `${i * 0.5}s`;
            const duration = `${4 + (i % 3)}s`;
            const size = `${8 + (i % 5)}px`;
            
            // 根据位置设置不同的颜色
            const colorIndex = i % 3;
            const color = colorIndex === 0 ? 'rgba(255, 215, 0, 0.8)' : 
                        colorIndex === 1 ? 'rgba(255, 0, 0, 0.8)' : 'rgba(255, 140, 0, 0.8)';
            
            // 创建自定义动画名称和关键帧
            const animationName = `supremeFloatingOrb${i}`;
            
            // 添加自定义动画样式
            const customAnimationStyle = (
              <style key={`orb-style-${i}`}>
                {`
                  @keyframes ${animationName} {
                    0% { opacity: 0; transform: translate(${initialX}px, ${initialY}px) scale(0.8); }
                    20% { opacity: 0.9; transform: translate(${initialX + 20}px, ${initialY - 30}px) scale(1.2); }
                    40% { opacity: 0.7; transform: translate(${initialX + 40}px, ${initialY - 10}px) scale(1.0); }
                    60% { opacity: 0.8; transform: translate(${initialX + 20}px, ${initialY + 20}px) scale(1.3); }
                    80% { opacity: 0.9; transform: translate(${initialX - 10}px, ${initialY + 30}px) scale(1.1); }
                    100% { opacity: 0; transform: translate(${initialX}px, ${initialY}px) scale(0.8); }
                  }
                `}
              </style>
            );
            
            orbs.push(customAnimationStyle);
            
            orbs.push(
              <div
                key={`orb-${i}`}
                style={{
                  position: 'absolute',
                  width: size,
                  height: size,
                  borderRadius: '50%',
                  backgroundColor: color,
                  filter: 'blur(3px) brightness(1.5)',
                  top: '50%',
                  left: '50%',
                  zIndex: 10,
                  animation: `${animationName} ${duration} infinite`,
                  animationDelay: delay,
                  opacity: 0
                }}
              />
            );
          }
        } else {
          // 保持大师级别的原有实现
          for (let i = 0; i < orbCount; i++) {
            const delay = `${i * 0.5}s`;
            const color = 'rgba(250, 173, 20, 0.8)';
            const size = '10px';
            
            orbs.push(
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: size,
                  height: size,
                  borderRadius: '50%',
                  backgroundColor: color,
                  filter: 'blur(2px) brightness(1.5)',
                  top: '50%',
                  left: '50%',
                  zIndex: 10,
                  animation: 'floatingOrb 4s infinite',
                  animationDelay: delay,
                  opacity: 0
                }}
              />
            );
          }
        }
        
        return <>{orbs}</>;
      }
      
      return null;
    };
    
    // 舞台灯光效果组件 - 仅用于至尊级别
    const StageLights = ({ level }) => {
      if (level === '至尊') {
        const lights = [];
        const colors = ['rgba(255,215,0,0.6)', 'rgba(255,0,0,0.6)', 'rgba(0,255,255,0.6)', 'rgba(255,0,255,0.6)', 'rgba(255,255,0,0.6)', 'rgba(255,128,0,0.6)'];
        
        for (let i = 0; i < 6; i++) {
          const delay = `${i * 1}s`;
          
          lights.push(
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: colors[i],
                filter: 'blur(20px)',
                top: '50%',
                left: '50%',
                zIndex: 5,
                animation: `supremeStageLight 8s infinite`,
                animationDelay: delay,
                opacity: 0
              }}
            />
          );
        }
        
        return <>{lights}</>;
      }
      
      return null;
    };
    
    // 至尊级别特有的光环效果
    const SupremeHalo = ({ level }) => {
      if (level === '至尊') {
        return (
          <div
            style={{
              position: 'absolute',
              width: '150%',
              height: '150%',
              top: '50%',
              left: '50%',
              borderRadius: '50%',
              border: '2px solid rgba(255, 215, 0, 0.7)',
              boxShadow: '0 0 15px 5px rgba(255, 215, 0, 0.5)',
              zIndex: 4,
              animation: 'rotateHalo 10s linear infinite',
              pointerEvents: 'none'
            }}
          />
        );
      }
      return null;
    };
    
    // 至尊级别特有的闪烁星星效果
    const SupremeSparkles = ({ level }) => {
      if (level === '至尊') {
        const sparkles = [];
        const positions = [
          { top: '10%', left: '20%' },
          { top: '15%', left: '80%' },
          { top: '80%', left: '15%' },
          { top: '75%', left: '85%' },
          { top: '50%', left: '10%' },
          { top: '50%', left: '90%' },
        ];
        
        for (let i = 0; i < positions.length; i++) {
          const delay = `${i * 0.3}s`;
          const duration = `${0.8 + Math.random() * 0.6}s`;
          
          sparkles.push(
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '15px',
                height: '15px',
                top: positions[i].top,
                left: positions[i].left,
                color: 'gold',
                fontSize: '15px',
                zIndex: 15,
                animation: `sparkle ${duration} infinite`,
                animationDelay: delay,
                opacity: 0
              }}
            >
              ✨
            </div>
          );
        }
        
        return <>{sparkles}</>;
      }
      return null;
    };
    
    return (
      <Tooltip 
        key={item.key}
        title={tooltipContent}
        color="#108ee9"
        placement="top"
      >
        {animationStyle(achievementLevel)}
        <Card 
          className={`achievement-card ${className}`}
          hoverable
          style={{
            backgroundColor: achievementLevel === '无' ? '#f5f5f5' : 
                         achievementLevel === '初级' ? '#f6ffed' : 
                         achievementLevel === '中级' ? '#e6f7ff' : 
                         achievementLevel === '高级' ? '#f0f2ff' : 
                         achievementLevel === '大师' ? '#fff7e6' : 
                         achievementLevel === '至尊' ? '#fff1f0' : '',
            ...getHaloStyle(achievementLevel),
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <FloatingOrbs level={achievementLevel} />
          <StageLights level={achievementLevel} />
          <SupremeHalo level={achievementLevel} />
          <SupremeSparkles level={achievementLevel} />
          <div 
            className={`achievement-icon ${className}`}
            style={getIconStyle(achievementLevel)}
          >
            {achievementLevels[achievementLevel].icon}
          </div>
          <div className="achievement-title">{item.title}</div>
          <div className="achievement-level">{achievementLevels[achievementLevel].label}</div>
        </Card>
      </Tooltip>
    );
  };

  return (
    <>
      <Card className="dashboard student-info">
        <Descriptions title="基本信息" bordered>
          <Descriptions.Item label="姓名">{studentData.姓名}</Descriptions.Item>
          <Descriptions.Item label="学号">{studentData.学号}</Descriptions.Item>
          <Descriptions.Item label="性别">{studentData.性别}</Descriptions.Item>
          <Descriptions.Item label="班级">{studentData.班级}</Descriptions.Item>
          <Descriptions.Item label="联系方式" span={2}>
            {studentData['联系方式']}
          </Descriptions.Item>
          <Descriptions.Item label="出生日期">
            {studentData['出生日期'] ? formatDate(studentData['出生日期']) : ''}
          </Descriptions.Item>
          <Descriptions.Item label="星座" span={2}>
            {studentData['出生日期'] ? getZodiacSign(studentData['出生日期']) : ''}
          </Descriptions.Item>
          <Descriptions.Item label="选科组合">
            {studentData.选科组合 && [...studentData.选科组合].sort((a, b) => {
              // 排序逻辑：物理最前，其次是历史，然后是其他科目
              if (a === '物理') return -1;
              if (b === '物理') return 1;
              if (a === '历史') return -1;
              if (b === '历史') return 1;
              return 0;
            }).map((subject, index) => {
              // 为物理和历史设置不同的颜色
              if (subject === '物理') {
                return <Tag color="red" key={index}>{subject}</Tag>;
              } else if (subject === '历史') {
                return <Tag color="purple" key={index}>{subject}</Tag>;
              } else {
                return <Tag color="blue" key={index}>{subject}</Tag>;
              }
            })}
          </Descriptions.Item>
          <Descriptions.Item label="座右铭" span={2}>
            {studentData['座右铭']}
          </Descriptions.Item>
        </Descriptions>

        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col span={12}>
            <Statistic 
              title="当前积分" 
              value={studentData.当前积分} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={12}>
            <Statistic 
              title="历史积分" 
              value={studentData.历史积分} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
        </Row>
      </Card>

      <div className="achievement-section">
        <Title level={3}>成就系统</Title>
        <Text type="secondary">展示你在各个领域的成就等级</Text>
        
        <Divider />
        
        {/* 学科成就部分 */}
        <div style={{ marginBottom: 24 }}>
          <Title level={4}>学科成就</Title>
          <div className="achievement-grid">
            {filteredSubjectAchievements.map(renderAchievementCard)}
          </div>
        </div>
        
        {/* 特殊成就部分 */}
        <div>
          <Title level={4}>特殊成就</Title>
          <div className="achievement-grid">
            {specialAchievements.map(renderAchievementCard)}
          </div>
        </div>
      </div>
    </>
  );
};

// 成绩查询内容组件
const GradesContent = ({ studentData }) => {
  const [examList, setExamList] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [semester, setSemester] = useState('all'); // 默认显示所有学期
  const [showAverage, setShowAverage] = useState(true); // 是否显示平均分
  const [showHighest, setShowHighest] = useState(true); // 是否显示最高分
  const [showLowest, setShowLowest] = useState(true); // 是否显示最低分
  
  // 添加各类分数线的状态变量
  const [showSpecialLine, setShowSpecialLine] = useState(false); // 专科线
  const [showRegularLine, setShowRegularLine] = useState(false); // 本科线
  const [showTier1Line, setShowTier1Line] = useState(false); // 一本线
  const [showHighQualityLine, setShowHighQualityLine] = useState(false); // 高优线
  const [showDoubleFirstClassLine, setShowDoubleFirstClassLine] = useState(false); // 双一流线
  const [showSuperFirstClassLine, setShowSuperFirstClassLine] = useState(false); // 超一流线
  
  // 学期选项
  const semesterOptions = [
    { value: 'all', label: '全部学期' },
    { value: '高一上学期', label: '高一上学期' },
    { value: '高一下学期', label: '高一下学期' },
    { value: '高二上学期', label: '高二上学期' },
    { value: '高二下学期', label: '高二下学期' },
    { value: '高三上学期', label: '高三上学期' },
    { value: '高三下学期', label: '高三下学期' }
  ];

  // 获取考试信息
  const fetchExamInfo = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://api.vika.cn/fusion/v1/datasheets/dstSfR82qaef654Rec/records?viewId=viwKok54z5NV9&fieldKey=name",
        {
          headers: {
            Authorization: "Bearer usk9XDjSa7pMirYOLlM9HCW"
          }
        }
      );
      
      if (response.data && response.data.success) {
        // 按日期从早到晚排序（为了折线图展示）
        const sortedExams = response.data.data.records
          .filter(record => record.fields.test_ID) // 确保有test_ID
          .sort((a, b) => {
            // 如果有考试日期，按日期排序；否则按test_ID排序
            if (a.fields.考试日期 && b.fields.考试日期) {
              return a.fields.考试日期 - b.fields.考试日期;
            }
            return a.fields.test_ID - b.fields.test_ID;
          });
        
        setExamList(sortedExams);
        // 获取成绩数据
        fetchGrades();
      }
    } catch (error) {
      console.error("获取考试信息失败:", error);
      message.error("获取考试信息失败");
    } finally {
      setLoading(false);
    }
  };

  // 获取成绩数据
  const fetchGrades = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://api.vika.cn/fusion/v1/datasheets/dst3cXWBko0CPSnaq9/records?viewId=viwqiBNaZedWB&fieldKey=name",
        {
          headers: {
            Authorization: "Bearer usk9XDjSa7pMirYOLlM9HCW"
          }
        }
      );
      
      if (response.data && response.data.success) {
        // 只获取当前学生的成绩
        const studentGrades = response.data.data.records.filter(
          record => record.fields.姓名 === studentData.姓名
        );
        setGrades(studentGrades);
      }
    } catch (error) {
      console.error("获取成绩数据失败:", error);
      message.error("获取成绩数据失败");
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载数据
  useEffect(() => {
    fetchExamInfo();
  }, []);

  // 处理学期筛选变化
  const handleSemesterChange = (value) => {
    setSemester(value);
  };

  // 根据学期筛选考试
  const filteredExams = semester === 'all' 
    ? examList 
    : examList.filter(exam => exam.fields.学期 === semester);

  // 格式化日期
  const formatDate = (timestamp) => {
    if (!timestamp) return '未设置';
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // 获取考试成绩
  const getExamGrade = (testId) => {
    const gradeRecord = grades.find(grade => grade.fields.test_ID === testId);
    return gradeRecord ? gradeRecord.fields : null;
  };

  // 表格列定义
  const columns = [
    {
      title: '考试名称',
      dataIndex: ['fields', '考试名称'],
      key: '考试名称',
      render: (text, record) => (
        <Tooltip 
          title={record.fields.考试范围 ? (
            <div>
              <div><strong>考试范围：</strong></div>
              <div>{record.fields.考试范围}</div>
            </div>
          ) : '暂无考试范围信息'}
          color="#108ee9"
          placement="right"
        >
          <span>{text || `考试${record.fields.test_ID}`}</span>
        </Tooltip>
      )
    },
    {
      title: '学期',
      dataIndex: ['fields', '学期'],
      key: '学期',
    },
    {
      title: '考试日期',
      dataIndex: ['fields', '考试日期'],
      key: '考试日期',
      render: (date) => formatDate(date)
    },
    {
      title: '考试类型',
      dataIndex: ['fields', '考试类型'],
      key: '考试类型',
    },
    {
      title: '我的分数',
      key: '分数',
      render: (_, record) => {
        const grade = getExamGrade(record.fields.test_ID);
        return grade ? grade.分数 : '暂无成绩';
      }
    },
    {
      title: '班级排名',
      key: '班级排名',
      render: (_, record) => {
        const grade = getExamGrade(record.fields.test_ID);
        return grade && grade.班级排名 ? grade.班级排名 : '暂无';
      }
    },
    {
      title: '校级排名',
      key: '校级排名',
      render: (_, record) => {
        const grade = getExamGrade(record.fields.test_ID);
        return grade && grade.校级排名 ? grade.校级排名 : '暂无';
      }
    },
    {
      title: '联考排名',
      key: '联考排名',
      render: (_, record) => {
        const grade = getExamGrade(record.fields.test_ID);
        return grade && grade.联考排名 ? grade.联考排名 : '暂无';
      }
    }
  ];

  // 准备折线图数据
  // 准备折线图数据
  const prepareChartData = () => {
    const chartData = [];
    
    // 按时间排序的考试列表
    filteredExams.forEach(exam => {
      const testId = exam.fields.test_ID;
      const examName = exam.fields.考试名称 || `考试${testId}`;
      const grade = getExamGrade(testId);
      
      if (grade) {
        // 添加学生自己的分数
        chartData.push({
          考试: examName,
          分数: grade.分数 || 0,
          类型: '我的分数'
        });
        
        // 添加平均分 - 优先使用考试信息API返回的平均分，如果没有则使用成绩记录中的平均分
        if (showAverage) {
          const avgScore = exam.fields.平均分 || grade.平均分 || 0;
          chartData.push({
            考试: examName,
            分数: avgScore,
            类型: '平均分'
          });
        }
        
        // 添加最高分 - 优先使用考试信息API返回的最高分，如果没有则使用成绩记录中的最高分
        if (showHighest) {
          const highestScore = exam.fields.最高分 || grade.最高分 || 0;
          chartData.push({
            考试: examName,
            分数: highestScore,
            类型: '最高分'
          });
        }
        
        // 添加最低分 - 优先使用考试信息API返回的最低分，如果没有则使用成绩记录中的最低分
        if (showLowest) {
          const lowestScore = exam.fields.最低分 || grade.最低分 || 0;
          chartData.push({
            考试: examName,
            分数: lowestScore,
            类型: '最低分'
          });
        }
        
        // 添加各类分数线 - 直接使用考试信息API返回的数据
        if (showSpecialLine && exam.fields.专科线) {
          chartData.push({
            考试: examName,
            分数: exam.fields.专科线,
            类型: '专科线'
          });
        }
        
        if (showRegularLine && exam.fields.本科线) {
          chartData.push({
            考试: examName,
            分数: exam.fields.本科线,
            类型: '本科线'
          });
        }
        
        if (showTier1Line && exam.fields.一本线) {
          chartData.push({
            考试: examName,
            分数: exam.fields.一本线,
            类型: '一本线'
          });
        }
        
        if (showHighQualityLine && exam.fields.高优线) {
          chartData.push({
            考试: examName,
            分数: exam.fields.高优线,
            类型: '高优线'
          });
        }
        
        if (showDoubleFirstClassLine && exam.fields.双一流线) {
          chartData.push({
            考试: examName,
            分数: exam.fields.双一流线,
            类型: '双一流线'
          });
        }
        
        if (showSuperFirstClassLine && exam.fields.超一流线) {
          chartData.push({
            考试: examName,
            分数: exam.fields.超一流线,
            类型: '超一流线'
          });
        }
      }
    });
    
    return chartData;
  };

  // 折线图配置
  // 折线图配置
  const lineConfig = {
    data: prepareChartData(),
    xField: '考试',
    yField: '分数',
    seriesField: '类型',
    yAxis: {
      max: 150, // 固定Y轴最大值为150
      min: 0,
    },
    legend: {
      position: 'top',
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    point: {
      size: 5,
      shape: 'circle',
      style: {
        fill: 'white',
        stroke: '#5B8FF9',
        lineWidth: 2,
      },
    },
    tooltip: {
      showMarkers: false,
      formatter: (datum) => {
        // 确保分数值是数字并且正确显示
        const score = typeof datum.分数 === 'number' ? datum.分数 : parseFloat(datum.分数);
        return { name: datum.类型, value: isNaN(score) ? '暂无数据' : score.toFixed(1) };
      }
    },
    interactions: [
      {
        type: 'marker-active',
      },
    ],
  };

  return (
    <>
      <Card className="dashboard grades-query">
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4}>成绩查询</Title>
          <Select 
            style={{ width: 150 }} 
            value={semester} 
            onChange={handleSemesterChange}
            placeholder="选择学期"
          >
            {semesterOptions.map(option => (
              <Option key={option.value} value={option.value}>{option.label}</Option>
            ))}
          </Select>
        </div>
        
        {filteredExams.length > 0 ? (
          <Table 
            dataSource={filteredExams} 
            columns={columns} 
            rowKey={record => record.recordId}
            loading={loading}
            pagination={{ pageSize: 5 }}
          />
        ) : (
          <Empty description="暂无考试数据" />
        )}
      </Card>
      
      {/* 成绩变化折线图 */}
      {filteredExams.length > 0 && (
        <Card className="dashboard grades-chart" style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={4}>成绩变化趋势</Title>
              <div>
                <div style={{ marginBottom: 8 }}>
                  <Space>
                    <Checkbox checked={showAverage} onChange={(e) => setShowAverage(e.target.checked)}>平均分</Checkbox>
                    <Checkbox checked={showHighest} onChange={(e) => setShowHighest(e.target.checked)}>最高分</Checkbox>
                    <Checkbox checked={showLowest} onChange={(e) => setShowLowest(e.target.checked)}>最低分</Checkbox>
                  </Space>
                </div>
                <div>
                  <Space>
                    <Checkbox checked={showSpecialLine} onChange={(e) => setShowSpecialLine(e.target.checked)}>专科线</Checkbox>
                    <Checkbox checked={showRegularLine} onChange={(e) => setShowRegularLine(e.target.checked)}>本科线</Checkbox>
                    <Checkbox checked={showTier1Line} onChange={(e) => setShowTier1Line(e.target.checked)}>一本线</Checkbox>
                    <Checkbox checked={showHighQualityLine} onChange={(e) => setShowHighQualityLine(e.target.checked)}>高优线</Checkbox>
                    <Checkbox checked={showDoubleFirstClassLine} onChange={(e) => setShowDoubleFirstClassLine(e.target.checked)}>双一流线</Checkbox>
                    <Checkbox checked={showSuperFirstClassLine} onChange={(e) => setShowSuperFirstClassLine(e.target.checked)}>超一流线</Checkbox>
                  </Space>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ height: 400 }}>
            <Line {...lineConfig} />
          </div>
        </Card>
      )}
    </>
  );
};

// 开发中提示组件
const DevelopingContent = ({ title }) => (
  <Result
    status="info"
    title={title}
    subTitle="该功能正在开发中，敬请期待..."
  />
);

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  useEffect(() => {
    // 从localStorage获取学生数据
    const storedData = localStorage.getItem('studentData');
    if (storedData) {
      setStudentData(JSON.parse(storedData));
    } else {
      message.error('未找到学生数据，请重新登录');
      navigate('/login');
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('studentData');
    message.success('已退出登录');
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileContent studentData={studentData} />;
      case 'grades':
        return <GradesContent studentData={studentData} />;
      case 'points':
        return <PointsManagement studentData={studentData} />;
      case 'shop':
        return <PointsShop studentData={studentData} />;
      default:
        return <ProfileContent studentData={studentData} />;
    }
  };

  if (loading || !studentData) {
    return <div className="container">加载中...</div>;
  }

  return (
    <div className="container">
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={2}>学生个人中心</Title>
        </Col>
        <Col>
          <Button 
            type="primary" 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
          >
            退出登录
          </Button>
        </Col>
      </Row>

      
        <Menu 
          mode="horizontal" 
          selectedKeys={[activeTab]}
          onClick={(e) => setActiveTab(e.key)}
          style={{ marginBottom: 20 }}
        >
          <Menu.Item key="profile" icon={<UserOutlined />}>个人中心</Menu.Item>
          <Menu.Item key="grades" icon={<BookOutlined />}>成绩查询</Menu.Item>
          <Menu.Item key="points" icon={<WalletOutlined />}>积分管理</Menu.Item>
          <Menu.Item key="shop" icon={<ShoppingOutlined />}>积分商城</Menu.Item>
        </Menu>
    
        {renderContent()}
    </div>
  );
};

export default StudentDashboard;


// 计算星座的函数
const getZodiacSign = (dateString) => {
  if (!dateString) return '';
  
  // 将日期字符串转换为Date对象
  const date = new Date(dateString);
  const month = date.getMonth() + 1; // 月份从0开始，需要+1
  const day = date.getDate();
  
  // 根据月份和日期判断星座
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return '水瓶座';
  } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    return '双鱼座';
  } else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return '白羊座';
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return '金牛座';
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) {
    return '双子座';
  } else if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) {
    return '巨蟹座';
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return '狮子座';
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return '处女座';
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) {
    return '天秤座';
  } else if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) {
    return '天蝎座';
  } else if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) {
    return '射手座';
  } else {
    return '摩羯座';
  }
};

// 格式化日期为年月日格式
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  return `${year}年${month}月${day}日`;
};


// 积分管理内容组件
const PointsManagement = ({ studentData }) => {
  const [pointsRecords, setPointsRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classmates, setClassmates] = useState([]);

  // 获取积分流水数据
  const fetchPointsRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://api.vika.cn/fusion/v1/datasheets/dstUSDLZ3roqvJtpmD/records?viewId=viw6gl2Ug7Zo5&fieldKey=name",
        {
          headers: {
            Authorization: "Bearer usk9XDjSa7pMirYOLlM9HCW"
          }
        }
      );
      
      if (response.data && response.data.success) {
        // 筛选当前学生的积分记录
        const studentRecords = response.data.data.records.filter(
          record => record.fields.学号 === studentData.学号
        );
        // 按流水时间倒序排序
        studentRecords.sort((a, b) => b.fields.流水时间 - a.fields.流水时间);
        setPointsRecords(studentRecords);
      }
    } catch (error) {
      console.error("获取积分流水数据失败:", error);
      message.error("获取积分流水数据失败");
    } finally {
      setLoading(false);
    }
  };

  // 获取同班同学列表
  const fetchClassmates = async () => {
    try {
      const response = await axios.get(
        "https://api.vika.cn/fusion/v1/datasheets/dstbHtGyH3hJmu5uMX/records?viewId=viw3vH4QQaNgj&fieldKey=name",
        {
          headers: {
            Authorization: "Bearer usk9XDjSa7pMirYOLlM9HCW"
          }
        }
      );
      
      if (response.data && response.data.success) {
        // 筛选同班级且为学生身份的用户，排除当前用户
        const classmatesList = response.data.data.records
          .filter(record => 
            record.fields.班级 === studentData.班级 && 
            record.fields.身份 === '学生' &&
            record.fields.学号 !== studentData.学号
          )
          .map(record => ({
            学号: record.fields.学号,
            姓名: record.fields.姓名
          }));
        setClassmates(classmatesList);
      }
    } catch (error) {
      console.error("获取同班同学列表失败:", error);
      message.error("获取同班同学列表失败");
    }
  };

  // 初始化加载数据
  useEffect(() => {
    fetchPointsRecords();
    fetchClassmates();
  }, []);

  // 格式化日期
  const formatDate = (timestamp) => {
    if (!timestamp) return '未设置';
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // 积分流水表格列定义
  const columns = [
    {
      title: '流水编号',
      dataIndex: ['fields', '流水编号'],
      key: '流水编号',
    },
    {
      title: '积分变化',
      key: '积分变化',
      render: (_, record) => {
        const type = record.fields.积分增减;
        const amount = record.fields.积分变化量;
        return (
          <span style={{ color: type === '增加' ? '#52c41a' : '#f5222d' }}>
            {type === '增加' ? '+' : '-'}{amount}
          </span>
        );
      }
    },
    {
      title: '理由',
      dataIndex: ['fields', '理由'],
      key: '理由',
    },
    {
      title: '流水时间',
      dataIndex: ['fields', '流水时间'],
      key: '流水时间',
      render: (time) => formatDate(time)
    },
    {
      title: '审核状况',
      dataIndex: ['fields', '审核状况'],
      key: '审核状况',
      render: (status) => {
        let color = 'default';
        if (status === '已通过') color = 'success';
        else if (status === '已拒绝') color = 'error';
        else if (status === '审核中') color = 'processing';
        return <Tag color={color}>{status || '未知'}</Tag>;
      }
    }
  ];

  return (
    <>
      <Card className="dashboard points-management">
        <Title level={4}>积分流水</Title>
        <Table 
          dataSource={pointsRecords} 
          columns={columns} 
          rowKey={record => record.recordId}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="积分转账" style={{ marginTop: 16 }}>
            <Form
              layout="vertical"
              onFinish={async (values) => {
                try {
                  if (values.amount > studentData.积分) {
                    message.error('转账积分不能超过可用积分');
                    return;
                  }

                  const response = await axios.post(
                    'https://api.vika.cn/fusion/v1/datasheets/dstUSDLZ3roqvJtpmD/records?viewId=viw6gl2Ug7Zo5&fieldKey=name',
                    {
                      records: [
                        {
                          fields: {
                            学号: studentData.学号,
                            积分变化量: values.amount,
                            积分增减: '减少',
                            理由: `转账给${classmates.find(mate => mate.学号 === values.receiver)?.姓名 || values.receiver}：${values.reason}`
                          }
                        },
                        {
                          fields: {
                            学号: values.receiver,
                            积分变化量: values.amount,
                            积分增减: '增加',
                            理由: `收到${studentData.姓名}的转账：${values.reason}`
                          }
                        }
                      ]
                    },
                    {
                      headers: {
                        Authorization: 'Bearer usk9XDjSa7pMirYOLlM9HCW',
                        'Content-Type': 'application/json'
                      }
                    }
                  );

                  message.success('转账成功');
                  // 刷新积分数据
                  fetchStudentData();
                } catch (error) {
                  if (error) {
                  }
                }
              }}
            >
              <Form.Item
                label="选择接收人"
                name="receiver"
                rules={[{ required: true, message: '请选择接收人' }]}
              >
                <Select
                  showSearch
                  placeholder="请选择同班同学"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {classmates.map((mate) => (
                    <Option key={mate.学号} value={mate.学号}>
                      {mate.姓名}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="转账积分"
                name="amount"
                rules={[
                  { required: true, message: '请输入积分数量' },
                  {
                    type: 'number',
                    min: 1,
                    message: '积分必须大于0'
                  }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入转账积分"
                />
              </Form.Item>

              <Form.Item
                label="转账理由"
                name="reason"
                rules={[{ required: true, message: '请输入转账理由' }]}
              >
                <Input.TextArea
                  rows={2}
                  placeholder="请输入转账理由（例如：感谢帮助）"
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  立即转账
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card className="dashboard points-lottery">
            <Title level={4}>积分抽奖</Title>
            <Result
              status="info"
              title="积分抽奖功能"
              subTitle="该功能正在开发中，敬请期待..."
              extra={<Button type="primary" disabled>参与抽奖</Button>}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};