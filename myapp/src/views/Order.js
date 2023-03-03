import { Card, Col, Row, Statistic, Table } from 'antd';
import { useSelector } from 'react-redux'
import moment from 'moment'


function convert(n) {
  if (!window.web || !n) return
  return window.web.web3.utils.fromWei(n, "ether")
}

function convertTime(t) {
  return moment(t * 1000).format("YYYY/MM/DD HH:mm:ss")
}

export default () => {
   const orders =  useSelector(state => state.order)
   console.log(222, orders)
    const dataSource = [
        {
          key: '1',
          name: 'Mike',
          age: 32,
          address: '10 Downing Street',
        },
        {
          key: '2',
          name: 'John',
          age: 42,
          address: '10 Downing Street',
        },
      ];
      
      const columns = [
        {
          title: '时间',
          dataIndex: 'timestamp',
          render: (timestamp) => {
            return  convertTime(timestamp)
          }
        },
        {
          title: 'DWT',
          dataIndex: 'amountGet',
          render: (amountGet) => {
            return  convert(amountGet)
          }
        },
        {
          title: 'ETH',
          dataIndex: 'amountGive',
          render: (amountGive) => {
            return  convert(amountGive)
          }
        },
      ];
    return <div style={{ marginTop: '10px' }}>
        <Row>
            <Col span={8}>
                <Card title="已完成交易" bordered={false} hoverable={true} style={{ margin: '10px' }}>
                    <Table dataSource={orders.FillOrders} columns={columns} rowKey={ item => item.id } />;
                </Card>
            </Col>
            <Col span={8}>
                <Card title="交易中-我创建的订单" bordered={false} hoverable={true} style={{ margin: '10px' }}>
                    <Table dataSource={dataSource} columns={columns} />;
                </Card>
            </Col>
            <Col span={8}>
                <Card title="交易中-其他人的订单" bordered={false} hoverable={true} style={{ margin: '10px' }}>
                    <Table dataSource={dataSource} columns={columns} />;
                </Card>
            </Col>
        </Row>
    </div>   
}