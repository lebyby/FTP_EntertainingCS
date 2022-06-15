const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    answer: {type: String, default: ""},
    problem: {type: String, default: 'Задача о разъздах'},
    score: {type: Number, default: 0},
    attempt: {type: Number, default: 0},
    date: {type: Date, default: Date.now},
    user_id: {type: Types.ObjectId, ref: 'User'}
})

module.exports = model('FirstTask', schema)
