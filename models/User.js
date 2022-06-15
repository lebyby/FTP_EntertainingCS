const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    forename: {type: String, required: true},
    surname: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    first: [{ type: Types.ObjectId, ref: 'FirstTask' }],
    second: [{ type: Types.ObjectId, ref: 'SecondTask' }]
})

module.exports = model('User', schema)



