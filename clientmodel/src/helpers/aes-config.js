// AES Encryption & Decryption Cryptography   

const mapABC = new Map([
    ['a', 10],
    ['b', 11],
    ['c', 12],
    ['d', 13],
    ['e', 14],
    ['f', 15]
]);

const mapNum = new Map([
    [0, '7'],
    [1, '6'],
    [2, '5'],
    [3, '4'],
    [4, '3'],
    [5, '2'],
    [6, '1'],
    [7, '0']
]);

const s_box = [
    [0x63, 0x7C, 0x77, 0x7B, 0xF2, 0x6B, 0x6F, 0xC5, 0x30, 0x01, 0x67, 0x2B, 0xFE, 0xD7, 0xAB, 0x76,],
    [0xCA, 0x82, 0xC9, 0x7D, 0xFA, 0x59, 0x47, 0xF0, 0xAD, 0xD4, 0xA2, 0xAF, 0x9C, 0xA4, 0x72, 0xC0,],
    [0xB7, 0xFD, 0x93, 0x26, 0x36, 0x3F, 0xF7, 0xCC, 0x34, 0xA5, 0xE5, 0xF1, 0x71, 0xD8, 0x31, 0x15,],
    [0x04, 0xC7, 0x23, 0xC3, 0x18, 0x96, 0x05, 0x9A, 0x07, 0x12, 0x80, 0xE2, 0xEB, 0x27, 0xB2, 0x75,],
    [0x09, 0x83, 0x2C, 0x1A, 0x1B, 0x6E, 0x5A, 0xA0, 0x52, 0x3B, 0xD6, 0xB3, 0x29, 0xE3, 0x2F, 0x84,],
    [0x53, 0xD1, 0x00, 0xED, 0x20, 0xFC, 0xB1, 0x5B, 0x6A, 0xCB, 0xBE, 0x39, 0x4A, 0x4C, 0x58, 0xCF,],
    [0xD0, 0xEF, 0xAA, 0xFB, 0x43, 0x4D, 0x33, 0x85, 0x45, 0xF9, 0x02, 0x7F, 0x50, 0x3C, 0x9F, 0xA8,],
    [0x51, 0xA3, 0x40, 0x8F, 0x92, 0x9D, 0x38, 0xF5, 0xBC, 0xB6, 0xDA, 0x21, 0x10, 0xFF, 0xF3, 0xD2,],
    [0xCD, 0x0C, 0x13, 0xEC, 0x5F, 0x97, 0x44, 0x17, 0xC4, 0xA7, 0x7E, 0x3D, 0x64, 0x5D, 0x19, 0x73,],
    [0x60, 0x81, 0x4F, 0xDC, 0x22, 0x2A, 0x90, 0x88, 0x46, 0xEE, 0xB8, 0x14, 0xDE, 0x5E, 0x0B, 0xDB,],
    [0xE0, 0x32, 0x3A, 0x0A, 0x49, 0x06, 0x24, 0x5C, 0xC2, 0xD3, 0xAC, 0x62, 0x91, 0x95, 0xE4, 0x79,],
    [0xE7, 0xC8, 0x37, 0x6D, 0x8D, 0xD5, 0x4E, 0xA9, 0x6C, 0x56, 0xF4, 0xEA, 0x65, 0x7A, 0xAE, 0x08,],
    [0xBA, 0x78, 0x25, 0x2E, 0x1C, 0xA6, 0xB4, 0xC6, 0xE8, 0xDD, 0x74, 0x1F, 0x4B, 0xBD, 0x8B, 0x8A,],
    [0x70, 0x3E, 0xB5, 0x66, 0x48, 0x03, 0xF6, 0x0E, 0x61, 0x35, 0x57, 0xB9, 0x86, 0xC1, 0x1D, 0x9E,],
    [0xE1, 0xF8, 0x98, 0x11, 0x69, 0xD9, 0x8E, 0x94, 0x9B, 0x1E, 0x87, 0xE9, 0xCE, 0x55, 0x28, 0xDF,],
    [0x8C, 0xA1, 0x89, 0x0D, 0xBF, 0xE6, 0x42, 0x68, 0x41, 0x99, 0x2D, 0x0F, 0xB0, 0x54, 0xBB, 0x16]
];

