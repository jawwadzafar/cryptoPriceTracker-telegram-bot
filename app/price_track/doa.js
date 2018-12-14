const model = require('./model');
const date = require('../utils/dateHelper');
const _ = require('lodash');

/**
 * Find
 * @param QUERY
 * @param SELECT
 * @param POPULATE
 * @param SORT
 * @param LIMIT
 * @param SKIP
 * @returns {*}
 */
let find = (QUERY, SELECT, POPULATE, SORT, LIMIT, SKIP)=> {
    return model.find(QUERY)
        .select(SELECT || '')
        .populate(POPULATE || '')
        .limit(LIMIT || '')
        .skip(SKIP || '')
        .sort(SORT || '');
}

/**
 * Find One
 * @param QUERY
 * @param SELECT
 * @param POPULATE
 * @param SORT
 * @returns {Array|{index: number, input: string}}
 */
let findOne = (QUERY, SELECT, POPULATE, SORT)=> {
    return model.findOne(QUERY)
        .select(SELECT || '')
        .populate(POPULATE || '')
        .sort(SORT || '');
}

/**
 * Create
 * @param OBJ
 * @returns {*}
 */
let create = OBJ=> {
    OBJ = _.omit(OBJ, ['_id', 'unblockAt', 'isBlocked']);
    OBJ.createdAt = date.unixTimestamp();
    OBJ.updatedAt = date.unixTimestamp();
    return new model(OBJ).save();
}


/**
 * Create bulk
 * @param OBJ_ARRAY
 * @returns {Array|{index: number, input: string}}
 */
let createBulk = OBJ_ARRAY=> {
    if (!OBJ_ARRAY.length) return [];
    return model.insertMany(OBJ_ARRAY);
}

/**
 * Update by id
 * @param QUERY
 * @param UPDATE_OBJ
 * @param NON_UPDATING
 * @returns {Array|{index: number, input: string}}
 */
let update = (QUERY, UPDATE_OBJ, NON_UPDATING)=> {
    let eliminateFields = ['createdAt'];
    eliminateFields = _.concat(eliminateFields, NON_UPDATING || '');
    UPDATE_OBJ = _.omit(JSON.parse(JSON.stringify(UPDATE_OBJ)), eliminateFields);
    UPDATE_OBJ.updatedAt = date.unixTimestamp();
    if (typeof QUERY == 'string') {
        return model.findByIdAndUpdate(QUERY, {$set: UPDATE_OBJ}, {new: true});
    } else {
        return model.findOneAndUpdate(QUERY, {$set: UPDATE_OBJ}, {new: true});
    }
}

/**
 * Count
 * @param QUERY
 * @returns {Array|{index: number, input: string}}
 */
let count = QUERY=> {
    return model.countDocuments(QUERY);
}
let deleteAll = (QUERY)=> {
    return model.remove(QUERY)
}


module.exports = {
    find: find,
    findOne: findOne,
    create: create,
    createBulk: createBulk,
    update: update,
    count: count,
    deleteAll:deleteAll,
}
