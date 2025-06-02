'use strict'

const dev = {
    app : {
        port: process.env.DEV_APP_PORT || 3052
    },
    db : {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || 'shopDEV',
    }
}

const pro = {
    app : {
        port: process.env.PROD_APP_PORT || 3000
    },
    db : {
        host: process.env.PROD_DB_HOST || 'localhost',
        port: process.env.PROD_DB_PORT || 27017,
        name: process.env.PROD_DB_NAME || 'shopPRO',
    }
}

const config = { dev, pro }
const env = process.env.NODE_ENV || 'dev'

const currentConfig = config[env] || config.dev

module.exports = currentConfig