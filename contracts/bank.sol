// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Bank {
    uint public minimumDeposit = 10;
    uint public withdrawLimit = 100;
    bool public paused = false;
    mapping(address => uint256) private balances;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }

    function deposite() public payable {
        require(paused == false);
        require(msg.value >= minimumDeposit, "minimum");
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) public {
        require(paused == false);
        require(amount <= withdrawLimit, "limit");
        require(balances[msg.sender] >= amount, "Not enought money you have:(");

        // .transfer - передати валюту з контракту на акаунт
        payable(msg.sender).transfer(amount);
        balances[msg.sender] -= amount;
    }

    function pause() public {
        require(owner == msg.sender);
        paused = true;
    }

    function unpause() public {
        require(owner == msg.sender);
        paused = false;
    }
}
