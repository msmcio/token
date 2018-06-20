pragma solidity ^0.4.24;

import "./StandardToken.sol";

contract MSMToken is StandardToken {

    string public name = 'Mind Sports Mind Token';
    string public symbol = 'MSM';
    uint public decimals = 18;
    uint public INITIAL_SUPPLY = 12000;

    constructor() public{

        totalSupply_ = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;

    }

}
