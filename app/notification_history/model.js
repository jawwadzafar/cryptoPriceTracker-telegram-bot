/**
 * Created by dineshsharma on 12/10/18.
 */

const mongoose = require('mongoose');
const uuid = require('uuid');
const date = require('../utils/dateHelper');
const Schema = mongoose.Schema;

let model = new Schema({
    _id: {type: String, default: uuid.v4},
    isActive:{type:Boolean,default:true},
    symbol: {type: String, required: true},
    date: {type: Number, required: true},
    lastPercentageChange: {type: Number, required: true},
    updatedAt: {type: Number, default: null},
    createdAt: {type: Number, default: null},
});

model.pre('save', next=> {
    let obj = this;
    obj.updatedAt = date.unixTimestamp();
    next();
});

model.pre('findByIdAndUpdate', next=> {
    let obj = this;
    obj.updatedAt = date.unixTimestamp();
    return next();
});

model.pre('findOneAndUpdate', next=> {
    let obj = this;
    obj.updatedAt = date.unixTimestamp();
    return next();
});

module.exports = mongoose.model('notification_history', model, 'notification_history');