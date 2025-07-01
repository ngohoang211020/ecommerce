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

function updateNestedObjectParser(obj, parentKey = '', result = {}) {
  for (const key in obj) {
    if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      updateNestedObjectParser(obj[key], parentKey ? `${parentKey}.${key}` : key, result);
    } else {
      result[parentKey ? `${parentKey}.${key}` : key] = obj[key];
    }
  }
  return result;
}

module.exports = {
    getInfoData,
    getSelectData,
    unSelectData,
    removeUndefinedObject,
    updateNestedObjectParser
}