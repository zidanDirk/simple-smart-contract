// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.16 < 0.9.0;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract DanToken {
    using SafeMath for uint256;
    string public name = "DanToken";
    string public symbol = "DWT";

    uint256 public decimals = 18;

    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;

    mapping(address => mapping(address => uint256)) public allowance;


    constructor () {
        totalSupply = 1000000 * (10 ** decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(_to!=address(0));
        
        _transfer(msg.sender, _to, _value);
        return true;
    }

    function _transfer(address _from, address _to, uint256 _value ) internal {
        require(balanceOf[_from] >= _value);
        balanceOf[_from] = balanceOf[_from].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);

        // 触发事件
        emit Transfer(_from, _to, _value);
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        // msg.sender ---> 授权人 / 网页登陆人 地址
        // _spender ----> 交易所的地址
        require(_spender!=address(0));
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
        /**
        某个用户给某个交易所授权的额度
        设置到  allowance
        {
            "user1": {
                "A": 100, // user1 给 A 交易所授权的额度是 100 DanToken
                "B": 200, // user1 给 B 交易所授权的额度是 200 DanToken
            },
            "user2": {
                "A": 100,
                "B": 200,
            },
        }
         */
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        // _from 某个放款账号
        // _to 某个收款账号
        // msg.sender 交易所地址
        require(balanceOf[_from] >= _value);
        require(allowance[_from][msg.sender] >= _value);
        allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);
        _transfer(_from, _to, _value);
        return true;
    }
}