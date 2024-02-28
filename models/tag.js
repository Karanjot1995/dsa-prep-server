const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    tag_id: {
      type: Number
    },
})

module.exports = mongoose.model('Tags', tagSchema)