const InverS_box =[
    [0x52, 0x09, 0x6A, 0xD5, 0x30, 0x36, 0xA5, 0x38, 0xBF, 0x40, 0xA3, 0x9E, 0x81, 0xF3, 0xD7, 0xFB,],
    [0x7C, 0xE3, 0x39, 0x82, 0x9B, 0x2F, 0xFF, 0x87, 0x34, 0x8E, 0x43, 0x44, 0xC4, 0xDE, 0xE9, 0xCB,],
    [0x54, 0x7B, 0x94, 0x32, 0xA6, 0xC2, 0x23, 0x3D, 0xEE, 0x4C, 0x95, 0x0B, 0x42, 0xFA, 0xC3, 0x4E,],
    [0x08, 0x2E, 0xA1, 0x66, 0x28, 0xD9, 0x24, 0xB2, 0x76, 0x5B, 0xA2, 0x49, 0x6D, 0x8B, 0xD1, 0x25,],
    [0x72, 0xF8, 0xF6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xD4, 0xA4, 0x5C, 0xCC, 0x5D, 0x65, 0xB6, 0x92,],
    [0x6C, 0x70, 0x48, 0x50, 0xFD, 0xED, 0xB9, 0xDA, 0x5E, 0x15, 0x46, 0x57, 0xA7, 0x8D, 0x9D, 0x84,],
    [0x90, 0xD8, 0xAB, 0x00, 0x8C, 0xBC, 0xD3, 0x0A, 0xF7, 0xE4, 0x58, 0x05, 0xB8, 0xB3, 0x45, 0x06,],
    [0xD0, 0x2C, 0x1E, 0x8F, 0xCA, 0x3F, 0x0F, 0x02, 0xC1, 0xAF, 0xBD, 0x03, 0x01, 0x13, 0x8A, 0x6B,],
    [0x3A, 0x91, 0x11, 0x41, 0x4F, 0x67, 0xDC, 0xEA, 0x97, 0xF2, 0xCF, 0xCE, 0xF0, 0xB4, 0xE6, 0x73,],
    [0x96, 0xAC, 0x74, 0x22, 0xE7, 0xAD, 0x35, 0x85, 0xE2, 0xF9, 0x37, 0xE8, 0x1C, 0x75, 0xDF, 0x6E,],
    [0x47, 0xF1, 0x1A, 0x71, 0x1D, 0x29, 0xC5, 0x89, 0x6F, 0xB7, 0x62, 0x0E, 0xAA, 0x18, 0xBE, 0x1B,],
    [0xFC, 0x56, 0x3E, 0x4B, 0xC6, 0xD2, 0x79, 0x20, 0x9A, 0xDB, 0xC0, 0xFE, 0x78, 0xCD, 0x5A, 0xF4,],
    [0x1F, 0xDD, 0xA8, 0x33, 0x88, 0x07, 0xC7, 0x31, 0xB1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xEC, 0x5F,],
    [0x60, 0x51, 0x7F, 0xA9, 0x19, 0xB5, 0x4A, 0x0D, 0x2D, 0xE5, 0x7A, 0x9F, 0x93, 0xC9, 0x9C, 0xEF,],
    [0xA0, 0xE0, 0x3B, 0x4D, 0xAE, 0x2A, 0xF5, 0xB0, 0xC8, 0xEB, 0xBB, 0x3C, 0x83, 0x53, 0x99, 0x61,],
    [0x17, 0x2B, 0x04, 0x7E, 0xBA, 0x77, 0xD6, 0x26, 0xE1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0C, 0x7D]
];

