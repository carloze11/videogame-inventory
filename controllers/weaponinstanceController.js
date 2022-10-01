const WeaponInstance = require("../models/weaponinstance");
const Weapon = require("../models/weapon")
const async = require("async")
const { body, validationResult } = require("express-validator");
const weapon = require("../models/weapon");

// Display list of all weaponInstances.
exports.weaponinstance_list = (req, res, next) => {
  WeaponInstance.find()
    .populate("weapon")
    .exec((err, list_weaponinstances) => {
      if (err) {
        return next(err)
      }
      res.render("weaponinstance_list", {
        title: "Weapon Nicknames",
        weaponinstance_list: list_weaponinstances,
      })
    });

};

// Display detail page for a specific weaponInstance.
exports.weaponinstance_detail = (req, res, next) => {
  async.parallel(
    {
      weaponinstance(callback){
        WeaponInstance.findById(req.params.id)
          .populate("weapon")
          .exec(callback)
      },
    },
    (err, results) => {
      if (err){
        return next(err)
      }
      if (results.weaponinstance == null){
        err = new Error("There are no weapon instances.")
        err.status = 404
        return next(err)
      }
      res.render("weaponinstance_detail", {
        title: "Weapon Instance Details", 
        weaponinstance: results.weaponinstance,
      })
    }
    
  )
};

// Display weaponInstance create form on GET.
exports.weaponinstance_create_get = (req, res) => {
  async.parallel(
    {
      weapons(callback){
        Weapon.find(callback)
      },
    },
    (err, results) => {
      if (err) {
        return next(err)
      }
      res.render("weaponinstance_form", {
        name: "Add a New Weapon Instance", 
        weapons: results.weapons, 
      })
    }
  )
};

// Handle weaponInstance create on POST.
exports.weaponinstance_create_post = [
  body("weapon", "Must select a weapon.").trim().isLength({ min: 1}).escape(),
  body("nickname", "Give it a nickname!").trim().isLength({ min: 1}).escape(),

  (req, res,next) => {
    const errors = validationResult(req)
    const weaponinstance = new WeaponInstance({
      weapon: req.body.weapon,  
      nickname: req.body.nickname,
    })

    if (!errors.isEmpty()){
      async.parallel(
        {
          weapons(callback){
            Weapon.find(callback)
          },
        },
        (err, results) => {
          if (err) {
            return next(err)
          }
          res.render("weaponinstance_form", {
            name: "Add a New Weapon Instance", 
            weapons: results.weapons,
            errors: errors.array(), 
          })
        })
        return;
    }
    
      weaponinstance.save(err => {
        if (err){
          return next(err)
        }
        res.redirect(weaponinstance.url)
      })
  }
]

// Display weaponInstance delete form on GET.
exports.weaponinstance_delete_get = (req, res, next) => {
  async.parallel(
    {
      weaponinstance(callback){
        WeaponInstance.findById(req.params.id).exec(callback)
      }
    },
    (err, results) => {
      if (err) {
        return next (err)
      }
      if (results.weaponinstance == null) {
        res.redirect("/armory/weaponinstances")
      }
      res.render("weaponinstance_delete", {
        title: "Delete Weapon Instance",
        weaponinstance: results.weaponinstance, 
      })
    }
  )
};

// Handle weaponInstance delete on POST.
exports.weaponinstance_delete_post = (req, res, next) => {
  async.parallel(
    {
      weaponinstance(callback){
        WeaponInstance.findById(req.params.id).exec(callback)
      }
    },
    (err, results) => {
      if (err) {
        return next (err)
      }
      WeaponInstance.findByIdAndRemove(req.body.weaponinstanceid, (err) => {
        if (err){
          return next(err)
        }
        res.redirect("/armory/weaponinstances")
      })
    }
  )
}

// Display weaponInstance update form on GET.
exports.weaponinstance_update_get = (req, res, next) => {
  async.parallel(
    {
      weaponinstance(callback){
        WeaponInstance.findById(req.params.id).exec(callback)
      },
      weapons(callback){
        Weapon.find(callback)
      }
    },
    (err, results) => {
      if (err) {
        return next(err)
      }
      if (results.weaponinstance == null){
        err = new Error("Weapon instance not found.")
        err.status = 404
        return next(err)
      }

      res.render("weaponinstance_form", {
        title: "Update Weapon Instance",
        weaponinstance: results.weaponinstance,
        weapons: results.weapons,
      })
    }
  )
};

// Handle weaponinstance update on POST.
exports.weaponinstance_update_post = [
  body("weapon", "Must select a weapon.").trim().isLength({ min: 1}).escape(),
  body("nickname", "Give it a nickname!").trim().isLength({ min: 1}).escape(),

  (req, res,next) => {
    const errors = validationResult(req)
    const weaponinstance = new WeaponInstance({
      weapon: req.body.weapon,  
      nickname: req.body.nickname,
      _id: req.params.id,
    })

    if (!errors.isEmpty()){
      async.parallel(
        {
          weapons(callback){
            Weapon.find(callback)
          },
        },
        (err, results) => {
          if (err) {
            return next(err)
          }
          res.render("weaponinstance_form", {
            name: "Update Weapon Instance", 
            weapons: results.weapons,
            errors: errors.array(), 
          })
        })
        return;
    }
    WeaponInstance.findByIdAndUpdate(req.params.id, weaponinstance, {}, (err, theweaponinstance) => {
      if (err){
        return next(err)
      }
      res.redirect(theweaponinstance.url)
    })
  }
]