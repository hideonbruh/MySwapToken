// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.1;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SwapContract is Ownable {
    using SafeMath for uint256;
    address public _tokenA;
    address public _tokenB;
    uint256 public _fixedPrice;
    event Swap(uint256 amountA, uint256 amountB);

    constructor(address tokenA, address tokenB, uint256 fixedPrice) {
        _tokenA = tokenA;
        _tokenB = tokenB;
        _fixedPrice = fixedPrice;
    }

    function SwapTokenAToB(uint256 _amountA) external {
        require(
            IERC20(_tokenA).balanceOf(msg.sender) >= _amountA,
            "User doesn't have enough token"
        );

        uint256 amountOut = _amountA.mul(_fixedPrice).div(100);
        require(
            IERC20(_tokenB).balanceOf(address(this)) >= amountOut,
            "Contract doesn't have enough token"
        );

        IERC20(_tokenA).transferFrom(msg.sender, address(this), _amountA);

        IERC20(_tokenB).transfer(msg.sender, amountOut);
        emit Swap(_amountA, amountOut);
    }

    function setAddressTokenA(address tokenA) external onlyOwner {
        _tokenA = tokenA;
    }

    function setAddressTokenB(address tokenB) external onlyOwner {
        _tokenB = tokenB;
    }

    function setFixedPrice(uint256 fixedPrice) external onlyOwner {
        _fixedPrice = fixedPrice;
    }
}