const ConstRound = [ 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

var ir8 = [4, 3, 1, 0];

const polinomial = (w) => {
    var s0 = "";
    var s1 = "";
    var s2 = "";
    var s3 = "";

    for(var i = 0; i < w.length; i++){
        for(var j = 0; j < 8; j++){
            if(i==0){
                if(w[i][j] == 1){
                    s0 = s0 + mapNum.get(j);
                }
            }
            else if(i==1){
                if(w[i][j] == 1){
                    s1 = s1 + mapNum.get(j);
                }
            }
            else if(i==2){
                if(w[i][j] == 1){
                    s2 = s2 + mapNum.get(j);
                }
            }
            else if(i==3){
                if(w[i][j] == 1){
                    s3 = s3 + mapNum.get(j);
                }
            }
        }
    }

    var w0 = [
        s0, s1, s2, s3
    ]

    return w0;
}

function findUniqueElements(arr) {
    var res = [];
    for(var i = 0; i < arr.length; i++){
        for(var j = i+1; j < arr.length; j++){
            if(arr[i] == arr[j]){
                arr[i] = -1;
                arr[j] = -1;
                break;
            }
        }
    }

    for(var i = 0; i < arr.length; i++){
        if(arr[i] > -1){
            res.push(arr[i]);
        }
    }

    return res;
}


var C_StateR0 = ['00000010', '00000011', '00000001', '00000001'];
var C_StateR1 = ['00000001', '00000010', '00000011', '00000001'];
var C_StateR2 = ['00000001', '00000001', '00000010', '00000011'];
var C_StateR3 = ['00000011', '00000001', '00000001', '00000010'];
var cs0 = polinomial(C_StateR0);
var cs1 = polinomial(C_StateR1);
var cs2 = polinomial(C_StateR2);
var cs3 = polinomial(C_StateR3);

var InvCState0 = ['00001110', '00001011', '00001101', '00001001'];
var InvCState1 = ['00001001', '00001110', '00001011', '00001101'];
var InvCState2 = ['00001101', '00001001', '00001110', '00001011'];
var InvCState3 = ['00001011', '00001101', '00001001', '00001110'];
var Ics0 = polinomial(InvCState0);
var Ics1 = polinomial(InvCState1);
var Ics2 = polinomial(InvCState2);
var Ics3 = polinomial(InvCState3);


/*---------------key Expansion----------------*/

const keyExpand = [];

const rotateWord = (w3) => {
    var x1 = [];
    for(var i=0; i < w3.length - 1; i++){
        x1.push(w3[i+1]);
    }
    x1.push(w3[0]);
    return x1
}

const subWord = (x1) => {
    var y1 = [];

    for (var i = 0; i < x1.length; i++) {
        var x = x1[i][0]; 
        var y = x1[i][1];
        if((x === 'a' || x === 'b' || x === 'c' || x === 'd' || x === 'e' || x === 'f') && (y === 'a' || y === 'b' || y === 'c' || y === 'd' || y === 'e' || y === 'f')){
            x = mapABC.get(x);
            y = mapABC.get(y);
            var r = (s_box[x][y]).toString(16)
            if(r.length == 1){
                var r1 = "0";
                r1 = r1 + r;
                r = r1;
            }
            y1.push(r);
        }
        else if(x === 'a' || x === 'b' || x === 'c' || x === 'd' || x === 'e' || x === 'f'){
            x = mapABC.get(x);
            var r = (s_box[x][y]).toString(16)
            if(r.length == 1){
                var r1 = "0";
                r1 = r1 + r;
                r = r1;
            }
            y1.push(r);
        }
        else if(y === 'a' || y === 'b' || y === 'c' || y === 'd' || y === 'e' || y === 'f'){
            y = mapABC.get(y);
            var r = (s_box[x][y]).toString(16)
            if(r.length == 1){
                var r1 = "0";
                r1 = r1 + r;
                r = r1;
            }
            y1.push(r);
        }
        else{
            var r = (s_box[x][y]).toString(16)
            if(r.length == 1){
                var r1 = "0";
                r1 = r1 + r;
                r = r1;
            }
            y1.push(r);
        }
    }
    return y1;
}

const InvSubWord = (x1) => {
    var y1 = [];

    for (var i = 0; i < x1.length; i++) {
        var x = x1[i][0]; 
        var y = x1[i][1];
        if((x === 'a' || x === 'b' || x === 'c' || x === 'd' || x === 'e' || x === 'f') && (y === 'a' || y === 'b' || y === 'c' || y === 'd' || y === 'e' || y === 'f')){
            x = mapABC.get(x);
            y = mapABC.get(y);
            var r = (InverS_box[x][y]).toString(16)
            if(r.length == 1){
                var r1 = "0";
                r1 = r1 + r;
                r = r1;
            }
            y1.push(r);
        }
        else if(x === 'a' || x === 'b' || x === 'c' || x === 'd' || x === 'e' || x === 'f'){
            x = mapABC.get(x);
            var r = (InverS_box[x][y]).toString(16)
            if(r.length == 1){
                var r1 = "0";
                r1 = r1 + r;
                r = r1;
            }
            y1.push(r);
        }
        else if(y === 'a' || y === 'b' || y === 'c' || y === 'd' || y === 'e' || y === 'f'){
            y = mapABC.get(y);
            var r = (InverS_box[x][y]).toString(16)
            if(r.length == 1){
                var r1 = "0";
                r1 = r1 + r;
                r = r1;
            }
            y1.push(r);
        }
        else{
            var r = (InverS_box[x][y]).toString(16)
            if(r.length == 1){
                var r1 = "0";
                r1 = r1 + r;
                r = r1;
            }
            y1.push(r);
        }
    }
    return y1;
}

const G_Function = (w3) => {
    var x1 = rotateWord(w3);
    var y1 = subWord(x1);
    var gw = [];
    for(var i = 0; i < y1.length; i++){
        if(i == 0){
            var x = parseInt(y1[i], 16);
            var y = ConstRound[countRound];
            var r = (x^y).toString(16);
            if(r.length == 1){
                var r1 = "0";
                r1 = r1 + r;
                r = r1;
            }
            gw.push(r);
        }
        else{
            var x = parseInt(y1[i], 16);
            var r = (x^0).toString(16);
            if(r.length == 1){
                var r1 = "0";
                r1 = r1 + r;
                r = r1;
            }
            gw.push(r);
        }
    }
    return gw;
}

const AddWords = (w1, w2) => {
    var w3 = [];
    for(var i = 0; i < w1.length; i++){
        var x = parseInt(w1[i], 16);
        var y = parseInt(w2[i], 16);
        var r = (x^y).toString(16)
        if(r.length == 1){
            var r1 = "0";
            r1 = r1 + r;
            r = r1;
        }
        w3.push(r);
    }
    return w3;
}

const keyExpansion = (key) => {
    var w0 = [];
    var w1 = [];
    var w2 = [];
    var w3 = [];

    for (var i = 0; i < key.length; i++) {
        for (var j = 0; j < key[0].length; j++) {
            if(j === 0){
                w0.push(key[i][j].toString(16));
            }
            else if(j === 1){
                w1.push(key[i][j].toString(16));
            }
            else if(j === 2){
                w2.push(key[i][j].toString(16));
            }
            else if (j === 3){
                w3.push(key[i][j].toString(16));
            }
        }
    }

    var gw = G_Function(w3);
    var w4 = AddWords(gw, w0);
    var w5 = AddWords(w4, w1);
    var w6 = AddWords(w5, w2);
    var w7 = AddWords(w6, w3);

    var key1 = new Array(key.length);
    for(var i = 0; i < key.length; i++){
        key1[i] = new Array(key[0].length);
    }
    for(var i = 0; i < key.length; i++){
        for(var j = 0; j < key[0].length; j++){
            if(j == 0){
                key1[i][j] = w4[i];
            }
            else if(j == 1){
                key1[i][j] = w5[i];
            }
            else if(j == 2){
                key1[i][j] = w6[i];
            }
            else if(j == 3){
                key1[i][j] = w7[i];
            }
        }
    }

    keyExpand.push(key1);
}

var countRound;

const KeyExpandFunc = (key, round) => {
    for(var i = 0; i < round; i++){
        countRound = i;
        keyExpansion(key[i]);
    }
}


/*------------key Expansion end --------------------*/

/*-------------key Encryption Start ----------------*/

const AddRoundKey = (w, k) => {
    var w0 = [];
    var w1 = [];
    var w2 = [];
    var w3 = [];
    var k0 = [];
    var k1 = [];
    var k2 = [];
    var k3 = [];

    for (var i = 0; i < w.length; i++) {
        for (var j = 0; j < w[0].length; j++) {
            if(j === 0){
                w0.push(w[i][j].toString(16));
            }
            else if(j === 1){
                w1.push(w[i][j].toString(16));
            }
            else if(j === 2){
                w2.push(w[i][j].toString(16));
            }
            else if (j === 3){
                w3.push(w[i][j].toString(16));
            }
        }
    }

    for (var i = 0; i < k.length; i++) {
        for (var j = 0; j < k[0].length; j++) {
            if(j === 0){
                k0.push(k[i][j].toString(16));
            }
            else if(j === 1){
                k1.push(k[i][j].toString(16));
            }
            else if(j === 2){
                k2.push(k[i][j].toString(16));
            }
            else if (j === 3){
                k3.push(k[i][j].toString(16));
            }
        }
    }

    var w4 = AddWords(w0,k0);
    var w5 = AddWords(w1,k1);
    var w6 = AddWords(w2,k2);
    var w7 = AddWords(w3,k3);    

    var cipher = new Array(w.length);
    for(var i = 0; i < w.length; i++){
        cipher[i] = new Array(w[0].length);
    }
    for(var i = 0; i < w.length; i++){
        for(var j = 0; j < w[0].length; j++){
            if(j == 0){
                cipher[i][j] = w4[i];
            }
            else if(j == 1){
                cipher[i][j] = w5[i];
            }
            else if(j == 2){
                cipher[i][j] = w6[i];
            }
            else if(j == 3){
                cipher[i][j] = w7[i];
            }
        }
    }

    return cipher;

}

const SubBytes = (w) => {

    var w0 = [];
    var w1 = [];
    var w2 = [];
    var w3 = [];

    for (var i = 0; i < w.length; i++) {
        for (var j = 0; j < w[0].length; j++) {
            if(j === 0){
                w0.push(w[i][j].toString(16));
            }
            else if(j === 1){
                w1.push(w[i][j].toString(16));
            }
            else if(j === 2){
                w2.push(w[i][j].toString(16));
            }
            else if (j === 3){
                w3.push(w[i][j].toString(16));
            }
        }
    }

    var w4 = subWord(w0);
    var w5 = subWord(w1);
    var w6 = subWord(w2);
    var w7 = subWord(w3);

    var subMessage= new Array(w.length);
    for(var i = 0; i < w.length; i++){
        subMessage[i] = new Array(w[0].length);
    }

    for(var i = 0; i < w.length; i++){
        for(var j = 0; j < w[0].length; j++){
            if(j == 0){
                subMessage[i][j] = w4[i];
            }
            else if(j == 1){
                subMessage[i][j] = w5[i];
            }
            else if(j == 2){
                subMessage[i][j] = w6[i];
            }
            else if(j == 3){
                subMessage[i][j] = w7[i];
            }
        }
    }

    return subMessage;
}

const InvSubBytes = (w) => {

    var w0 = [];
    var w1 = [];
    var w2 = [];
    var w3 = [];

    for (var i = 0; i < w.length; i++) {
        for (var j = 0; j < w[0].length; j++) {
            if(j === 0){
                w0.push(w[i][j].toString(16));
            }
            else if(j === 1){
                w1.push(w[i][j].toString(16));
            }
            else if(j === 2){
                w2.push(w[i][j].toString(16));
            }
            else if (j === 3){
                w3.push(w[i][j].toString(16));
            }
        }
    }

    var w4 = InvSubWord(w0);
    var w5 = InvSubWord(w1);
    var w6 = InvSubWord(w2);
    var w7 = InvSubWord(w3);

    var subMessage= new Array(w.length);
    for(var i = 0; i < w.length; i++){
        subMessage[i] = new Array(w[0].length);
    }

    for(var i = 0; i < w.length; i++){
        for(var j = 0; j < w[0].length; j++){
            if(j == 0){
                subMessage[i][j] = w4[i];
            }
            else if(j == 1){
                subMessage[i][j] = w5[i];
            }
            else if(j == 2){
                subMessage[i][j] = w6[i];
            }
            else if(j == 3){
                subMessage[i][j] = w7[i];
            }
        }
    }

    return subMessage;
}

function ShiftRows(matrix) {
    const numRows = matrix.length;
    const numCols = matrix[0].length;

    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
        const numRotations = rowIndex % numCols;
        matrix[rowIndex] = matrix[rowIndex].slice(numRotations).concat(matrix[rowIndex].slice(0, numRotations));
    }
}

