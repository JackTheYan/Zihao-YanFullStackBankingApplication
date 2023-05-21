"use strict";

const mongoose = require("mongoose");

const Record = mongoose.model("records");

async function queryRecord(data) {
  const resp = await Record.findOne(data);
  return resp;
}


module.exports = {
  queryRecord,
};
