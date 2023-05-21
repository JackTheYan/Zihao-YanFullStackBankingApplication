'use strict';
const mongoose = require( 'mongoose');
const config = require('../config/mongodb');


require('./schema/book');
require('./schema/user');
require('./schema/record')

const initDatabase = () => {
    mongoose.set('debug', true)
    mongoose.connect(config.db)
    mongoose.connection.on('disconnected', () => {
      mongoose.connect(config.db)
    })
    mongoose.connection.on('error', err => {
      console.error(err)
    })
  
    mongoose.connection.on('open', async () => {
      console.log('Connected to MongoDB ', config.db)
    })
  }

  module.exports = {initDatabase};
