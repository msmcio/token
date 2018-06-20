pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/MSMToken.sol";

contract TestMSMToken {

    function testTotalSupply() public {

        MSMToken token = MSMToken(DeployedAddresses.MSMToken());

        uint totalSupply = token.totalSupply();

        uint expected = 12000;

        Assert.equal(totalSupply, expected, "TotalSupply should be 12000.");

    }


    function testOwnerBalance() public {

        MSMToken token = MSMToken(DeployedAddresses.MSMToken());

        uint expected = 12000;

        uint ownerBalance = token.balanceOf(msg.sender);

        Assert.equal(ownerBalance, expected, "Owner balance should be 12000.");

    }

}