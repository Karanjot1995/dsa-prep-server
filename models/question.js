const { Int32, Double } = require('mongodb');
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: {
      type: String
    },
    code: {
      type: String
    },
    tags: [{type:String}],
    language: {
      type: String
    },
    solved: {
      type: Number
    },
    difficulty:{
      type: String
    },
    version: {
      type: String
    }
})

module.exports = mongoose.model('Questions', questionSchema)