function InvShiftRows(matrix) {
    const numRows = matrix.length;
    const numCols = matrix[0].length;

    const resultMatrix = [];

    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
        const numRotations = rowIndex % numCols;
        const newRow = matrix[rowIndex].slice(-numRotations).concat(matrix[rowIndex].slice(0, -numRotations));
        resultMatrix.push(newRow);
    }

    return resultMatrix;
}

const mixColumns = (w) => {
    var w0 = [];
    var w1 = [];
    var w2 = [];
    var w3 = [];

    for (var i = 0; i < w.length; i++) {
        for (var j = 0; j < w[0].length; j++) {
            if(j === 0){
                var d0 = parseInt(w[i][j], 16);
                var b0 = d0.toString(2).padStart(8, '0');
                w0.push(b0);
            }
            else if(j === 1){
                var d1 = parseInt(w[i][j], 16);
                var b1 = d1.toString(2).padStart(8, '0');
                w1.push(b1);
            }
            else if(j === 2){
                var d2 = parseInt(w[i][j], 16);
                var b2 = d2.toString(2).padStart(8, '0');
                w2.push(b2);
            }
            else if (j === 3){
                var d3 = parseInt(w[i][j], 16);
                var b3 = d3.toString(2).padStart(8, '0');
                w3.push(b3);
            }
        }
    }

    w0 = polinomial(w0);
    w1 = polinomial(w1);
    w2 = polinomial(w2);
    w3 = polinomial(w3);

    var a = Ri(w0);
    var b = Ri(w1);
    var c = Ri(w2);
    var d = Ri(w3);
    
    var res = [];
    for(var i = 0; i < w.length; i++){
        res[i] = [];
    }

    for(var i = 0; i < w.length; i++){
        for(var j = 0; j < w.length; j++){
            if(j== 0){
                res[i].push(a[i]);
            }
            else if(j == 1){
                res[i].push(b[i]);
            }
            else if(j == 2){
                res[i].push(c[i]);
            }
            else if(j == 3){
                res[i].push(d[i]);
            }
        }
    }
    

    return res;
}

