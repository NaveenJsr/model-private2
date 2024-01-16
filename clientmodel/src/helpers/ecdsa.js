const BigInt = require("big-integer");
const CryptoJS = require('crypto-js');

const cryptoHash = (input) => {
    const hash = CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
    return hash;
};

function ascii(a) {
    return a.charCodeAt(0);
}

function hexToInt(text) {
    var hashInt = 0;

    for (var i = 0; i < text.length; i++) {
        var currentCh = text[i];
        var currInt = ascii(currentCh);
        hashInt = hashInt + currInt;
    }

    return hashInt;
}

const modInverse = (a, m) => {
    a = ((a % m) + m) % m; // Ensure a is positive
    let m0 = m;
    let x0 = 0;
    let x1 = 1;

    while (a > 1) {
        let q = Math.floor(a / m);
        let t = m;

        m = a % m;
        a = t;

        t = x0;
        x0 = x1 - q * x0;
        x1 = t;
    }

    return ((x1 % m0) + m0) % m0;
};

function decToBin(decimal) {
    return (decimal >>> 0).toString(2);
}

function modulus(a, b) {
    const positiveA = Math.abs(a);
    const positiveB = Math.abs(b);
    const result = positiveA % positiveB;
    return a < 0 ? b - result : result;
}

const add_point = (P, Q, p, a) => {
    const x1 = P[0];
    const y1 = P[1];
    const x2 = Q[0];
    const y2 = Q[1];

    var s;

    if (x1 === x2 && y1 === y2) {
        s = modulus(((3 * x1 * x1 + a) * modInverse((2*y1), p)), p);
    } else {
        s = modulus(((y2 - y1) * modInverse((x2 - x1 + p), p)), p);
    }

    const x3 = modulus(((s * s) - x1 - x2 + 2*p) % p, p);
    const y3 = modulus((s * (x1 - x3) - y1 + p) % p, p);

    return [x3, y3];
};

const apply_add_point_method = (G, k, p, a) => {
    var target_point = G;
    const k_binary = decToBin(k);

    for (var i = 1; i < k_binary.length; i++) {
        var current_bit = parseInt(k_binary[i]);
        target_point = add_point(target_point, target_point, p, a);

        if (current_bit === 1) {
            target_point = add_point(target_point, G, p, a);
        }
    }

    return target_point;
}

// Base variables
var p = 17, a = 2, b = 2, q = 19, d = 7;
var A = [5, 1];
// console.log("A: ", A);
var B = apply_add_point_method(A, d, p, a);
// console.log("B: ", B);
const r = 10;


export const Signature = (data) => {
    const hm = cryptoHash(data);
    const hmIntStr = hexToInt(hm);
    const hashedMessageInt = BigInt(hmIntStr);
    console.log(hashedMessageInt);
    const third_point1 = apply_add_point_method(A, r, p, a);
    const s1 = modulus(third_point1[0], q);
    const s2 = modulus(((hashedMessageInt + d * s1) * modInverse(r, q)), q);
    return [s1, s2];
}

export const Verification = (s1, s2, data) => {
    const hmIntStr = BigInt(hexToInt(cryptoHash(data)));
    console.log(hmIntStr);
    const A1 = modulus((hmIntStr * modInverse(s2, q)), q);
    const B1 = modulus((modInverse(s2, q) * s1), q);
    const u1 = apply_add_point_method(A, A1, p, a);
    const u2 = apply_add_point_method(B, B1, p, a);
    const third_point2 = add_point(u1, u2, p, a);
    return third_point2;
}

// const data = "edzsefcxdfgvcfhcfhcfjbvgyunbvyuyujvy";
// const [s1, s2] = Signature(data);
// console.log(s1, s2);
// const verificationResult = Verification(s1, s2, data);
// console.log(verificationResult);
