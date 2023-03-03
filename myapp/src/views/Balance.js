import { useSelector, useDispatch } from 'react-redux'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';
// import { setTokenWallet } from '../redux/slices/balanceSlice'

function convert(n) {
    if (!window.web) return
    return window.web.web3.utils.fromWei(n, "ether")
}

export default () => {
    const {
        TokenWallet,
        TokenExchange,
        EtherWallet,
        EtherExchange
    } = useSelector(state => state.balance)
    return <div>
        <Row>
            <Col span={6}>
                <Card bordered={false} hoverable={true}>
                    <Statistic
                    title="钱包中的以太币"
                    value={convert(EtherWallet)}
                    precision={4}
                    valueStyle={{ color: '#3f8600' }}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card bordered={false} hoverable={true}>
                    <Statistic
                    title="钱包中的DWT"
                    value={convert(TokenWallet)}
                    precision={4}
                    valueStyle={{ color: '#1677ff' }}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card bordered={false} hoverable={true}>
                    <Statistic
                    title="交易所中的以太币"
                    value={convert(EtherExchange)}
                    precision={4}
                    valueStyle={{ color: '#faad14' }}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card bordered={false} hoverable={true}>
                    <Statistic
                    title="交易所中的DWT"
                    value={convert(TokenExchange)}
                    precision={4}
                    valueStyle={{ color: '#cf1332' }}
                    />
                </Card>
            </Col>
        </Row>
    </div>   
}