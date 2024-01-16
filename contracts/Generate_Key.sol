// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;
import "hardhat/console.sol";
import "./Generate_Shares.sol";

import "@openzeppelin/contracts/utils/Strings.sol";

contract Str {
    using Strings for uint256;

    function toStr(uint256 _value) external pure returns (string memory) {
        return Strings.toString(_value);
    }
}

library StringUtils {
    using Strings for uint256;

    function toUint(string memory _value) external pure returns (uint256) {
        return abi.decode(bytes(_value), (uint256));
    }
}

contract ToUint {
    using StringUtils for string;

    function toUint(string memory _stringValue) external pure returns (uint256) {
        return _stringValue.toUint();
    }
}

contract Generate_Key {

    address contractOwner;
    Generate_Shares genShareCon;

    ToUint toUintCon = new ToUint();

    
    struct Share {
        uint256 x;
        uint256 y;
    }

    uint256 b; // modular inverse of r
    uint256 z;
    uint public s;
    uint256 p = 10007; // prime number
    uint256 public t; // threshold

    mapping (address => mapping (string => string[])) key; // userAdd => hashFile => key

    Share[] public shares;

    function getKey(address _user, string memory _fileHash) public view returns(string[] memory){
        require(msg.sender == _user);
        return key[_user][_fileHash];
    }

    // [[1,14], [3,9], [5,7], [6,7]]        // b = 20   // secret = 12
    // [[28,10], [39,14], [29,20], [24,6]]  // b = 20   // secret = 12
    // [[81,8], [99,5], [95,3], [37,4]]     // b = 20   // secret = 65

    function input(
        address _user,
        string memory _hashFile
    ) external {
        Generate_Shares.ShareAandB memory shareDetals = genShareCon.read_Shares(_hashFile);
        t = toUintCon.toUint(shareDetals.bk.t);
        require(shareDetals.shares.length == t, "Enter only threshold number of shares");
        delete shares;
        for (uint256 i; i < shareDetals.shares.length; ) {
            Share memory newShare = Share({x: toUintCon.toUint(shareDetals.shares[i].x), y: toUintCon.toUint(shareDetals.shares[i].y)});
            shares.push(newShare);
            unchecked {
                i++;
            } // optimizing gas
        }

        b = toUintCon.toUint(shareDetals.bk.b);
        generate_Key(_user, _hashFile);
    }


    function generate_Key(address _user, string memory _hashFile) private {
        // require(
        //     shares.length == t,
        //     "Extra/ shares"
        // );

        // length = t-1,
        uint256[] memory zeros = new uint256[](t - 1); // zeros of eqn for lagrange interpolation // stores one set at a time
        int256[] memory coefficients = new int256[](t); // true coffs for each eqn  // keeps getting updated
        int256[] memory key_eqn = new int256[](t);
        /*
                // delete zeros;
                // delete coefficients;
                // delete key_eqn;

                // keeping k shares, deleting others
                // while (shares.length > t) {
                //     uint256 ind = randUint() % shares.length;

                //     shares[ind].x ^= shares[shares.length - 1].x;
                //     shares[ind].y ^= shares[shares.length - 1].y;

                //     shares[shares.length - 1].x ^= shares[ind].x;
                //     shares[shares.length - 1].y ^= shares[ind].y;

                //     shares[ind].x ^= shares[shares.length - 1].x;
                //     shares[ind].y ^= shares[shares.length - 1].y;

                //     shares.pop();
                // }
        */

        // generating key
        uint256 shares_len = shares.length;
        // for (uint256 i=3; i < 4; ) {
        for (uint256 i; i < shares_len; ) {
            uint256 _x0 = shares[i].x;
            int256 _y0 = int256(shares[i].y);

            // int256 _numerator = 1;
            int256 _denominator = 1;
            uint256 _j; // counter for zeros, as "if" condition will skip one block
            for (uint256 j; j < shares_len; ) {
                // console.log("line 83, j = ", j); //--------------------------------------------------------------------------
                if (i == j) {
                    unchecked {
                        ++j;
                    }
                    continue;
                }
                // zeros.push(shares[j].x);
                zeros[_j++] = shares[j].x;

                // _numerator *= ( - int256(shares[j].x));
                _denominator *= (int256(_x0) - int256(shares[j].x));

                unchecked {
                    ++j;
                } // optimizing gas
            }

            // working for denominator
            bool den_isNeg; // false by default
            if (_denominator < 0) {
                den_isNeg = true;
                _denominator = 0 - _denominator;
            }

            int256 inv_denm = 2; // finding multiplicative inverse
            while ((_denominator * inv_denm) % int256(p) != 1) {
                inv_denm++;
            }

            if (den_isNeg) {
                // removing (-) sign using mod operation
                inv_denm = -inv_denm;
                while (inv_denm < 0) {
                    // console.log("line 118");
                    inv_denm += int256(p);
                }
                // console.log("line 122");
            }
            // hoping denominator is handled
            // console.log("Handled denominator :", uint(inv_denm));

            // working for numerator
            // console.log("reading zeros:");
            // readArr(zeros);

            // j represents number of selections made in a pair, out of all zeros
            uint8 n_zeros = uint8(zeros.length); 
            for (uint8 j; j <= n_zeros; ) {

                find_coffs(zeros, j); // fills/overwrites mapping "coeffs"
                // readMapping();
                uint256 coff = 0;
                // finding product (a*b, b*c, c*d.....), for addition later
                uint256 combs = combinations(n_zeros, j);
                for (uint256 k; k < combs; ) {
                    uint256 local_prod = 1;
                    // console.log("pairing and multiplying following:");
                    for (uint256 l; l < coeffs[k].length; l++) {
                        if (j == 0) {
                            break;
                        }
                        // console.log(coeffs[k][l]);
                        local_prod *= coeffs[k][l];
                    }
                    coff += local_prod;
                    unchecked {
                        ++k;
                    } // optimizing gas
                    // console.log("passed");
                }


                // ab + bc + cd +.......
                coefficients[j] = int(coff);
                // console.log("line 222");
                // readCoefficients(coefficients); // reading numerator coefficients

                unchecked {
                    ++j;
                }
            }
            // console.log("line 247");
            // readCoefficients(coefficients); // reading numerator coefficients


            // refining coefficients
            for (uint256 _i; _i < coefficients.length; _i++) {

                if (_i % 2 != 0) {
                    // giving sign + or -
                    coefficients[_i] = 0-coefficients[_i];
                }

                coefficients[_i] = modulus_P(coefficients[_i]);
                
                coefficients[_i] *= inv_denm;
                
                coefficients[_i] = modulus_P(coefficients[_i]);
                
                // for key equation
                coefficients[_i] *= _y0;
                // console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                // if(coefficients[_i] < 0) {
                //     console.log("-", uint(0-coefficients[_i]));
                // } else {
                //     console.log(uint(coefficients[_i]));
                // }
                // console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");


            }

            // console.log("after refining coefficients");
            // console.log("line 273");
            // readCoefficients(coefficients);

            // deriving coefficients of key equation
            for (uint256 zz; zz < t; zz++) {
                // console.log("line 155, zz = ", zz); //--------------------------------------------------------------------------

                key_eqn[zz] += coefficients[zz];
            }

            // console.log("line 285, key equation");
            // console.log("after deriving key equation");
            // readCoefficients(key_eqn);

            unchecked {
                ++i;
            } // optimizing gas
        }

        // refining final key equation (doing modulus p)
        for (uint256 zz; zz < t; ) {
            // console.log("line 165, z = ", zz); //--------------------------------------------------------------------------

            key_eqn[zz] = modulus_P(key_eqn[zz]);
            // console.log(uint256(key_eqn[zz]));

            unchecked {
                ++zz;
            } // optimizing gas
        }
        // readCoefficients(key_eqn);
        s = uint(key_eqn[key_eqn.length - 1]);
        z = uint(key_eqn[key_eqn.length - 2]);
        cheating_detection();
        Str tosStrCon = new Str();
        key[_user][_hashFile].push(tosStrCon.toStr(s));

        delete shares;
        delete s;
        delete t;
    }

    function cheating_detection() private view returns (bool){
        return (b*z) % p == s;
    }

    // function readCoefficients(int256[] memory coff) public pure {
    //     console.log("************************************* [");
    //     console.log("printing Coefficients:");
    //     // for(uint i; i < 20; i++) {
    //     //     console.log("length of array: ", coff.length);
    //     for (uint256 j; j < coff.length; j++) {
    //         if(coff[j] < 0) {
    //             console.log("-", uint(0-coff[j]));
    //         } else {
    //             console.log(uint256(coff[j]));
    //         }
    //     }
    //     console.log("] *************************************");
    //     // }
    // }

    function modulus_P(int256 _n) private view returns (int256) {
        if (_n < 0) {
            while (_n < 0) {
                _n += int256(p);
            }
        } else {
            return _n % int256(p);
        }
        return _n;
    }


    // combinations = nCr
    function combinations(uint8 n, uint8 r) private view returns (uint256) {
        require(n <= 20, "More factorials required");
        require(r <= 20, "More factorials required");
        // console.log("line 226");
        // console.log(n, r);
        return (fac[n] / fac[r]) / fac[n - r];
    }

    mapping(uint8 => uint256) fac;

    constructor(address _genShareCon) {
        contractOwner = msg.sender;
        genShareCon = Generate_Shares(_genShareCon);
        fac[0] = 1;
        fac[1] = 1;
        fac[2] = 2;
        fac[3] = 6;
        fac[4] = 24;
        fac[5] = 120;
        fac[6] = 720;
        fac[7] = 5040;
        fac[8] = 40320;
        fac[9] = 362880;
        fac[10] = 3628800;
        fac[11] = 39916800;
        fac[12] = 479001600;
        fac[13] = 6227020800;
        fac[14] = 87178291200;
        fac[15] = 1307674368000;
        fac[16] = 20922789888000;
        fac[17] = 355687428096000;
        fac[18] = 6402373705728000;
        fac[19] = 121645100408832000;
        fac[20] = 2432902008176640000;
    }

    /* mapping stores coeffs in distributed form 
    eg: (0=>[a], 1=>[b], 2=>[c], .......), when 1 is selcted at a time
    eg: (0=>[a,b], 1=>[a,c], 2=>[b,c], .......), when 2 are selcted at a time */
    mapping(uint256 => uint256[]) coeffs;
    uint256[] private temp; // temp storage for all possible coeffs
    uint256 private q; // temp counter for uint in mapping

    // function getter(uint256 _n) public view returns (uint256[] memory) {
    //     mapping(uint256 => uint256[]) storage coeffs_ = coeffs; // creating local pointer to state variable
    //     return coeffs_[_n];
    // }

    // input: zeros array, number of selections
    function find_coffs(uint256[] memory arr, uint256 n) private {
        // finds coeffs and stores them in coeffs mapping
        mapping(uint256 => uint256[]) storage coeffs_ = coeffs;
        uint256[] storage temp_ = temp;
        genComb(arr, n, 0, coeffs_, temp_);


        delete temp; // resetting array
        q = 0;  // resetting counter
    }

    function genComb(
        uint256[] memory arr,
        uint256 n,
        uint256 start,
        mapping(uint256 => uint256[]) storage coeffs_,
        uint256[] storage temp_
    ) private {
        // helper fxn for find_coffs
        // readArr(temp_);
        // base case
        if (temp_.length == n) {
            // readArr(temp_);
            coeffs_[q] = temp_;
            q++;
            return;
        }

        // recursion
        for (uint256 i = start; i < arr.length; ) {
            temp_.push(arr[i]);
            genComb(arr, n, i + 1, coeffs_, temp_);
            temp_.pop();

            unchecked {
                ++i;
            }
        }
    }
}