const mongoose = require('mongoose');
const uuid = require('uuid');
const date = require('../utils/dateHelper');
const Schema = mongoose.Schema;

let model = new Schema({
    _id: {type: String, default: uuid.v4},
    username: {type: String},
    id: {type: Number},
    is_bot: {type: Boolean},
    chatId: {type: Number},
    isAuthorised:{type:Boolean,default:false},
    isAdmin:{type:Boolean,default:false},
    isActive:{type:Boolean, default:true},
    updatedAt: {type: Number, default: null},
    createdAt: {type: Number, default: null}
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

module.exports = mongoose.model('user', model);