'use srtict'

//The lodash package is a popular JavaScript utility library 
// that provides helpful functions for working with arrays, objects, strings, numbers, and more. It simplifies common programming tasks such as:
const _ = require('lodash')

const getInfoData = ({ fields = [], object = {}}) => {
    return _.pick(object, fields)
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el,1]))
}

const unSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el,0]))
}

module.exports = {
    getInfoData,
    getSelectData,
    unSelectData
}