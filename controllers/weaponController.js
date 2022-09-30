const Weapon = require("../models/weapon");
const Game = require("../models/game");
const Category = require("../models/category");
const WeaponInstance = require("../models/weaponinstance");

const async = require("async");

exports.index = (req, res) => {
  async.parallel(
    {
    weapon_count(callback){
      Weapon.countDocuments({}, callback)
    }, 
    weaponinstance_count(callback){
      WeaponInstance.countDocuments({}, callback)
    },
    game_count(callback){
      Game.countDocuments({}, callback)
    },
    category_count(callback){
      Category.countDocuments({}, callback)
    },
  },
  (err, results) => {
    res.render("index", {
      title: "The Armory",
      error: err,
      data: results,
    })
  })
};

// Display list of all weapons.
exports.weapon_list = (req, res, next) => {
  Weapon.find({}, "name game")
    .sort({game: 1})
    .populate("game")
    .exec((err, list_weapons) => {
      if (err){
        return next(err)
      }
      res.render("weapon_list", {title: "Weapon List", weapon_list: list_weapons})
    })

};

// Display detail page for a specific weapon.
exports.weapon_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: weapon detail: ${req.params.id}`);
};

// Display weapon create form on GET.
exports.weapon_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: weapon create GET");
};

// Handle weapon create on POST.
exports.weapon_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: weapon create POST");
};

// Display weapon delete form on GET.
exports.weapon_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: weapon delete GET");
};

// Handle weapon delete on POST.
exports.weapon_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: weapon delete POST");
};

// Display weapon update form on GET.
exports.weapon_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: weapon update GET");
};

// Handle weapon update on POST.
exports.weapon_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: weapon update POST");
};