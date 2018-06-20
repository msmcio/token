pragma solidity ^0.4.24;


import "./ERC20Basic.sol";
import "./SafeMath.sol";


/**
 * @title Basic token
 * @dev Basic version of StandardToken, with no allowances.
 */
contract BasicToken is ERC20Basic {
    using SafeMath for uint256;

    //地址对应的余额
    mapping(address => uint256) balances;

    //供应量
    uint256 totalSupply_;

    /**
    * @dev 总供应量
    */
    function totalSupply() public view returns (uint256) {
        return totalSupply_;
    }

    /**
    * @dev 余额从所有者转移到指定地址
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
    * @dev 地址对应的余额
    */
    function balanceOf(address _owner) public view returns (uint256) {
        return balances[_owner];
    }

}
