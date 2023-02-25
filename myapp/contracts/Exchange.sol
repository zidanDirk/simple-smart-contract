// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.16 < 0.9.0;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./DanToken.sol";

contract Exchange {
    using SafeMath for uint256;
    // 收费账户地址
    address public feeAccount;
    uint256 public feePercent; // 费率
    address constant ETHER = address(0);

    mapping(address => mapping(address => uint256)) public tokens;
    /**
        {
            "比特币地址" : {
                "userA": 100,
                "userB": 200,
            },
            "DWT地址" : {
                "userA": 200,
                "userB": 300,
            },
            "以太币地址" : {
                "userA": 300,
                "userB": 400,
            },

        }
     */

    // 订单结构体
    struct _Order {
        uint256 id;
        address user;
        address tokenGet;
        uint256 amountGet;
        address tokenGive;
        uint256 amountGive;

        uint256 timestamp;
    }

    mapping(uint256 => _Order) public orders;
    mapping(uint256 => bool) public orderCancel;
    mapping(uint256 => bool) public orderFill;
    uint256 public orderCount;

    constructor(address _feeAcount, uint256 _feePercent) {
        feeAccount = _feeAcount;
        feePercent = _feePercent;
    }
    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event WithDraw(address token, address user, uint256 amount, uint256 balance);
    event Order (
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );
    event CancelOrder (
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );
    // 填充订单
    event Trade (
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );
        

    // 存以太币
    // 充值方法
    function depositEther() payable public {
        //msg.sender
        //msg.value
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }
    // 存其他币
    function depositToken(address _token, uint256 _amount) public {
        // 调用某个方法强行从你账户往当前交易所账户赚钱
        require(_token != ETHER);
        require(DanToken(_token).transferFrom(msg.sender, address(this), _amount));
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);

        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    // 提取以太币
    function withdrawEther(uint256 _amount) public {
        require(tokens[ETHER][msg.sender] >= _amount);
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
        payable(msg.sender).transfer(_amount);
        emit WithDraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
    }

    // 提取 DWT
    function withdrawToken(address _token , uint256 _amount) public {
         require(_token != ETHER);
         require(tokens[_token][msg.sender] >= _amount);
         tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
         require(DanToken(_token).transfer(msg.sender, _amount));
         emit WithDraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }
    // 查余额
    function balanceOf(address _address, address _user) public view returns(uint256) {
        return tokens[_address][_user];
    }

    // makeOrder
    function makeOrder(
        address _tokenGet,
        uint256 _amountGet, 
        address _tokenGive, 
        uint256 _amountGive
    ) public {
        require(balanceOf(_tokenGive, msg.sender) >= _amountGive, unicode"创建订单时余额不足");

        orderCount = orderCount.add(1);
        orders[orderCount] = _Order(
            orderCount, 
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );

        // 发出订单事件
        emit Order(
            orderCount, 
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );
    }

    // cancelOrder
    function cancelOrder(uint256 _id) public {
        _Order memory myOrder = orders[_id];
        require(myOrder.id == _id);
        orderCancel[_id] = true;
        emit CancelOrder(
            myOrder.id, 
            msg.sender, 
            myOrder.tokenGet, 
            myOrder.amountGet, 
            myOrder.tokenGive, 
            myOrder.amountGive,
            block.timestamp
        );
    }

    // fillOrder
    function fillOrder(uint256 _id) public {
        _Order memory myOrder = orders[_id];
        require(myOrder.id == _id);
        // 账户余额 互换 && 小费收取
        /***
            由 xiaoming , makeOder
            100 DWT => 1 ether

            xiaoming 少了 1 ether
            xiaoming 多了 100 DWT

            msg.sender 调用 fillOrder
            msg.sender 多了 1 ether
            msg.sender 少了 100 DWT
        
         */
        uint256 feeAmount = myOrder.amountGet.mul(feePercent).div(100);
        require(balanceOf(myOrder.tokenGive, myOrder.user) >= myOrder.amountGive, unicode"创建订单时用户的余额不足");
        require(balanceOf(myOrder.tokenGet, myOrder.user) >= myOrder.amountGet.add(feeAmount), unicode"填充订单时用户的余额不足");

        tokens[myOrder.tokenGet][msg.sender] = tokens[myOrder.tokenGet][msg.sender].sub(myOrder.amountGet.add(feeAmount));

        tokens[myOrder.tokenGet][feeAccount] = tokens[myOrder.tokenGet][feeAccount].add(feeAmount);

        tokens[myOrder.tokenGet][myOrder.user] = tokens[myOrder.tokenGet][myOrder.user].add(myOrder.amountGet);

        tokens[myOrder.tokenGive][msg.sender] = tokens[myOrder.tokenGive][msg.sender].add(myOrder.amountGive);
        tokens[myOrder.tokenGive][myOrder.user] = tokens[myOrder.tokenGive][myOrder.user].sub(myOrder.amountGive);

        orderFill[_id] = true;
        emit Trade(
            myOrder.id, 
            myOrder.user, 
            myOrder.tokenGet, 
            myOrder.amountGet, 
            myOrder.tokenGive, 
            myOrder.amountGive,
            block.timestamp
        );
    }

}