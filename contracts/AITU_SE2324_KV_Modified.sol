// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AITU_SE2324_KV_Modified is ERC20, Ownable {
    struct TransactionInfo {
        address sender;
        address receiver;
        uint256 amount;
        uint256 timestamp;
    }

    TransactionInfo public latestTransaction;

    constructor(uint256 _initialSupply, address _owner) ERC20("AITU_SE2324_KV", "AITU") Ownable(_owner) {
        _mint(_owner, _initialSupply * 10 ** decimals());
    }

    function transfer(address _to, uint256 _value) public override returns (bool) {
        bool success = super.transfer(_to, _value);
        if (success) {
            latestTransaction = TransactionInfo({
                sender: msg.sender,
                receiver: _to,
                amount: _value,
                timestamp: block.timestamp
            });
        }
        return success;
    }

    function transferFrom(address _from, address _to, uint256 _value) public override returns (bool) {
        bool success = super.transferFrom(_from, _to, _value);
        if (success) {
            latestTransaction = TransactionInfo({
                sender: _from,
                receiver: _to,
                amount: _value,
                timestamp: block.timestamp
            });
        }
        return success;
    }

    function mint(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
    }

    function getLatestTransactionTimestamp() public view returns (uint256) {
        return latestTransaction.timestamp;
    }
}
