'use strict'

const _ = require('lodash')

const getInforData = ({fields = [], object = {}}) => {
    return _.pick(object, fields)
}
// ['a'. 'b'] = {a: 1, b: 1}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}
// ['a'. 'b'] = {a: 0, b: 0}
const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0])) 
}
const removeUndefineObject = obj => {
    Object.keys(obj).forEach(k => {
        if(obj[k] == null) {
            delete obj[k]
        }
    })
    return obj
}
const updateNestedObjectParser = obj => {
    const final = {}
    Object.keys(obj).forEach(k => {
        if(typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
            const response = updateNestedObjectParser(obj[k])
            Object.keys(response).forEach(a => {
                final[`${k}.${a}`] = response[a]
            })
        } else {
            final[k] = obj[k]
        }
    })
    return final
}

module.exports = {
    getInforData,
    getSelectData,
    unGetSelectData,
    removeUndefineObject,
    updateNestedObjectParser
}