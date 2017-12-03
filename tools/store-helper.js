const store = require('store')

const update = (storeKey, key, value) => {
    let storeObject = store.get(storeKey)
    let newPair = {}
    newPair[key] = value
    storeObject ? Object.assign (storeObject, newPair)
        : storeObject = newPair
    return store.set(storeKey, storeObject)
}

const get = (storeKey) => {
    return store.get(storeKey)
}

const set = (storeKey, value) => {
    return store.set(storeKey, value)
}

module.exports = {
    update,
    get,
    set,
}
