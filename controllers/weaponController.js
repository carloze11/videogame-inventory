const Weapon = require("../models/weapon");
const Game = require("../models/game");
const Category = require("../models/category");
const WeaponInstance = require("../models/weaponinstance");
const { body, validationResult } = require("express-validator");

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
      name: "The Armory",
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
      res.render("weapon_list", {name: "Weapon List", weapon_list: list_weapons})
    })

};

// Display detail page for a specific weapon.
exports.weapon_detail = (req, res, next) => {
  async.parallel(
    {
      weapon(callback){
        Weapon.findById(req.params.id)
          .populate("game")
          .populate("category")
          .exec(callback)
      },
      weaponinstance(callback){
        WeaponInstance.find({ weapon: req.params.id }).exec(callback)
      },
    },

    (err, results) => {
      if (err) {
        return next(err)
      }

      if (results.weapon == null){
        err = new Error("Weapon not found")
        err.status = 404;
        return next(err)
      }

      res.render("weapon_detail", {
        name: "Weapon Details",
        weapon: results.weapon,
        weaponinstance: results.weaponinstance,
      })
    }
  )
};

// Display weapon create form on GET.
exports.weapon_create_get = (req, res, next) => {
  async.parallel(
    {
      games(callback){
        Game.find(callback)
      },
      categorys(callback){
        Category.find(callback)
      },
    },
    (err, results) => {
      if (err) {
        return next(err)
      }
      res.render("weapon_form", {
        name: "Add a New Weapon", 
        games: results.games,
        categorys: results.categorys, 
      })
    }
  )
};

// Handle weapon create on POST.
exports.weapon_create_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.category)){
      req.body.category = typeof req.body.genre === "undefined" ? [] : [req.body.genre]
    }
    next()
  },

  body("name", "Name must not be empty.").trim().isLength({ min: 1}).escape(),
  body("description", "I wanna know about the weapon!").trim().isLength({ min: 1}).escape(),
  body("game", "Choose a game!").trim().isLength({ min: 1}).escape(),
  body("category.*").escape(),
  body("tier", "How good is it?").trim().isLength({ min: 1}).escape(),

  (req, res,next) => {
    const errors = validationResult(req)
    const weapon = new Weapon({
      name: req.body.name,  
      description: req.body.description, 
      game: req.body.game,
      category: req.body.category,
      tier: req.body.tier,
    })

    if (!errors.isEmpty()){
      async.parallel(
        {
          games(callback){
            Game.find(callback);
          },
          categorys(callback){
            Category.find(callback)
          },
        },
        (err, results) => {
          if (err){
            next(err)
          }

          for (const category of results.categorys) {
            if (weapon.category.includes(category.id)) {
              category.checked = "true";
            }
          }

          res.render("weapon_form", {
            title: "Add a New Weapon", 
            games: results.games,
            categorys: results.categorys,
            errors: errors.array(), 
          }
      )}
      )
      return;
    }

      weapon.save(err => {
        if (err){
          return next(err)
        }
        res.redirect(weapon.url)
      })
  }
]

// Display weapon delete form on GET.
exports.weapon_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: weapon delete GET");
};

// Handle weapon delete on POST.
exports.weapon_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: weapon delete POST");
};

// Display weapon update form on GET.
exports.weapon_update_get = (req, res, next) => {
  async.parallel(
    {
      weapon(callback){
        Weapon.findById(req.params.id).populate("game").populate("category").exec(callback)
      },
      games(callback){
        Game.find(callback)
      },
      categorys(callback){
        Category.find(callback)
      },
    },
    (err, results) => {
      if (err) {
        return next(err)
      }
      if (results.weapon == null) {
        const err = new Error("Weapon not found")
        err.status = 404
        return next(err)
      }

      for (const category of results.categorys) {
        for (const weaponCategory of results.weapon.category) {
          if (category._id.toString() === weaponCategory._id.toString()) {
            category.checked = "true"
          }
        }
      }
      res.render("weapon_form", {
        title: "Update Weapon", 
        games: results.games,
        categorys: results.categorys,
        weapon: results.weapons
      })
    }
  )
};

// Handle weapon update on POST.
exports.weapon_update_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.category)){
      req.body.category = typeof req.body.category === "undefined" ? [] : [req.body.category]
    }
    next();
  },

  body("name", "Name must not be empty.").trim().isLength({ min: 1}).escape(),
  body("description", "Description must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("game", "Must choose a game.").trim().isLength({min: 1}).escape(),
  body("category.*").escape(),
  body("tier", "Select a tier.").trim().isLength({min: 1}).escape(),

  (req, res, next) => {
    const error = validationResult(req)
    const weapon = new Weapon({
      name: req.body.name,  
      description: req.body.description, 
      game: req.body.game,
      category: typeof req.body.category === undefined ? [] : req.body.category,
      tier: req.body.tier,
      _id: req.params.id,
    })

    if (!error.isEmpty()) {
      async.parallel(
        {
          weapon(callback){
            Weapon.findById(req.params.id).populate("game").populate("category").exec(callback)
          },
          games(callback){
            Game.find(callback)
          },
          categorys(callback){
            Category.find(callback)
          },
        },
        (err, results) => {
          if (err) {
            return next(err)
          }

          for (const category of results.categorys) {
            if (weapon.category.includes(category._id)) {
              category.checked = "true"
            }
          }
          res.render("weapon_form", {
            title: "Update Weapon", 
            games: results.games,
            categorys: results.categorys,
            weapon: results.weapon,
            errors: errors.array(),
          })
        }
      )
      return;
    }
    Weapon.findByIdAndUpdate(req.params.id, weapon, {}, (err, theweapon) => {
      if (err){
        return next(err)
      }
      res.redirect(theweapon.url)
    })
  }
]