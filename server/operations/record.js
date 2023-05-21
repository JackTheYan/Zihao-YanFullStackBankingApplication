"use strict";

const mongoose = require("mongoose");
const UserModel = mongoose.model("users");
const RecordModel = mongoose.model("records");

const { CommonError } = require("./../utils/errors");

async function setRecord(input) {
  const { username, email, balance, curAccount, saveAccount, bankId } = input;

  let resp;
  try {
    resp = await RecordModel.findOneAndUpdate(
      { username, email, bankId },
      {
        $set: {
          balance,
          curAccount,
          saveAccount,
        },
      },
      { returnNewDocument: true }
    );
  } catch (err) {
    console.log(err);
  }

  console.log(resp, '===res')

  return {
    returnCode: resp ? 0 : -1,
    returnMessage: resp ? "修改数据成功" : "失败",
    data: resp,
  };
}

async function transferRecord(input) {
  const { curBankId, count, transferBankId } = input;

  if(curBankId === transferBankId) {
    return CommonError(-1, "不可以和自己转账");
  }

  const user = await RecordModel.findOne({ bankId: curBankId });

  if (!user) {
    return CommonError(-1, "未找到该账号");
  }

  const record = await RecordModel.findOne({ bankId: transferBankId });

  if (!record) {
    return CommonError(-1, "未找到该账号");
  }

  

  let resp;

  try {
    const result = await RecordModel.findOneAndUpdate(
      { bankId: curBankId },
      {
        $set: {
          balance: user.balance - count,
          curAccount: user.curAccount - count,
        },
      },
      { returnNewDocument: true }
    );
    await RecordModel.findOneAndUpdate(
      { bankId: transferBankId },
      {
        $set: {
          balance: record.balance + count,
          curAccount: record.curAccount + count,
        },
      },
      { returnNewDocument: true }
    );

    resp = {
      returnCode: 0,
      returnMessage: "success",
      data: result,
    };
  } catch (err) {
    console.log(err);
    resp = CommonError(-1, "some err");
  }

  return resp;
}

async function queryRecord(input) {
  
  const { username, email } = input;

  const info = await RecordModel.findOne({ username, email });

 

  if (!info) {
    return CommonError(-1, "未找到该账号");
  }

  return {
    returnCode: 0,
    returnMessage: "查询成功",
    data: info,
  };
}

async function createAccountRecord(input) {
  const { username, email } = input;
  const info = await RecordModel.findOne({ email, username });
  if (info) {
    return {
      returnCode: 0,
      returnMessage: "已创建账号",
      data: {},
    };
  }

  let bankId = "622622";
  for (let i = 0; i < 10; i++) {
    bankId = bankId + Math.floor(Math.random() * 10);
  }
  const resp = await RecordModel.create({
    username,
    email,
    balance: 200,
    curAccount: 200,
    saveAccount: 0,
    bankId,
  });

  console.log(resp, "=====resp");

  return {
    returnCode: 0,
    returnMessage: "创建账户成功",
    data: resp,
  };
}

module.exports = {
  createAccountRecord,
  queryRecord,
  setRecord,
  transferRecord,
};