const Ri = (w) => {

    var arr = new Array(w.length);
    for(var i = 0; i < w.length; i++){
        arr[i] = [];
    }

    for(var x = 0; x < w.length; x++){
        for(var i = 0; i < w.length; i++){
            if(x == 0){
                for(var j = 0; j < cs0[i].length; j++){
                    for(var k = 0; k < w[i].length; k++){
                        var temp = parseInt(w[i][k]) + parseInt(cs0[i][j]);
                        if(temp == 8){
                            for(var a = 0; a < ir8.length; a++){
                                arr[x].push(ir8[a]);
                            }
                        }
                        else if(temp > 8){
                            var diff = temp - 8;
                            for(var a = 0; a < ir8.length; a++){
                                var ele = ir8[a] + diff;
                                arr[x].push(ele);
                            }
                        }
                        else{
                            arr[x].push(temp);
                        }
                    }
                }
            }
            if(x == 1){
                for(var j = 0; j < cs1[i].length; j++){
                    for(var k = 0; k < w[i].length; k++){
                        var temp = parseInt(w[i][k]) + parseInt(cs1[i][j])
                        if(temp == 8){
                            for(var a = 0; a < ir8.length; a++){
                                arr[x].push(ir8[a]);
                            }
                        }
                        else if(temp > 8){
                            var diff = temp - 8;
                            for(var a = 0; a < ir8.length; a++){
                                var ele = ir8[a] + diff;
                                arr[x].push(ele);
                            }
                        }
                        else{
                            arr[x].push(temp);
                        }
                    }
                }
            }
            else if(x == 2){
                for(var j = 0; j < cs2[i].length; j++){
                    for(var k = 0; k < w[i].length; k++){
                        var temp = parseInt(w[i][k]) + parseInt(cs2[i][j])
                        if(temp == 8){
                            for(var a = 0; a < ir8.length; a++){
                                arr[x].push(ir8[a]);
                            }
                        }
                        else if(temp > 8){
                            var diff = temp - 8;
                            for(var a = 0; a < ir8.length; a++){
                                var ele = ir8[a] + diff;
                                arr[x].push(ele);
                            }
                        }
                        else{
                            arr[x].push(temp);
                        }
                    }
                }
            }    
            if(x == 3){
                for(var j = 0; j < cs3[i].length; j++){
                    for(var k = 0; k < w[i].length; k++){
                        var temp = parseInt(w[i][k]) + parseInt(cs3[i][j])
                        if(temp == 8){
                            for(var a = 0; a < ir8.length; a++){
                                arr[x].push(ir8[a]);
                            }
                        }
                        else if(temp > 8){
                            var diff = temp - 8;
                            for(var a = 0; a < ir8.length; a++){
                                var ele = ir8[a] + diff;
                                arr[x].push(ele);
                            }
                        }
                        else{
                            arr[x].push(temp);
                        }
                    }
                }
            }
        }
    }

    var xorArr = [];

    for(var i = 0; i < w.length; i++){
        xorArr.push(findUniqueElements(arr[i]));
    }

    var res = [];
    for(var i = 0; i < xorArr.length; i++){
        var bin = binary(xorArr[i]);
        var hex = binaryToHex(bin);
        res.push(hex);
    }

    return res;
}

