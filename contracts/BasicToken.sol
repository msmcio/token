pragma solidity ^0.4.24;

import "./ERC20Basic.sol";
import "./SafeMath.sol";

/**
 * @title Basic token
 * @dev Basic version of StandardToken, with no allowances.
 */
contract BasicToken is ERC20Basic {
    using SafeMath for uint256;

    //地址对应的token数
    mapping(address => uint256) balances;

    //发行的token总数
    uint256 totalSupply_;

    /**
    * @dev 获取发行的token总数
    */
    function totalSupply() public view returns (uint256) {
        return totalSupply_;
    }

    /**
    * @dev 将自己的token转账给_to地址，_value为转账个数
    */
    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_to != address(0));
        require(_value <= balances[msg.sender]);

        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    /**
    * @dev 获取该地址token数
    */
    function balanceOf(address _owner) public view returns (uint256) {
        return balances[_owner];
    }

}
