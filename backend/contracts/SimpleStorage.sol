// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

contract SimpleStorage {
    uint private storedNumber;

    function store(uint _number) public {
        storedNumber = _number;
    }

    function retrieve() public view returns (uint) {
        return storedNumber;
    }
}