const InvMixColumns = (w) => {
    var w0 = [];
    var w1 = [];
    var w2 = [];
    var w3 = [];

    for (var i = 0; i < w.length; i++) {
        for (var j = 0; j < w[0].length; j++) {
            if(j === 0){
                var d0 = parseInt(w[i][j], 16);
                var b0 = d0.toString(2).padStart(8, '0');
                w0.push(b0);
            }
            else if(j === 1){
                var d1 = parseInt(w[i][j], 16);
                var b1 = d1.toString(2).padStart(8, '0');
                w1.push(b1);
            }
            else if(j === 2){
                var d2 = parseInt(w[i][j], 16);
                var b2 = d2.toString(2).padStart(8, '0');
                w2.push(b2);
            }
            else if (j === 3){
                var d3 = parseInt(w[i][j], 16);
                var b3 = d3.toString(2).padStart(8, '0');
                w3.push(b3);
            }
        }
    }

    w0 = polinomial(w0);
    w1 = polinomial(w1);
    w2 = polinomial(w2);
    w3 = polinomial(w3);

    var a = InvRi(w0);
    var b = InvRi(w1);
    var c = InvRi(w2);
    var d = InvRi(w3);
    
    var res = [];
    for(var i = 0; i < w.length; i++){
        res[i] = [];
    }

    for(var i = 0; i < w.length; i++){
        for(var j = 0; j < w.length; j++){
            if(j== 0){
                res[i].push(a[i]);
            }
            else if(j == 1){
                res[i].push(b[i]);
            }
            else if(j == 2){
                res[i].push(c[i]);
            }
            else if(j == 3){
                res[i].push(d[i]);
            }
        }
    }
    

    return res;
}

const InvRi = (w) => {

    var arr = new Array(w.length);
    for(var i = 0; i < w.length; i++){
        arr[i] = [];
    }

    for(var x = 0; x < w.length; x++){
        for(var i = 0; i < w.length; i++){
            if(x == 0){
                for(var j = 0; j < Ics0[i].length; j++){
                    for(var k = 0; k < w[i].length; k++){
                        var temp = parseInt(w[i][k]) + parseInt(Ics0[i][j]);
                        if(temp == 8){
                            for(var a = 0; a < ir8.length; a++){
                                arr[x].push(ir8[a]);
                            }
                        }
                        else if(temp > 8){
                            var diff = temp - 8;
                            for(var a = 0; a < ir8.length; a++){
                                var ele = ir8[a] + diff;
                                arr[x].push(ele);
                            }
                        }
                        else{
                            arr[x].push(temp);
                        }
                    }
                }
            }
            if(x == 1){
                for(var j = 0; j < Ics1[i].length; j++){
                    for(var k = 0; k < w[i].length; k++){
                        var temp = parseInt(w[i][k]) + parseInt(Ics1[i][j])
                        if(temp == 8){
                            for(var a = 0; a < ir8.length; a++){
                                arr[x].push(ir8[a]);
                            }
                        }
                        else if(temp > 8){
                            var diff = temp - 8;
                            for(var a = 0; a < ir8.length; a++){
                                var ele = ir8[a] + diff;
                                arr[x].push(ele);
                            }
                        }
                        else{
                            arr[x].push(temp);
                        }
                    }
                }
            }
            else if(x == 2){
                for(var j = 0; j < Ics2[i].length; j++){
                    for(var k = 0; k < w[i].length; k++){
                        var temp = parseInt(w[i][k]) + parseInt(Ics2[i][j])
                        if(temp == 8){
                            for(var a = 0; a < ir8.length; a++){
                                arr[x].push(ir8[a]);
                            }
                        }
                        else if(temp > 8){
                            var diff = temp - 8;
                            for(var a = 0; a < ir8.length; a++){
                                var ele = ir8[a] + diff;
                                arr[x].push(ele);
                            }
                        }
                        else{
                            arr[x].push(temp);
                        }
                    }
                }
            }    
            if(x == 3){
                for(var j = 0; j < Ics3[i].length; j++){
                    for(var k = 0; k < w[i].length; k++){
                        var temp = parseInt(w[i][k]) + parseInt(Ics3[i][j])
                        if(temp == 8){
                            for(var a = 0; a < ir8.length; a++){
                                arr[x].push(ir8[a]);
                            }
                        }
                        else if(temp > 8){
                            var diff = temp - 8;
                            for(var a = 0; a < ir8.length; a++){
                                var ele = ir8[a] + diff;
                                arr[x].push(ele);
                            }
                        }
                        else{
                            arr[x].push(temp);
                        }
                    }
                }
            }
        }
    }

    var xorArr = [];

    for(var i = 0; i < w.length; i++){
        xorArr.push(findUniqueElements(arr[i]));
    }

    var res = [];
    for(var i = 0; i < xorArr.length; i++){
        var bin = binary(xorArr[i]);
        var hex = binaryToHex(bin);
        res.push(hex);
    }

    return res;
}

