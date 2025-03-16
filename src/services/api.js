import axios from 'axios';

const API_BASE_URL = 'https://api.vika.cn/fusion/v1/datasheets/dstbHtGyH3hJmu5uMX/records';
const API_KEY = 'Bearer usk9XDjSa7pMirYOLlM9HCW';

const api = axios.create({
  headers: {
    'Authorization': API_KEY
  }
});

export const fetchUserData = async (username) => {
  try {
    const response = await api.get(`${API_BASE_URL}?viewId=viw3vH4QQaNgj&fieldKey=name`);
    if (response.data && response.data.data && response.data.data.records) {
      // 查找匹配用户名的记录
      const user = response.data.data.records.find(record => 
        record.fields.用户名 === username
      );
      return user ? user.fields : null;
    }
    return null;
  } catch (error) {
    console.error('获取用户数据失败:', error);
    throw error;
  }
};

export const authenticateUser = async (username, password) => {
  try {
    const userData = await fetchUserData(username);
    if (userData && userData.密码 === password) {
      return {
        authenticated: true,
        userData
      };
    }
    return {
      authenticated: false,
      message: '用户名或密码错误'
    };
  } catch (error) {
    console.error('认证失败:', error);
    return {
      authenticated: false,
      message: '认证过程中发生错误'
    };
  }
};

export const fetchAllUsers = async () => {
  try {
    const response = await api.get(`${API_BASE_URL}?viewId=viw3vH4QQaNgj&fieldKey=name`);
    return response.data.data.records.map(record => record.fields);
  } catch (error) {
    console.error('获取所有用户数据失败:', error);
    throw error;
  }
};