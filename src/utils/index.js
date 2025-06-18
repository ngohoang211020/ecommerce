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

const removeUndefinedObject = obj => {
    Object.keys(obj).forEach(k => {
        if(obj[k] == null){
            delete obj[k]
        }
    })

    return obj
}

const updateNestedObjectParser = obj => {
    const final = {}
    Object.keys(obj).forEach( k => {
        if(typeof obj[k] === 'Object' && !Array.isArray(obj[k])){
            const response = updateNestedObjectParser(obj[k])
            Object.keys(response).forEach(a => {
                final[`${k}.${a}`] = res[a]
            })
        } else {
            final[k] = obj[k]
        }
    })
    return final
}
module.exports = {
    getInfoData,
    getSelectData,
    unSelectData,
    removeUndefinedObject,
    updateNestedObjectParser
}