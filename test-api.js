const axios = require('axios');

const API_BASE_URL = 'https://api.vika.cn/fusion/v1/datasheets/dstbHtGyH3hJmu5uMX/records';
const API_KEY = 'Bearer usk9XDjSa7pMirYOLlM9HCW';

async function testAPI() {
  try {
    console.log('正在测试API连接...');
    const response = await axios.get(`${API_BASE_URL}?viewId=viw3vH4QQaNgj&fieldKey=name`, {
      headers: {
        'Authorization': API_KEY
      }
    });
    
    console.log('API响应状态:', response.status);
    console.log('API响应数据结构:', JSON.stringify(response.data, null, 2));
    
    // 检查数据格式
    if (response.data && response.data.records) {
      console.log('\n记录数量:', response.data.records.length);
      
      // 显示第一条记录的结构（如果存在）
      if (response.data.records.length > 0) {
        console.log('\n第一条记录示例:');
        console.log(JSON.stringify(response.data.records[0], null, 2));
        
        // 检查字段名称
        console.log('\n字段名称:');
        const fields = response.data.records[0].fields;
        console.log(Object.keys(fields));
        
        // 检查是否存在"用户名"字段
        if (fields.hasOwnProperty('用户名')) {
          console.log('\n✅ 存在"用户名"字段');
        } else {
          console.log('\n❌ 不存在"用户名"字段');
          console.log('可能的字段名称:', Object.keys(fields));
        }
      }
    } else {
      console.log('API响应中没有records字段');
    }
  } catch (error) {
    console.error('API请求错误:', error.message);
    if (error.response) {
      console.error('错误状态码:', error.response.status);
      console.error('错误详情:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testAPI();