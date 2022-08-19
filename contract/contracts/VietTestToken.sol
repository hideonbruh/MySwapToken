// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
contract VietTestToken is IERC20 {
    using SafeMath for uint256;

    string public constant name = "VietTestToken";
    string public constant symbol = "VTT";
    uint8 public constant decimals = 18;
    address public owner;

    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256)) allowed;

    uint private __totalSupply = 10000000 * (10 ** decimals);

    constructor() {
        owner = msg.sender;
        balances[msg.sender] = __totalSupply;
    }

    function totalSupply() public override view returns (uint256 _totalSupply) {
        _totalSupply = __totalSupply;
    }

    function balanceOf(address tokenOwner) public override view returns (uint256) {
        return balances[tokenOwner];
    }

    function transfer(address receiver, uint256 numTokens) public override returns (bool) {
        require(numTokens <= balances[msg.sender], "Not enough tokens");
        console.log(
            "Transferring from %s to %s %s tokens",
            msg.sender,
            receiver,
            numTokens
        );
        balances[msg.sender] = balances[msg.sender].sub(numTokens);
        balances[receiver] = balances[receiver].add(numTokens);
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }

    function approve(address delegate, uint256 numTokens) public override returns (bool) {
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }

    function allowance(address account, address delegate) public override view returns (uint) {
        return allowed[account][delegate];
    }

    function transferFrom(address account, address buyer, uint256 numTokens) public override returns (bool) {
        require(numTokens <= balances[account]);
        require(numTokens <= allowed[account][msg.sender]);

        balances[account] = balances[account].sub(numTokens);
        allowed[account][msg.sender] = allowed[account][msg.sender].sub(numTokens);
        balances[buyer] = balances[buyer].add(numTokens);
        emit Transfer(account, buyer, numTokens);
        return true;
    }
}