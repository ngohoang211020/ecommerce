'use strict'

const mongoose = require('mongoose')

const connectString = `mongodb://localhost:27017/shopDEV`

class Database {
    constructor() {
        this.connect()
    }

    connect(type = 'mongodb') {
        //dev
        if (1 === 1) {
            mongoose.set('debug', true)

            mongoose.set('debug', {
                color: true,
            })
        }

        mongoose.connect(connectString,
            {
                maxPoolSize:50
            }
        ).then(_ => {
            console.log('MongoDB connected successfully');
        }).catch((err) => {
            console.error('MongoDB connection error:', err);
        });

    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongoDB = Database.getInstance();
module.exports = instanceMongoDB;