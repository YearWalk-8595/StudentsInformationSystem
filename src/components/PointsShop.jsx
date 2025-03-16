import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Tag, Button, message, Select, InputNumber, Modal, Empty, Spin } from 'antd';
import { ShoppingCartOutlined, FireOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

const PointsShop = ({ studentData }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all'); // 商品状态筛选：all, 上架中, 已下架
  const [typeFilter, setTypeFilter] = useState('all'); // 商品类型筛选：all, 实物奖励, 现金奖励, 其他奖励
  const [buyModalVisible, setBuyModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);

  // 获取商品列表
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://api.vika.cn/fusion/v1/datasheets/dstMKt0YXEtD5pCw1g/records?viewId=viwzAzLqN6wg4&fieldKey=name",
        {
          headers: {
            Authorization: "Bearer usk9XDjSa7pMirYOLlM9HCW"
          }
        }
      );
      
      if (response.data && response.data.success) {
        setProducts(response.data.data.records);
      }
    } catch (error) {
      console.error("获取商品列表失败:", error);
      message.error("获取商品列表失败");
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载数据
  useEffect(() => {
    fetchProducts();
  }, []);

  // 处理商品状态筛选变化
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
  };

  // 处理商品类型筛选变化
  const handleTypeFilterChange = (value) => {
    setTypeFilter(value);
  };

  // 打开购买弹窗
  const openBuyModal = (product) => {
    setCurrentProduct(product);
    setPurchaseQuantity(1);
    setBuyModalVisible(true);
  };

  // 关闭购买弹窗
  const closeBuyModal = () => {
    setBuyModalVisible(false);
    setCurrentProduct(null);
    setPurchaseQuantity(1);
  };

  // 处理购买商品
  const handlePurchase = async () => {
    if (!currentProduct || !studentData) return;
    
    const totalCost = currentProduct.fields.价格 * purchaseQuantity;
    
    // 检查积分是否足够
    if (totalCost > studentData.当前积分) {
      message.error('积分不足，无法购买');
      return;
    }
    
    // 检查购买数量是否超过库存
    if (purchaseQuantity > currentProduct.fields.当前库存) {
      message.error('购买数量超过库存');
      return;
    }
    
    try {
      // 1. 添加积分流水记录
      await axios.post(
        "https://api.vika.cn/fusion/v1/datasheets/dstUSDLZ3roqvJtpmD/records?viewId=viw6gl2Ug7Zo5&fieldKey=name",
        {
          records: [
            {
              fields: {
                学号: studentData.学号,
                积分变化量: totalCost,
                积分增减: "减少",
                理由: `兑换${currentProduct.fields.商品名称}${purchaseQuantity}个消耗`
              }
            }
          ],
          fieldKey: "name"
        },
        {
          headers: {
            Authorization: "Bearer usk9XDjSa7pMirYOLlM9HCW",
            "Content-Type": "application/json"
          }
        }
      );
      
      // 2. 更新商品库存
      const updatedStock = currentProduct.fields.当前库存 - purchaseQuantity;
      await axios.patch(
        "https://api.vika.cn/fusion/v1/datasheets/dstMKt0YXEtD5pCw1g/records?viewId=viwzAzLqN6wg4&fieldKey=name",
        {
          records: [
            {
              recordId: currentProduct.recordId,
              fields: {
                商品名称: currentProduct.fields.商品名称,
                价格: currentProduct.fields.价格,
                最大库存: currentProduct.fields.最大库存,
                当前库存: updatedStock,
                商品类型: currentProduct.fields.商品类型,
                商品状态: currentProduct.fields.商品状态,
                商品ID: currentProduct.fields.商品ID
              }
            }
          ],
          fieldKey: "name"
        },
        {
          headers: {
            Authorization: "Bearer usk9XDjSa7pMirYOLlM9HCW",
            "Content-Type": "application/json"
          }
        }
      );
      
      message.success(`成功购买 ${currentProduct.fields.商品名称} ${purchaseQuantity}个`);
      closeBuyModal();
      fetchProducts(); // 刷新商品列表
    } catch (error) {
      console.error("购买商品失败:", error);
      message.error("购买商品失败，请稍后再试");
    }
  };

  // 筛选商品
  const filteredProducts = products.filter(product => {
    // 状态筛选
    if (statusFilter !== 'all' && product.fields.商品状态 !== statusFilter) {
      return false;
    }
    
    // 类型筛选
    if (typeFilter !== 'all' && product.fields.商品类型 !== typeFilter) {
      return false;
    }
    
    return true;
  });

  // 检查是否为热门商品（库存低于最大库存的10%）
  const isHotProduct = (product) => {
    const currentStock = product.fields.当前库存;
    const maxStock = product.fields.最大库存;
    return currentStock <= maxStock * 0.1 && currentStock > 0;
  };

  // 渲染商品卡片
  const renderProductCard = (product) => {
    const { fields } = product;
    const isHot = isHotProduct(product);
    const isOutOfStock = fields.当前库存 <= 0;
    const isOffShelf = fields.商品状态 === '已下架';
    
    // 根据商品类型设置不同的卡片样式
    const getCardStyle = (type) => {
      switch(type) {
        case '实物奖励':
          return { borderTop: '3px solid #1890ff' };
        case '现金奖励':
          return { borderTop: '3px solid #52c41a' };
        case '其他奖励':
          return { borderTop: '3px solid #faad14' };
        default:
          return {};
      }
    };
    
    return (
      <Col xs={24} sm={12} md={8} lg={6} key={product.recordId}>
        <Card
          hoverable
          style={{
            marginBottom: 16,
            position: 'relative',
            ...getCardStyle(fields.商品类型)
          }}
          actions={[
            <Button 
              type="primary" 
              icon={<ShoppingCartOutlined />}
              disabled={isOffShelf || isOutOfStock}
              onClick={() => openBuyModal(product)}
            >
              {isOutOfStock ? '已售罄' : '购买'}
            </Button>
          ]}
        >
          {isHot && !isOffShelf && !isOutOfStock && (
            <Tag color="red" style={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
              <FireOutlined /> 热门
            </Tag>
          )}
          
          <div style={{ marginBottom: 12 }}>
            <Tag color={fields.商品类型 === '实物奖励' ? 'blue' : fields.商品类型 === '现金奖励' ? 'green' : 'orange'}>
              {fields.商品类型}
            </Tag>
            <Tag color={fields.商品状态 === '上架中' ? 'success' : 'default'}>
              {fields.商品状态}
            </Tag>
          </div>
          
          <Title level={4} style={{ marginTop: 0 }}>{fields.商品名称}</Title>
          
          <div style={{ marginBottom: 8 }}>
            <Text strong style={{ fontSize: 18, color: '#f5222d' }}>{fields.价格} 积分</Text>
          </div>
          
          <div>
            <Text type="secondary">库存: {fields.当前库存}/{fields.最大库存}</Text>
          </div>
        </Card>
      </Col>
    );
  };

  return (
    <>
      <Card className="dashboard points-shop">
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4}>积分商城</Title>
          <div>
            <Select
              style={{ width: 120, marginRight: 8 }}
              value={statusFilter}
              onChange={handleStatusFilterChange}
              placeholder="商品状态"
            >
              <Option value="all">全部状态</Option>
              <Option value="上架中">上架中</Option>
              <Option value="已下架">已下架</Option>
            </Select>
            
            <Select
              style={{ width: 120 }}
              value={typeFilter}
              onChange={handleTypeFilterChange}
              placeholder="商品类型"
            >
              <Option value="all">全部类型</Option>
              <Option value="实物奖励">实物奖励</Option>
              <Option value="现金奖励">现金奖励</Option>
              <Option value="其他奖励">其他奖励</Option>
            </Select>
          </div>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <Spin size="large" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <Row gutter={16}>
            {filteredProducts.map(renderProductCard)}
          </Row>
        ) : (
          <Empty description="暂无商品" />
        )}
      </Card>
      
      {/* 购买弹窗 */}
      <Modal
        title="确认购买"
        visible={buyModalVisible}
        onCancel={closeBuyModal}
        footer={[
          <Button key="cancel" onClick={closeBuyModal}>取消</Button>,
          <Button key="buy" type="primary" onClick={handlePurchase}>确认购买</Button>
        ]}
      >
        {currentProduct && (
          <>
            <p><strong>商品名称:</strong> {currentProduct.fields.商品名称}</p>
            <p><strong>单价:</strong> {currentProduct.fields.价格} 积分</p>
            <p><strong>可用积分:</strong> {studentData.当前积分} 积分</p>
            <p><strong>库存:</strong> {currentProduct.fields.当前库存}</p>
            
            <div style={{ marginTop: 16 }}>
              <label style={{ marginRight: 8 }}>购买数量:</label>
              <InputNumber
                min={1}
                max={currentProduct.fields.当前库存}
                value={purchaseQuantity}
                onChange={setPurchaseQuantity}
              />
            </div>
            
            <div style={{ marginTop: 16 }}>
              <Text strong>总计: {currentProduct.fields.价格 * purchaseQuantity} 积分</Text>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default PointsShop;