const binary = (xorArr) => {
    var binArr = new Array(8);
    for(var i = 0; i < 8; i++){
        binArr[i] = '0';
    }
    for(var i = 0; i < 8; i++){
        binArr[mapNum.get(xorArr[i])] = '1';
    }

    var binStr = "";
    for(var i = 0; i < binArr.length; i++){
        binStr = binStr + binArr[i];
    }

    return binStr;
}

function binaryToHex(binaryString) {
    let decimalValue = parseInt(binaryString, 2);
    let hexValue = decimalValue.toString(16);
    if(hexValue.length == 1){
        var r1 = "0";
        r1 = r1 + hexValue;
        hexValue = r1;
    }

    return hexValue;
}

const encrypt = (message, key) => {
    var subKey = new Array(key.length);
    for(var i = 0; i < key.length; i++){
        subKey[i] = new Array(key[0].length);
    }

    for(var i = 0; i < key.length; i++){
        for(var j = 0; j < key[0].length; j++){
            var r = key[i][j].toString(16);
            if(r.length == 1){
                var r1 = "0";
                r1 = r1 + r;
                r = r1;
            }
            subKey[i][j] = r;
        }
    }

    keyExpand.push(subKey);

    KeyExpandFunc(keyExpand, 10)

    var cipher = AddRoundKey(message, keyExpand[0]);

    for(var i = 1; i < keyExpand.length-1; i++){
        var submsg = SubBytes(cipher);
        ShiftRows(submsg);
        var mixMsg = mixColumns(submsg);
        var round = AddRoundKey(mixMsg, keyExpand[i]);
        cipher = round;
    }

    var submsg = SubBytes(cipher);
    ShiftRows(submsg);
    var round = AddRoundKey(submsg, keyExpand[keyExpand.length-1]);
    cipher = round;

    while(keyExpand.length > 0){
        keyExpand.pop();
    }
    return cipher;

}

const decrypt = (cipher, key) => {
    var subKey = new Array(key.length);
    for(var i = 0; i < key.length; i++){
        subKey[i] = new Array(key[0].length);
    }

    for(var i = 0; i < key.length; i++){
        for(var j = 0; j < key[0].length; j++){
            var r = key[i][j].toString(16);
            if(r.length == 1){
                var r1 = "0";
                r1 = r1 + r;
                r = r1;
            }
            subKey[i][j] = r;
        }
    }

    keyExpand.push(subKey);

    KeyExpandFunc(keyExpand, 10)

    var message = AddRoundKey(cipher, keyExpand[keyExpand.length-1]);
    
    for(var i = keyExpand.length-2; i > 0; i--){
        var invsubmsg = InvSubBytes(message);
        var invshiftrow = InvShiftRows(invsubmsg);
        var invmixcip = InvMixColumns(invshiftrow);
        var invmixkey = InvMixColumns(keyExpand[i]);
        message = AddRoundKey(invmixcip, invmixkey);
    }

    var invsubmsg = InvSubBytes(message);
    var invshiftrow = InvShiftRows(invsubmsg);
    message = AddRoundKey(invshiftrow, keyExpand[0]);

    while(keyExpand.length > 0){
        keyExpand.pop();
    }

    return message;
}

// var message = [
//     [ '61', '65', '69', '6d' ],
//     [ '62', '66', '6a', '6e' ],
//     [ '63', '67', '6b', '6f' ],
//     [ '64', '68', '6c', '70' ]
// ];

// const key = [
//     [ '61', '65', '69', '6d' ],
//     [ '62', '66', '6a', '6e' ],
//     [ '63', '67', '6b', '6f' ],
//     [ '64', '68', '6c', '70' ]
// ];

