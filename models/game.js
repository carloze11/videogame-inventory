const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const GameSchema = new Schema({
    title: {type: String, required: true}, 
    dev: {type: String, required: true},
    description: {type: String, required: true},
    release_date: {type: Date}, 
})

GameSchema.virtual("url").get(function() {
    return `/armory/game/${this._id}`
})

GameSchema.virtual("released").get(function(){
    return DateTime.fromJSDate(this.release_date).toLocaleString(DateTime.DATE_MED)
})

module.exports = mongoose.model("Game", GameSchema)