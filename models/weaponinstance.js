const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const WeaponInstanceSchema = new Schema({
    weapon: {type: Schema.Types.ObjectId, ref: "Weapon", required: true}, 
    nickname: {type: String, required: true}  
})

WeaponInstanceSchema.virtual("url").get(function() {
    return `/armory/weaponinstance/${this._id}`
})

module.exports = mongoose.model("WeaponInstance", WeaponInstanceSchema)