// const cipher = encrypt(message, key);
// const decryptMessage = decrypt(cipher, key);

// console.log("message:",message);
// console.log("cipher:",cipher);
// console.log("decrypted message:", decryptMessage);


function charToHex(character) {
    if (character === undefined) {
        return '00';
    }

    const codePoint = character.charCodeAt(0);
    const hexRepresentation = codePoint.toString(16);
    return hexRepresentation.length === 1 ? "0" + hexRepresentation : hexRepresentation;
}

function hexToChar(hex) {
    if (!/^[0-9A-Fa-f]+$/.test(hex)) {
        throw new Error("Invalid hexadecimal string");
    }

    const decimalValue = parseInt(hex, 16);
    const char = String.fromCharCode(decimalValue);
    return char;
}

export const encryptFile = (text, key) => {
    const characters = text.split('');
    const hashedMessage = [];
    const hashedKey = new Array(4).fill(0).map(() => new Array(4));

    for (let i = 0; i < hashedKey.length; i++) {
        hashedKey[i] = new Array(4);
    }

    for (let i = 0; i < characters.length; i += 16) {
        const subArray = [];
        for (let j = 0; j < 4; j++) {
            const column = new Array(4).fill('00');  // Initialize each column with '00'
            for (let k = 0; k < 4; k++) {
                const charIndex = i + k * 4 + j;
                if (charIndex < characters.length) {
                    const hex = charToHex(characters[charIndex]);
                    column[k] = hex;
                }
            }
            subArray.push(column);
        }
        hashedMessage.push(subArray);
    }

    let index = 0;

    for (let i = 0; i < hashedKey.length; i++) {
        for (let j = 0; j < hashedKey[0].length; j++) {
            hashedKey[j][i] = charToHex(key[index]);
            index++;
        }
    }

    var cipherMessage = [];
    for(var i = 0; i < hashedMessage.length; i++){
        const cipher = encrypt(hashedMessage[i], hashedKey);
        cipherMessage.push(cipher);
    }
    
    // console.log("cipherMessage:",cipherMessage);
    // console.log("hashedMessage:",hashedMessage)

    var cipmsg = ""
    for(var i = 0; i < cipherMessage.length; i++){
        for(var j = 0; j < cipherMessage[i].length; j++){
            for(var k = 0; k < cipherMessage[i][j].length; k++){
                var chr = hexToChar(cipherMessage[i][k][j]);
                cipmsg = cipmsg + chr;
            }
        }
    } 
    // console.log("cipherMessage:", cipmsg);
    // console.log("hashedKey1:", hashedKey);

    return cipmsg;
}


export const decryptFile = (text, key) => {
    const characters = text.split('');
    const hashedCipher = [];
    const hashedKey = new Array(4).fill(0).map(() => new Array(4));

    for (let i = 0; i < hashedKey.length; i++) {
        hashedKey[i] = new Array(4);
    }

    for(let i = 0; i < characters.length; i += 16){
        const subArray = [];
        for (let j = 0; j < 4; j++) {
            const column = new Array(4).fill('00');  // Initialize each column with '00'
            for (let k = 0; k < 4; k++) {
                const charIndex = i + k * 4 + j;
                if (charIndex < characters.length) {
                    const hex = charToHex(characters[charIndex]);
                    column[k] = hex;
                }
            }
            subArray.push(column);
        }
        hashedCipher.push(subArray);
    }

    let index = 0;

    for (let i = 0; i < hashedKey.length; i++) {
        for (let j = 0; j < hashedKey[0].length; j++) {
            hashedKey[j][i] = charToHex(key[index]);
            index++;
        }
    }

    // console.log("hashedcipher:",hashedCipher)
    var decMessage = [];
    for(var i = 0; i < hashedCipher.length; i++){
        const decmsg = decrypt(hashedCipher[i], hashedKey);
        decMessage.push(decmsg);
    }

    // console.log(decMessage);

    var message = ""
    for(var i = 0; i < decMessage.length; i++){
        for(var j = 0; j < decMessage[i].length; j++){
            for(var k = 0; k < decMessage[i][j].length; k++){
                var chr = hexToChar(decMessage[i][k][j]);
                message = message + chr;
            }
        }
    } 
    
    return message;
}



// const text = "Reinforcement learning is a machine learning paradigm where agents learn by interacting with an environment. The agent receives feedback in the form of rewards or penalties based on its actions, guiding it to discover optimal strategies. Popularized in fields like robotics and gaming, reinforcement learning enables machines to make decisions and improve performance through trial and error. Algorithms such as Q-learning and deep reinforcement learning, employing neural networks, have achieved remarkable successes, from mastering complex games like Go to optimizing control systems. This approach holds promise for autonomous systems, robotics, and AI applications where adaptive, learned behavior is crucial.";
// const key = "abcdefghijklmnop";
// console.log(text)
// const cipher = encryptFile(text, key);
// console.log(cipher);
// const message = decryptFile(cipher, key);
// console.log(message);
