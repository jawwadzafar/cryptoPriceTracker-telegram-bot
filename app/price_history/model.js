const mongoose = require('mongoose');
const date = require('../utils/dateHelper');
const uuid = require('uuid');
const Schema = mongoose.Schema;

let model = new Schema({
    _id: {type: String, default: uuid.v4},
    symbol: {type: String, required: true},
    price: {type: String, required: true},
    date: {type: Number, required: true},
    createdAt: {type: Number, default: null},
    updatedAt: {type: Number, default: null}
});

model.index({date: -1});

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

module.exports = mongoose.model('price_history', model, 'price_history');