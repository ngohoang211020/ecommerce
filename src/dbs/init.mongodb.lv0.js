'use strict'

const mongoose = require('mongoose')

const connectString = `mongodb://localhost:27017/shopDEV`

mongoose.connect(connectString).then( _ => {
    console.log('MongoDB connected successfully PRO');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

//dev
if( 1 === 1) {
    mongoose.set('debug', true)

    mongoose.set('debug', {
        color: true,
    })
}

module.exports = mongoose