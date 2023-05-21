'use strict';

module.exports = {
  key: 'SESSION_ID',
  maxAge: 24 * 60 * 60 * 1000,
  autoCommit: true,
  rolling: false,
  renew: true,
  sameSite: null,
  path: '/',
  signed: false,
  overwrite: false,
  httpOnly: true,
};
