import axios from 'axios';

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
    
    // 检查数据格式
    if (response.data && response.data.data && response.data.data.records) {
      console.log('\n记录数量:', response.data.data.records.length);
      
      // 显示第一条记录的结构（如果存在）
      if (response.data.data.records.length > 0) {
        const firstRecord = response.data.data.records[0];
        console.log('\n第一条记录示例:');
        console.log(JSON.stringify(firstRecord.fields, null, 2));
        
        // 检查成就相关字段
        console.log('\n成就相关字段及其类型:');
        const fields = firstRecord.fields;
        const achievementFields = Object.entries(fields).filter(([key]) => 
          key.includes('荣耀') || 
          ['学习达人', '积分之王', '进步之星', '不拖后腿', '勤奋学子', '知识探索者', '全勤达人', '白金奖牌'].includes(key)
        );
        
        achievementFields.forEach(([key, value]) => {
          console.log(`${key}: ${typeof value} - ${JSON.stringify(value)}`);
        });
      }
    } else {
      console.log('API响应结构:', JSON.stringify(response.data, null, 2));
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