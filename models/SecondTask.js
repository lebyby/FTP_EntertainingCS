const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    input: {type: Number, default: 0},
    answer: {type: String, default: "Вы не закончили игру"},
    problem: {type: String, default: 'Головоломки со спичками'},
    score: {type: Number, default: 0},
    attempt: {type: Number, default: 0},
    date: {type: Date, default: Date.now},
    user_id: {type: Types.ObjectId, ref: 'User'}
})

module.exports = model('SecondTask', schema)
