const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    type: {type: String, required: true}, 
    description: {type: String, required: true},  
})

CategorySchema.virtual("url").get(function() {
    return `/armory/Category/${this._id}`
})

module.exports = mongoose.model("Category", CategorySchema)