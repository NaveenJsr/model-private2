// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;
import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/Strings.sol";

contract String {
    using Strings for uint256;

    function toStr(uint256 _value) external pure returns (string memory) {
        return Strings.toString(_value);
    }
}

contract Generate_Shares {
    uint256 public s ;
    uint256 public n ; // no. of shares
    uint256 public k ; // threshold

    uint256 p = 10007; // prime number 7575757575757589
    uint256 r = 15; // random number
    uint public b; // modular inverse of r
    uint public z;

    // mapping (string => Share[]) keySharesOfaFile;

    // constructor() {
    //     b = multiplicativeInverse(r, p);
    //     z = (s*r) % p;
    // }   

    function input(uint secret, uint _n, string memory fileHash) external {
        s = secret;
        n = _n;
        k = _n;
        b = multiplicativeInverse(r, p);
        z = (s*r) % p;
        generate_Shares(fileHash);
    }

    // coefficients of polynomial, stored in form:
    // y = a + bx + cx2 + dx3 +.............
    uint256[] public coeffs;

    // storage of shares
    struct Share {
        uint x; uint y;
    }

    struct TempShare {
        uint x;
        uint y;
    }

    Share[] private  shares;

    struct BAndK {
        uint b;
        uint t;
    }

    mapping (string => TempShare[]) fileKeyShares;
    mapping (string => BAndK) bAndK;

    struct ShareAandB {
        TempShare[] shares;
        BAndK bk;
    }

    String tosStrCon = new String();

    function read_Shares(string memory fileHash) external view returns (ShareAandB memory) {
        TempShare[] memory shares_ = fileKeyShares[fileHash];
        BAndK memory bk = bAndK[fileHash];
        return ShareAandB(shares_, bk);
    }

    mapping (uint => bool) Xs;    // keeping check of repetition    // update this

    function generate_Shares(string memory fileHash) private {
        require(k >= 1, "invalid input was given");
        // first clear the array
        // delete sharesX; --------
        // delete sharesY; --------
        delete shares;

        // Push the constant c (equals key) (pushing at index 0)
        coeffs.push(s);
        coeffs.push(z);

        // generate k-1 random numbers and push them to coeffs[]
        // eg: for k = 3 --> find a and b (ax2 + bx + c)
        for (uint256 i = 2; i < k; i++) {
            // generate random value here
            uint256 _c = (randUint() % 100);    // WARNING !! This random value could be repeated
    
            coeffs.push(_c);
        }



        Share memory newShare;
        for (uint256 j = 0; j < n; j++) {
            // generate random value for x
            newShare.x = randUint() % 100;

            while(Xs[newShare.x] == true){ // ensuring non-repetition of x
                newShare.x = randUint() % 100;
            }
            Xs[newShare.x] = true;

            // sharesY.push(evaluatePolynomial(sharesX[j]));    -----
            newShare.y = evaluatePolynomial(newShare.x);
            TempShare memory tShare;
            tShare.x = newShare.x;
            tShare.y = newShare.y;

            shares.push(newShare);

            fileKeyShares[fileHash].push(tShare);
        }

        bAndK[fileHash].b = b;
        bAndK[fileHash].t = k;

        delete b;
        delete z;
        delete k;
        delete n;
        delete s;
        delete shares;
        delete coeffs;
        clearMapping();
        
    }

    function clearMapping() private {
        for (uint256 i = 0; i < n; i++) {
            Xs[i] = false;
        }
    }

    function evaluatePolynomial(uint256 x) private view returns (uint) {
        uint256 _y = coeffs[0];
        for (uint256 i = 1; i < k; i++) {
            _y += coeffs[i] * (x**i);
        }
        return _y % p;
    }


    // finding a^-1 % m
    function multiplicativeInverse(uint a, uint m) private pure returns (uint) {
        uint m0 = m;
        int x0 = 0;
        int x1 = 1;

        if (m == 1)
            return 0;

        while (a > 1) {
            uint q = a / m;
            (a, m) = (m, a % m);
            (x0, x1) = (x1 - int(q) * x0, x0);
        }

        if (x1 < 0)
            x1 += int(m0);

        return uint(x1);
    }

    /*
        // function calculate(uint base, uint pow, uint mod) private pure returns (uint256) {
        //     uint256 result = 1;

        //     while (pow > 0) {
        //         if (pow % 2 == 1) {
        //             result = (result * base) % mod;
        //         }
        //         pow = pow >> 1;
        //         base = (base * base) % mod;
        //     }
        //     return result;
        // }
    */


    // Defining a function to generate a random number
    uint256 randNonce = 0;

    function randUint() private returns (uint256) {
        // increase nonce
        randNonce++;
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.timestamp, msg.sender, randNonce)
                )
            );
    }
}
