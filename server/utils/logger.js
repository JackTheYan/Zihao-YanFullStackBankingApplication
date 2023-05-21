'use strict'

const pino = require('pino')
const config = require('../config')

module.exports = pino({
  name: 'test',
  level: config.logger.minLevel,
  enabled: config.logger.enabled,
})
