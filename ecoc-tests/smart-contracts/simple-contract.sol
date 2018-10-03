pragma solidity ^0.4.24;

contract SimpleContract {
  uint sum;
  
function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
      } 
}
