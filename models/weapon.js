const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const WeaponSchema = new Schema({
    name: {type: String, required: true}, 
    game: {type: Schema.Types.ObjectId, ref: "Game", required: true},
    description: {type: String, required: true},
    category: [{type: Schema.Types.ObjectId, ref: "Category", required: true}],
    tier: {type: String, required: true, enum: ["Godly", "Great", "Mid", "Terrible"], default: "Mid"},    
})

WeaponSchema.virtual("url").get(function() {
    return `/armory/weapon/${this._id}`
})

module.exports = mongoose.model("Weapon", WeaponSchema)