'use strict';

const Crypto = require('crypto');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

const secret = 'B31F2A75FBF94099';

function decrypt(data) {
  const encryptedHexStr = CryptoJS.enc.Hex.parse(data);
  const str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  const decryptPass = CryptoJS.AES.decrypt(str, CryptoJS.enc.Utf8.parse(secret), {
    iv: CryptoJS.enc.Utf8.parse('1234567890123456'),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const decryptedStr = decryptPass.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

function encryptFun(data) {
  if (typeof data === 'object') {
    try {
      // eslint-disable-next-line no-param-reassign
      data = JSON.stringify(data);
    } catch (error) {
      console.log('encrypt error:', error);
    }
  }

  const dataHex = CryptoJS.enc.Utf8.parse(data);
  const encrypted = CryptoJS.AES.encrypt(
    dataHex,
    CryptoJS.enc.Utf8.parse('B31F2A75FBF94099'),
    {
      iv: CryptoJS.enc.Utf8.parse('1234567890123456'),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    },
  );
  return encrypted.ciphertext.toString();

}

function md5password(password) {
  console.log(password, '==password===');
  const md5 = Crypto.createHash('md5');
  const result = md5.update(password).digest('hex');
   //hex表示拿到最终为十六进制
  return result;
}

function createToken(data) {
  return jwt.sign({ ...data }, secret, {
    expiresIn: 1440, // token的过期时间
  });
}

function validToken(data) {
  let resp = {
    status: 200,
    message: '验证成功',
    data: true,
  };
  jwt.verify(data, secret, (err) => {
    if (err) {
      resp = {
        status: 401,
        message: 'token失效',
        data: false,
      };
    }
  });
  return resp;
}

module.exports = {
  decrypt,
  md5password,
  createToken,
  validToken,
  encryptFun
};
